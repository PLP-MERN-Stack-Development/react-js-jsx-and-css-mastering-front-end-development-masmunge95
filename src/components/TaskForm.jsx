import { useState } from 'react';
import Button from '@/components/Button';

export default function TaskForm({ onSubmit, isSubmitting = false }) {
    const [form, setForm] = useState({
        title: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title) {
            return;
        }

        onSubmit(form);
        setForm({ title: '', description: '' });
    }; 

    return (
        <form onSubmit={handleSubmit} className="rounded-xl p-6 border bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-4 mb-6">
            <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter task title"
                className="border rounded-lg p-3 flex-1 bg-gray-50 text-black placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                required
            />
            <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter task description"
                className="border rounded-lg p-3 flex-1 h-24 bg-gray-50 text-black placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <Button 
                type="submit" 
                variant="success" 
                className="w-full"
                disabled={isSubmitting || !form.title}>
                {isSubmitting ? 'Adding...' : 'Add Task'}
            </Button>
        </form>
    );
}