import { useState } from 'react';
import Button from '@/components/Button';

export default function TaskCard({ task, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState({ title: task.title, description: task.description });

    const handleEditClick = () => {
        // Reset draft to current task state when starting to edit
        setDraft({ title: task.title, description: task.description });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = (e) => {
        e.preventDefault();
        onUpdate(task._id, draft);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDraft(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {!isEditing ? (
                <div className="flex flex-col justify-between h-full gap-4">
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <h3 className={`text-lg font-semibold ${
                                task.status === 'completed' ? 'line-through text-gray-500' : 
                                task.status === 'active' ? 'text-blue-800 dark:text-white' :
                                task.status === 'abandoned' ? 'text-red-800 dark:text-white' : ''
                            }`}>
                                {task.title}
                            </h3>
                            <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                                task.status === 'completed' ? 'bg-green-600 text-white' :
                                task.status === 'abandoned' ? 'bg-red-600 text-white' :
                                'bg-blue-600 text-white'
                            }`}>
                                {task.status}
                            </span>
                        </div>
                        {task.description && <p className={`text-gray-600 dark:text-gray-400 text-sm mt-1 ${task.status === 'completed' ? 'line-through' : ''}`}>{task.description}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {task.status === 'active' && <Button onClick={() => onUpdate(task._id, { status: 'completed' })} variant="success" size="sm">Complete</Button>}
                        {task.status === 'active' && <Button onClick={() => onUpdate(task._id, { status: 'abandoned' })} variant="warning" size="sm">Abandon</Button>}
                        {(task.status === 'completed' || task.status === 'abandoned') && (
                            <Button onClick={() => onUpdate(task._id, { status: 'active' })} variant="primary" size="sm">
                                Reactivate
                            </Button>
                        )}
                        <Button onClick={handleEditClick} variant="secondary" size="sm">
                            Edit
                        </Button>
                        <Button onClick={() => onDelete(task._id)} variant="danger" size="sm">
                            Delete
                        </Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                    <input
                        name="title"
                        className="border rounded-lg p-2 w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                        value={draft.title}
                        onChange={handleInputChange}
                        required
                    />
                    <textarea
                        name="description"
                        className="border rounded-lg p-2 w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                        value={draft.description}
                        onChange={handleInputChange}
                    />
                    <div className="flex gap-2">
                        <Button type="submit" variant="success" size="sm">
                            Save
                        </Button>
                        <Button type="button" onClick={handleCancel} variant="secondary" size="sm">
                            Cancel
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}