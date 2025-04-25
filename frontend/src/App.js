import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://api.render.com/deploy/srv-d05i3tali9vc738qne6g?key=KrZP2tpBkuo');
      setTodos(response.data);
    } catch (err) {
      setError('Failed to fetch todos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post('https://api.render.com/deploy/srv-d05i3tali9vc738qne6g?key=KrZP2tpBkuo', { text: newTodo });
        setTodos([...todos, response.data]);
        setNewTodo('');
      } catch (err) {
        setError('Failed to addd todo. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleTodo = async (id, completed) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`https://api.render.com/deploy/srv-d05i3tali9vc738qne6g?key=KrZP2tpBkuo${id}`);
      setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
    } catch (err) {
      setError('Failed to update todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`https://api.render.com/deploy/srv-d05i3tali9vc738qne6g?key=KrZP2tpBkuo${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo._id, todo.completed)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;