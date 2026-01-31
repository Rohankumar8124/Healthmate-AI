import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/app/lib/mongodb';
import Report from '@/app/models/Report';

async function saveReportToDatabase(symptoms, additionalInfo, diagnosis) {
    try {
        const { userId } = await auth();
        if (!userId) {
            console.log('⚠️ No user ID - skipping report save');
            return;
        }

        const user = await currentUser();
        const userName = user?.firstName || user?.username || 'User';
        const userEmail = user?.emailAddresses?.[0]?.emailAddress;

        if (!userEmail) {
            console.log('⚠️ No user email - skipping report save');
            return;
        }

        const db = await connectDB();
        if (!db) {
            console.log('⚠️ Database not connected - skipping report save');
            return;
        }

        // Save to MediCare_Admin collection with email-based matching
        const mongoose = await import('mongoose');
        const collection = mongoose.connection.db.collection('MediCare_Admin');

        const reportDoc = {
            type: 'diagnosis_report',
            userEmail,
            userName,
            symptoms,
            additionalInfo: additionalInfo || '',
            diagnosis,
            urgencyLevel: diagnosis.urgencyLevel || 'low',
            createdAt: new Date()
        };

        await collection.insertOne(reportDoc);
        console.log('✅ Report saved to MediCare_Admin collection');
    } catch (error) {
        console.error('❌ Error saving report:', error.message);
        // Don't throw - we don't want to fail the request if DB save fails
    }
}

export { saveReportToDatabase };
