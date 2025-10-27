import mongoose from 'mongoose';

// Defines the Task schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'completed', 'abandoned'],
        default: 'active',
    },
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);