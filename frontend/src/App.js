
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API);
      setTasks(response.data);
    } catch (error) {
      console.error("Fetch Error:", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter task name");
      return;
    }

    try {
      await axios.post(API, { title });
      setTitle("");
      fetchTasks();
      alert("Task Added Successfully!");
    } catch (error) {
      console.error("Add Error:", error.response?.data || error.message);
      alert("Task adding failed!");
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/${id}`, { status });
      fetchTasks();
    } catch (error) {
      console.error("Update Error:", error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Delete Error:", error.message);
    }
  };

  const completed = tasks.filter(
    task => task.status === "Completed"
  ).length;

  const pending = tasks.filter(
    task => task.status === "Pending"
  ).length;

  return (
    <div className="app">
      <header className="header">
        <h1>Project Task Management</h1>
        <p>Manage Your Project Tasks Easily</p>
      </header>

      <main className="container">
        <section className="stats">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <h2>{tasks.length}</h2>
          </div>

          <div className="stat-card">
            <h3>Pending Tasks</h3>
            <h2>{pending}</h2>
          </div>

          <div className="stat-card">
            <h3>Completed Tasks</h3>
            <h2>{completed}</h2>
          </div>
        </section>

        <section className="panel">
          <h2>Add New Task</h2>

          <form className="task-form" onSubmit={createTask}>
            <input
              type="text"
              placeholder="Enter Task Name"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <button type="submit">+ Add Task</button>
          </form>
        </section>

        <section className="panel">
          <h2>All Tasks</h2>

          {tasks.length === 0 ? (
            <p className="empty">No Tasks Available</p>
          ) : (
            <div className="task-list">
              {tasks.map(task => (
                <div className="task-item" key={task._id}>
                  <div className="task-info">
                    <h3>{task.title}</h3>
                    <p>Status: {task.status}</p>
                  </div>

                  <select
                    value={task.status}
                    onChange={e =>
                      updateTaskStatus(task._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
