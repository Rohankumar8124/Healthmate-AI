import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env file');
    process.exit(1);
}

// Sample admin data
const adminData = [
    {
        type: 'admin_user',
        username: 'admin',
        email: 'rammeena8124@gmail.com',
        role: 'super_admin',
        permissions: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date()
    },
    {
        type: 'admin_user',
        username: 'doctor_admin',
        email: 'rammeena8124@gmail.com',
        role: 'medical_admin',
        permissions: ['read', 'write', 'manage_medicines'],
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date()
    },
    {
        type: 'medicine',
        name: 'Paracetamol',
        genericName: 'Acetaminophen',
        category: 'Analgesic/Antipyretic',
        dosageForms: ['500mg tablet', '650mg tablet', '120mg/5ml suspension'],
        commonUses: ['Fever reduction', 'Pain relief', 'Headache'],
        sideEffects: ['Rare: Nausea', 'Liver damage (if overdosed)'],
        contraindications: ['Severe liver disease', 'Alcohol abuse'],
        maxDailyDose: '4000mg',
        prescriptionRequired: false,
        manufacturer: 'Generic',
        createdAt: new Date()
    },
    {
        type: 'medicine',
        name: 'Ibuprofen',
        genericName: 'Ibuprofen',
        category: 'NSAID (Non-Steroidal Anti-Inflammatory)',
        dosageForms: ['200mg tablet', '400mg tablet', '100mg/5ml suspension'],
        commonUses: ['Pain relief', 'Inflammation reduction', 'Fever reduction'],
        sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness'],
        contraindications: ['Stomach ulcers', 'Kidney disease', 'Heart disease', 'Pregnancy (3rd trimester)'],
        maxDailyDose: '1200mg (OTC), 3200mg (prescription)',
        prescriptionRequired: false,
        manufacturer: 'Generic',
        createdAt: new Date()
    },
    {
        type: 'medicine',
        name: 'Cetirizine',
        genericName: 'Cetirizine',
        category: 'Antihistamine',
        dosageForms: ['10mg tablet', '5mg/5ml syrup'],
        commonUses: ['Allergic rhinitis', 'Urticaria (hives)', 'Seasonal allergies'],
        sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue'],
        contraindications: ['Severe kidney disease', 'Pregnancy (consult doctor)'],
        maxDailyDose: '10mg',
        prescriptionRequired: false,
        manufacturer: 'Generic',
        createdAt: new Date()
    },
    {
        type: 'medicine',
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        category: 'Antibiotic (Penicillin)',
        dosageForms: ['250mg capsule', '500mg capsule', '125mg/5ml suspension'],
        commonUses: ['Bacterial infections', 'Respiratory infections', 'Ear infections'],
        sideEffects: ['Diarrhea', 'Nausea', 'Skin rash', 'Allergic reactions'],
        contraindications: ['Penicillin allergy', 'Severe kidney disease'],
        maxDailyDose: 'Varies by condition (500mg-1000mg every 8 hours)',
        prescriptionRequired: true,
        manufacturer: 'Generic',
        createdAt: new Date()
    },
    {
        type: 'medicine',
        name: 'Omeprazole',
        genericName: 'Omeprazole',
        category: 'Proton Pump Inhibitor (PPI)',
        dosageForms: ['20mg capsule', '40mg capsule'],
        commonUses: ['Acid reflux (GERD)', 'Stomach ulcers', 'Heartburn'],
        sideEffects: ['Headache', 'Nausea', 'Diarrhea', 'Abdominal pain'],
        contraindications: ['Liver disease (adjust dose)', 'Osteoporosis risk'],
        maxDailyDose: '40mg',
        prescriptionRequired: false,
        manufacturer: 'Generic',
        createdAt: new Date()
    },
    {
        type: 'hospital',
        name: 'City General Hospital',
        address: '123 Main Street, Downtown',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        phone: '+91-22-12345678',
        emergency: true,
        specialties: ['Emergency Care', 'Cardiology', 'Orthopedics', 'Pediatrics'],
        rating: 4.5,
        beds: 250,
        coordinates: {
            latitude: 19.0760,
            longitude: 72.8777
        },
        operatingHours: '24/7',
        createdAt: new Date()
    },
    {
        type: 'hospital',
        name: 'MediCare Specialty Clinic',
        address: '456 Park Avenue, Central District',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        phone: '+91-22-87654321',
        emergency: false,
        specialties: ['General Medicine', 'Dermatology', 'ENT', 'Ophthalmology'],
        rating: 4.2,
        beds: 50,
        coordinates: {
            latitude: 19.0896,
            longitude: 72.8656
        },
        operatingHours: 'Mon-Sat: 9 AM - 6 PM',
        createdAt: new Date()
    },
    {
        type: 'hospital',
        name: 'Apollo Multi-Specialty Hospital',
        address: '789 Health Boulevard, North Zone',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        phone: '+91-22-99887766',
        emergency: true,
        specialties: ['Neurology', 'Oncology', 'Gastroenterology', 'Nephrology', 'ICU'],
        rating: 4.8,
        beds: 400,
        coordinates: {
            latitude: 19.1136,
            longitude: 72.8697
        },
        operatingHours: '24/7',
        createdAt: new Date()
    },
    {
        type: 'system_settings',
        settingKey: 'max_diagnoses_per_day',
        settingValue: 100,
        description: 'Maximum number of diagnoses allowed per day per user',
        category: 'rate_limiting',
        isActive: true,
        updatedAt: new Date()
    },
    {
        type: 'system_settings',
        settingKey: 'enable_gemini_api',
        settingValue: true,
        description: 'Enable or disable Gemini AI API for diagnoses',
        category: 'features',
        isActive: true,
        updatedAt: new Date()
    },
    {
        type: 'system_settings',
        settingKey: 'notification_enabled',
        settingValue: true,
        description: 'Enable browser notifications for medicine reminders',
        category: 'notifications',
        isActive: true,
        updatedAt: new Date()
    },
    {
        type: 'system_settings',
        settingKey: 'emergency_contact',
        settingValue: '108',
        description: 'Emergency ambulance number to display',
        category: 'emergency',
        isActive: true,
        updatedAt: new Date()
    },
    {
        type: 'disease_mapping',
        diseaseName: 'Common Cold',
        commonSymptoms: ['Runny nose', 'Sore throat', 'Cough', 'Sneezing', 'Mild headache'],
        severity: 'low',
        estimatedDuration: '7-10 days',
        contagious: true,
        createdAt: new Date()
    },
    {
        type: 'disease_mapping',
        diseaseName: 'Influenza (Flu)',
        commonSymptoms: ['Fever', 'Body aches', 'Fatigue', 'Cough', 'Headache', 'Chills'],
        severity: 'medium',
        estimatedDuration: '5-7 days',
        contagious: true,
        createdAt: new Date()
    },
    {
        type: 'disease_mapping',
        diseaseName: 'Gastroenteritis',
        commonSymptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain', 'Fever'],
        severity: 'medium',
        estimatedDuration: '3-7 days',
        contagious: true,
        createdAt: new Date()
    },
    {
        type: 'diagnosis_report',
        userEmail: 'rammeena8124@gmail.com',
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
        type: 'diagnosis_report',
        userEmail: 'rammeena8124@gmail.com',
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
        type: 'diagnosis_report',
        userEmail: 'rammeena8124@gmail.com',
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

async function seedDatabase() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        console.log(`📍 Database: MediCare`);

        await mongoose.connect(MONGODB_URI);

        console.log('✅ Connected to MongoDB successfully!');

        const db = mongoose.connection.db;
        const collection = db.collection('MediCare_Admin');

        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('\n🗑️  Clearing existing data...');
        const deleteResult = await collection.deleteMany({});
        console.log(`   Deleted ${deleteResult.deletedCount} existing documents`);

        // Insert sample data
        console.log('\n📝 Inserting sample data...');
        const result = await collection.insertMany(adminData);

        console.log(`✅ Successfully inserted ${result.insertedCount} documents!`);

        // Show summary
        console.log('\n📊 Data Summary:');
        const adminUsers = adminData.filter(d => d.type === 'admin_user').length;
        const medicines = adminData.filter(d => d.type === 'medicine').length;
        const hospitals = adminData.filter(d => d.type === 'hospital').length;
        const settings = adminData.filter(d => d.type === 'system_settings').length;
        const diseases = adminData.filter(d => d.type === 'disease_mapping').length;
        const diagnosisReports = adminData.filter(d => d.type === 'diagnosis_report').length;

        console.log(`   - Admin Users: ${adminUsers}`);
        console.log(`   - Medicines: ${medicines}`);
        console.log(`   - Hospitals: ${hospitals}`);
        console.log(`   - System Settings: ${settings}`);
        console.log(`   - Disease Mappings: ${diseases}`);
        console.log(`   - Diagnosis Reports: ${diagnosisReports}`);

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📍 View your data at: https://cloud.mongodb.com');
        console.log('   Navigate to: Cluster0 → Browse Collections → MediCare → MediCare_Admin');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
}

// Run the seed function
seedDatabase();
