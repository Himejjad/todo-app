import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      try {
        setError('');
        const response = await axios.post(`${API_BASE_URL}/todos`, { text: newTodo.trim() });
        setTodos([...todos, response.data]);
        setNewTodo('');
      } catch (error) {
        console.error('Error adding todo:', error);
        setError('Failed to add todo. Please try again.');
      }
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      setError('');
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`);
      setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
    } catch (error) {
      console.error('Error toggling todo:', error);
      setError('Failed to update todo. Please try again.');
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError('');
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo(e);
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="App">
      <div className="todo-container">
        <div className="app-header">
          <h1 className="app-title">✨ Todo App</h1>
          <p className="app-subtitle">Stay organized and productive</p>
        </div>

        {error && (
          <div className="error-message" style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={addTodo} className="input-section">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What needs to be done?"
            className="todo-input"
            maxLength={200}
          />
          <button 
            type="submit" 
            className="add-button"
            disabled={!newTodo.trim()}
          >
            <span>+ Add Task</span>
          </button>
        </form>

        {totalCount > 0 && (
          <div className="stats-section">
            <div className="stat-item">
              <span className="stat-number">{totalCount}</span>
              <span>Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{pendingCount}</span>
              <span>Pending</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{completedCount}</span>
              <span>Completed</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">
            Loading your tasks...
          </div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📝</span>
            <div className="empty-state-text">No tasks yet</div>
            <div className="empty-state-subtext">Add a task above to get started</div>
          </div>
        ) : (
          <ul className="todo-list">
            {todos.map(todo => (
              <li 
                key={todo._id} 
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                <div
                  className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                  onClick={() => toggleTodo(todo._id, todo.completed)}
                  role="checkbox"
                  aria-checked={todo.completed}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleTodo(todo._id, todo.completed);
                    }
                  }}
                />
                <span className="todo-text">{todo.text}</span>
                <button 
                  onClick={() => deleteTodo(todo._id)}
                  className="delete-button"
                  aria-label={`Delete task: ${todo.text}`}
                  title="Delete task"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
