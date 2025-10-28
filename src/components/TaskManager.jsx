import React, { useState, useEffect, useRef, useCallback } from 'react';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/api/tasksApi.js';
import Button from '@/components/Button';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

/**
 * TaskManager component for managing tasks
 */
const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollToTop = useSmoothScroll();
  // Refs for scrolling behavior
  const taskManagerRef = useRef(null);
  const filterButtonsRef = useRef(null);
  const listContainerRef = useRef(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const TASKS_PER_PAGE = 5;

  // Fetch tasks from the API on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(`Failed to load tasks: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleAddTask = async (taskData) => {
    try {
      setIsAddingTask(true);
      setError(null); // Clear previous errors
      const newTask = await createTask(taskData);
      // Only update state with the final task object from the API
      // which includes the default 'active' status from the server.
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    } catch (err) {
      console.error("Error adding task:", err);
      setError(`Failed to add task: ${err.message}`);
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleUpdateTask = async (id, updates) => {
    const originalTasks = [...tasks];
    setTasks(tasks.map(t => t._id === id ? { ...t, ...updates } : t));
    setError(null); // Clear previous errors
    try {
      await updateTask(id, updates);
    } catch (err) {
      console.error("Error toggling task:", err);
      setError(`Failed to update task. Reverting changes: ${err.message}`);
      setTasks(originalTasks); // Revert on error
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    const originalTasks = [...tasks];
    setTasks(tasks.filter((task) => task._id !== id)); 
    try {
      setError(null); // Clear previous errors
      await deleteTask(id);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(`Failed to delete task: ${err.message}`);
      setTasks(originalTasks); // Revert on error
    }
  };

  const handlePageChange = (newPage) => {
    if (filterButtonsRef.current) {
      const buttonsTop = filterButtonsRef.current.getBoundingClientRect().top;
      const header = document.querySelector('header'); // Find the fixed header
      const headerHeight = header ? header.offsetHeight : 0;

      // Only scroll if the filter buttons are scrolled past the bottom of the header
      if (buttonsTop < headerHeight) {
        setIsTransitioning(true);
        scrollToTop(filterButtonsRef.current, 1500, () => {
          setCurrentPage(newPage);
          setIsTransitioning(false);
        }, headerHeight); // Pass header height as an offset
        return;
      }
    }
    // If no scroll is needed, just change the page.
    setCurrentPage(newPage);
  };


  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return task.status === 'active';
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'abandoned') return task.status === 'abandoned';
    return true;
  });

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
  const paginatedTasks = filteredTasks.slice(
    startIndex,
    startIndex + TASKS_PER_PAGE
  );

  return (
    <div className="max-w-3xl mx-auto p-4" ref={taskManagerRef} id="tasks">
      <h1 className="text-4xl font-bold text-center mb-4">Welcome!</h1>
      <p className="text-center mb-12">
        Manage your tasks efficiently with the Task Tracker app.
        To get started, add a new task using the form below.
        You can easily edit your current tasks, update their status, or delete them as needed.
        Enjoy!
      </p>
      <h1 className="text-3xl font-bold text-center mb-8">My Tasks</h1>
      <TaskForm onSubmit={handleAddTask} isSubmitting={isAddingTask} />

      <div ref={filterButtonsRef} className="flex justify-center gap-2 mb-12">
        {['all', 'active', 'completed', 'abandoned'].map((f) => (
          <Button key={f} size="sm" variant={filter === f ? 'primary' : 'secondary'} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {loading && <p className="text-center">Loading tasks...</p>}
      {error && <p className="text-center text-red-600 font-medium bg-red-100 p-2 rounded-md">{error}</p>}

      <ul ref={listContainerRef} className="space-y-2 min-h-[10rem] flex flex-col justify-center">
        {!loading && !isTransitioning && filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500 mb-8">
            {{
              all: 'A clean slate — dangerously full of potential. What’s the first move? 🤔',
              active: 'All quiet on the task front. Suspiciously quiet… 👀',
              completed: 'No completed tasks yet — greatness takes time (and maybe caffeine) ☕',
              abandoned: 'No abandoned missions — clearly, you finish what you start (eventually)! 🚀',
            }[filter]}
          </p>
        ) : (
          !loading && paginatedTasks.map((task) => (
            <TaskCard key={task._id} task={task} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} />
          ))
        )}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8">
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || isTransitioning}>
            Previous
          </Button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || isTransitioning}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskManager; 