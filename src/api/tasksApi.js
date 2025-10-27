const API = import.meta.env.VITE_API_URL;

if (!API) {
    throw new Error('VITE_API_URL is not defined. Please create a .env file in the root of your project and add the variable.');
}

export async function fetchTasks() {
    const res = await fetch(`${API}/tasks`);
    if(!res.ok) {
        throw new Error('Failed to fetch tasks');
    }
    return res.json();
}

export async function createTask(task) {
    const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });
    if(!res.ok) {
        throw new Error(`Failed to create task: ${res.statusText}`);
    }
    const responseData = await res.json();
    return responseData;
}
export async function updateTask(id, task) {
    const res = await fetch(`${API}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });
    if(!res.ok) {
        throw new Error(`Failed to update task: ${res.statusText}`);
    }
    return res.json();
}
export async function deleteTask(id) {
    const res = await fetch(`${API}/tasks/${id}`, {
        method: 'DELETE',
    });
    if(!res.ok) {
        throw new Error(`Failed to delete task: ${res.statusText}`);
    }
}
