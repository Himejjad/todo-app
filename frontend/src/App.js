import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get('https://todo-backend-zsok.onrender.com');
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      const response = await axios.post('https://todo-backend-zsok.onrender.com', { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    }
  };

  const toggleTodo = async (id, completed) => {
    const response = await axios.put(`https://todo-backend-zsok.onrender.com${id}`);
    setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`https://todo-backend-zsok.onrender.com${id}`);
    setTodos(todos.filter(todo => todo._id !== id));
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
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