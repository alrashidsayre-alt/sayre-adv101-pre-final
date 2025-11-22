'use client';

import { useState, useEffect } from 'react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // all, todo, completed
  const [searchTerm, setSearchTerm] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo = {
      id: Date.now().toString(),
      title: newTodo.trim(),
      completed: false,
    };

    setTodos([todo, ...todos]);
    setNewTodo('');
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTodo = (id) => {
    if (confirm('Delete this task permanently?')) {
      setTodos(todos.filter(t => t.id !== id));
    }
  };

  const startEdit = (id, title) => {
    setEditingId(id);
    setEditText(title);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    setTodos(todos.map(t =>
      t.id === editingId ? { ...t, title: editText.trim() } : t
    ));
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Filter & Search
  const filtered = todos
    .filter(todo => {
      if (filter === 'todo') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .filter(todo =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container">
      <header>
        <h1>My Tasks</h1>
        <p>{todos.filter(t => !t.completed).length} pending, {todos.filter(t => t.completed).length} done</p>
      </header>

      <form onSubmit={addTodo} className="input-group">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
        />
        <button type="submit">Add</button>
      </form>

      <div className="tabs">
        <button className={filter === 'all' ? 'tab active' : 'tab'} onClick={() => setFilter('all')}>
          All
        </button>
        <button className={filter === 'todo' ? 'tab active' : 'tab'} onClick={() => setFilter('todo')}>
          To Do
        </button>
        <button className={filter === 'completed' ? 'tab active' : 'tab'} onClick={() => setFilter('completed')}>
          Completed
        </button>
      </div>

      <input
        type="text"
        className="search-box"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="todo-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            {searchTerm || filter !== 'all' ? 'No tasks found' : 'No tasks yet. Add one!'}
          </div>
        ) : (
          filtered.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="todo-checkbox"
              />

              {editingId === todo.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  autoFocus
                  className="todo-title"
                />
              ) : (
                <span className="todo-title">{todo.title}</span>
              )}

              <div className="actions">
                {editingId === todo.id ? (
                  <>
                    <button onClick={saveEdit} className="save-btn">Save</button>
                    <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(todo.id, todo.title)} className="edit-btn">Edit</button>
                    <button onClick={() => deleteTodo(todo.id)} className="delete-btn">Delete</button>
                  </>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}