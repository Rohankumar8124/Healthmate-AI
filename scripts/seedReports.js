import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env file');
    process.exit(1);
}

// NOTE: You need to replace this with your actual Clerk userId
// You can find it by logging in and checking the browser console or database
const YOUR_USER_ID = 'user_PLACEHOLDER'; // ⚠️ REPLACE THIS

const sampleReports = [
    {
        userId: YOUR_USER_ID,
        userName: 'Rohan',
        symptoms: ['Headache', 'Fatigue', 'Muscle aches'],
        additionalInfo: 'Symptoms started 2 days ago, feeling worn out',
        diagnosis: {
            possibleConditions: [
                {
                    name: 'Tension Headache with Fatigue',
                    probability: 'High',
                    description: 'Common symptoms of stress and overwork',
                    matchingSymptoms: ['Headache', 'Fatigue', 'Muscle aches']
                }
            ],
            suggestedMedicines: [
                {
                    name: 'Ibuprofen',
                    type: 'OTC',
                    dosage: '400mg',
                    frequency: 'Every 6-8 hours with food',
                    duration: '3-5 days',
                    purpose: 'Pain relief and anti-inflammatory',
                    warnings: 'Take with food. Not for those with stomach issues.'
                }
            ],
            homeRemedies: [
                {
                    remedy: 'Rest and Hydration',
                    instructions: 'Get adequate sleep (7-9 hours) and drink plenty of water',
                    effectiveness: 'High'
                }
            ],
            lifestyle: ['Reduce screen time', 'Take regular breaks', 'Practice stress management'],
            whenToSeeDoctor: 'If headache persists for more than 3 days or becomes severe',
            urgencyLevel: 'low',
            overallAssessment: 'Based on your symptoms, this appears to be stress-related. Rest and over-the-counter pain relief should help.',
            analysisDetails: {
                symptomCount: 3,
                patternsIdentified: ['stress-related'],
                urgencyScore: 2
            }
        },
        urgencyLevel: 'low',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
        userId: YOUR_USER_ID,
        userName: 'Rohan',
        symptoms: ['Fever', 'Cough', 'Sore throat'],
        additionalInfo: 'Temperature around 100°F, dry cough',
        diagnosis: {
            possibleConditions: [
                {
                    name: 'Upper Respiratory Infection',
                    probability: 'High',
                    description: 'Viral infection affecting throat and respiratory system',
                    matchingSymptoms: ['Fever', 'Cough', 'Sore throat']
                }
            ],
            suggestedMedicines: [
                {
                    name: 'Paracetamol',
                    type: 'OTC',
                    dosage: '500mg',
                    frequency: 'Every 6 hours if fever persists',
                    duration: 'Until fever resolves',
                    purpose: 'Fever reduction',
                    warnings: 'Maximum 4g per day'
                },
                {
                    name: 'Throat Lozenges',
                    type: 'OTC',
                    dosage: '1 lozenge',
                    frequency: 'Every 2-3 hours',
                    duration: '5-7 days',
                    purpose: 'Soothes throat irritation',
                    warnings: 'Do not exceed 12 per day'
                }
            ],
            homeRemedies: [
                {
                    remedy: 'Warm Salt Water Gargle',
                    instructions: 'Mix 1/2 tsp salt in warm water, gargle 3-4 times daily',
                    effectiveness: 'High'
                },
                {
                    remedy: 'Steam Inhalation',
                    instructions: 'Inhale steam for 10 minutes, 2-3 times daily',
                    effectiveness: 'Medium'
                }
            ],
            lifestyle: ['Rest completely', 'Drink warm fluids', 'Avoid cold foods'],
            whenToSeeDoctor: 'If fever exceeds 103°F or lasts more than 3 days',
            urgencyLevel: 'medium',
            overallAssessment: 'You likely have a viral upper respiratory infection. Rest, fluids, and symptomatic treatment should help recovery.',
            analysisDetails: {
                symptomCount: 3,
                patternsIdentified: ['respiratory', 'viral'],
                urgencyScore: 4
            }
        },
        urgencyLevel: 'medium',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
        userId: YOUR_USER_ID,
        userName: 'Rohan',
        symptoms: ['Stomach pain', 'Nausea'],
        additionalInfo: 'Pain started after meal, feeling queasy',
        diagnosis: {
            possibleConditions: [
                {
                    name: 'Indigestion / Dyspepsia',
                    probability: 'High',
                    description: 'Stomach discomfort likely from food',
                    matchingSymptoms: ['Stomach pain', 'Nausea']
                }
            ],
            suggestedMedicines: [
                {
                    name: 'Antacid',
                    type: 'OTC',
                    dosage: '10-20ml',
                    frequency: 'After meals and at bedtime',
                    duration: '2-3 days',
                    purpose: 'Neutralize stomach acid',
                    warnings: 'Do not use for more than 2 weeks'
                }
            ],
            homeRemedies: [
                {
                    remedy: 'Ginger Tea',
                    instructions: 'Steep fresh ginger in hot water, drink warm',
                    effectiveness: 'High'
                }
            ],
            lifestyle: ['Eat light meals', 'Avoid spicy/oily foods', 'Eat slowly'],
            whenToSeeDoctor: 'If pain becomes severe or blood appears in vomit',
            urgencyLevel: 'low',
            overallAssessment: 'Appears to be simple indigestion. Avoid heavy meals and use antacids as needed.',
            analysisDetails: {
                symptomCount: 2,
                patternsIdentified: ['digestive'],
                urgencyScore: 1
            }
        },
        urgencyLevel: 'low',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
    }
];

async function seedReports() {
    try {
        if (YOUR_USER_ID === 'user_PLACEHOLDER') {
            console.error('❌ ERROR: You need to set YOUR_USER_ID in the script!');
            console.log('\n📝 To find your Clerk userId:');
            console.log('   1. Log into your app at http://localhost:3000');
            console.log('   2. Open browser console (F12)');
            console.log('   3. Type: window.Clerk?.user?.id');
            console.log('   4. Copy that ID and paste it in this script\n');
            process.exit(1);
        }

        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!');

        // Define Report schema inline
        const ReportSchema = new mongoose.Schema({
            userId: { type: String, required: true, index: true },
            userName: { type: String, required: true },
            symptoms: [{ type: String, required: true }],
            additionalInfo: { type: String, default: '' },
            diagnosis: { type: mongoose.Schema.Types.Mixed, required: true },
            urgencyLevel: {
                type: String,
                enum: ['low', 'medium', 'high', 'emergency'],
                required: true
            },
            createdAt: { type: Date, default: Date.now, index: true }
        });

        const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);

        console.log(`\n📝 Inserting ${sampleReports.length} sample reports for user: ${YOUR_USER_ID}`);

        // Check if reports already exist
        const existingCount = await Report.countDocuments({ userId: YOUR_USER_ID });
        console.log(`   Found ${existingCount} existing reports`);

        const result = await Report.insertMany(sampleReports);
        console.log(`✅ Successfully inserted ${result.length} sample diagnosis reports!`);

        console.log('\n📊 Reports Summary:');
        sampleReports.forEach((report, index) => {
            console.log(`   ${index + 1}. ${report.symptoms.join(', ')} (${report.urgencyLevel} urgency)`);
        });

        console.log('\n🎉 Sample reports added successfully!');
        console.log('🌐 Refresh your dashboard to see them: http://localhost:3000');

    } catch (error) {
        console.error('❌ Error seeding reports:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
}

seedReports();
