import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    userName: {
        type: String,
        required: true,
    },
    symptoms: [{
        type: String,
        required: true,
    }],
    additionalInfo: {
        type: String,
        default: '',
    },
    diagnosis: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    urgencyLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
});

// Index for faster queries
ReportSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
