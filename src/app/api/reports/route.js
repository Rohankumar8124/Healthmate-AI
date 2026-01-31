import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/app/lib/mongodb';
import Report from '@/app/models/Report';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = await connectDB();
        if (!db) {
            return NextResponse.json({
                success: true,
                reports: [],
                message: 'Database not configured'
            });
        }

        // Get user email from Clerk
        const { currentUser } = await import('@clerk/nextjs/server');
        const user = await currentUser();
        const userEmail = user?.emailAddresses?.[0]?.emailAddress;

        if (!userEmail) {
            return NextResponse.json({
                success: true,
                reports: [],
                message: 'User email not found'
            });
        }

        // Fetch diagnosis reports from MediCare_Admin collection matching user email
        const mongoose = await import('mongoose');
        const collection = mongoose.connection.db.collection('MediCare_Admin');
        const diagnosisReports = await collection
            .find({
                type: 'diagnosis_report',
                userEmail: userEmail
            })
            .sort({ createdAt: -1 })
            .limit(50)
            .toArray();

        return NextResponse.json({
            success: true,
            reports: diagnosisReports.map(report => ({
                id: report._id.toString(),
                symptoms: report.symptoms,
                additionalInfo: report.additionalInfo,
                diagnosis: report.diagnosis,
                urgencyLevel: report.urgencyLevel,
                createdAt: report.createdAt,
            })),
        });

    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reports', details: error.message },
            { status: 500 }
        );
    }
}
