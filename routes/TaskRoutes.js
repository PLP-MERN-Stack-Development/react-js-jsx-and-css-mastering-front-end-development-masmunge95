import express from 'express';
const router = express.Router();
import Task from '../models/Task.js';

// Get all tasks (fetch all) READ
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new task CREATE
router.post('/', async (req, res) => {
    const { title, description } = req.body

    try {
        const task = new Task({ title, description });
        const saved =  await task.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update task by id UPDATE
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new: true }
        );
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete task by id DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(
            req.params.id
        );
        res.json({ message: 'Task Deleted successfully, Bye' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;