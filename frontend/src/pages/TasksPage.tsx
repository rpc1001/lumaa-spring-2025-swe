import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import '../styles/styles.css';

interface Task {
  id: number;
  title: string;
  description: string;
  iscomplete: boolean;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        console.log('Tasks from server:', response.data);

        const sortedTasks = [...response.data].sort((a, b) => {
          // first separate complete and incomplete
          if (a.iscomplete !== b.iscomplete) {
            return a.iscomplete ? 1 : -1; // incomplete tasks first
          }
          // then sort by ID within each group (highest to lowest)
          return b.id - a.id;
        });
        setTasks(sortedTasks);
      } catch {
        console.error("Failed to fetch tasks");
      }
    };
    fetchTasks();
  }, [auth?.token]);

  const handleCreateTask = async () => {
    if (!title.trim()) return;
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks`,
        { title, description },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setTasks([...tasks, response.data]);
      setTitle("");
      setDescription("");
    } catch {
      alert("Failed to create task");
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/tasks/${id}`,
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setTasks(tasks.filter(task => task.id !== id));
    } catch {
      alert("Failed to delete task");
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = { ...task, isComplete: !task.iscomplete };
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/tasks/${task.id}`,
        updatedTask,
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setTasks(tasks.map(t => (t.id === task.id ? response.data : t)));
    } catch {
      alert("Failed to update task");
    }
  };

  const startEditing = (task: Task) => {
    setIsEditing(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const cancelEditing = () => {
    setIsEditing(null);
  };

  const saveEdit = async (id: number) => {
    if (!editTitle.trim()) return;
    
    try {
      const taskToUpdate = tasks.find(t => t.id === id);
      if (!taskToUpdate) return;
      
      const updatedTask = { 
        ...taskToUpdate, 
        title: editTitle, 
        description: editDescription 
      };
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/tasks/${id}`,
        updatedTask,
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      
      setTasks(tasks.map(t => (t.id === id ? response.data : t)));
      setIsEditing(null);
    } catch {
      alert("Failed to update task");
    }
  };

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo">Task Manager</div>
        <button className="secondary" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="task-form">
        <h2>Create New Task</h2>
        <div className="form-inputs">
          <input 
            type="text" 
            placeholder="Task title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
          <textarea 
            placeholder="Task description (optional)" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <button onClick={handleCreateTask}>Add Task</button>
        </div>
      </div>
      
      <div className="tasks-container">
        <h2>Your Tasks</h2>
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>You don't have any tasks yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`task-card ${task.iscomplete ? 'completed' : ''}`}
              >
                {isEditing === task.id ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveEdit(task.id)}>Save</button>
                      <button className="secondary" onClick={cancelEditing}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="task-header">
                      <h3 className={task.iscomplete ? 'completed-title' : ''}>{task.title}</h3>
                      <div className="task-toggle">
                        <input
                          type="checkbox"
                          checked={task.iscomplete}
                          onChange={() => handleToggleComplete(task)}
                          id={`task-${task.id}`}
                          onClick={() => console.log('Current task state:', task)} 
                        />
                        <label htmlFor={`task-${task.id}`}></label>
                      </div>
                    </div>
                    <p className="task-description">{task.description}</p>
                    <div className="task-actions">
                      <button className="secondary" onClick={() => startEditing(task)}>Edit</button>
                      <button className="danger" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
