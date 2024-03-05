import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const saveData = (newNotes) => {
    localStorage.setItem('notes', JSON.stringify(newNotes));
  };

  useEffect(() => {
    if (localStorage.getItem('notes')) {
      setNotes(JSON.parse(localStorage.getItem('notes')));
    }
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim() !== '') {
      const newNote = { text: inputValue, editable: false, showDelete: true };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      saveData(updatedNotes);
      setInputValue('');
    }
  };

  const handleUpdate = (index) => {
    const updatedNotes = [...notes];
    updatedNotes[index].editable = !updatedNotes[index].editable;
    updatedNotes[index].showDelete = !updatedNotes[index].showDelete;
    setNotes(updatedNotes);
    saveData(updatedNotes);
  };

  const handleEditChange = (index, newText) => {
    const updatedNotes = [...notes];
    updatedNotes[index].text = newText;
    setNotes(updatedNotes);
    saveData(updatedNotes);
  };

  const handleSave = (index) => {
    const updatedNotes = [...notes];
    updatedNotes[index].editable = false;
    updatedNotes[index].showDelete = true;
    setNotes(updatedNotes);
    saveData(updatedNotes);
  };

  const handleDelete = (index) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
    saveData(updatedNotes);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = parseInt(e.dataTransfer.getData('index'));
    const draggedNote = notes[dragIndex];
    const updatedNotes = [...notes.slice(0, dragIndex), ...notes.slice(dragIndex + 1)];
    updatedNotes.splice(dropIndex, 0, draggedNote);
    setNotes(updatedNotes);
    saveData(updatedNotes);
  };

  return (
    <div className="App">
      <h1>ToDo Application</h1>
      <div className="input-container">
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <ul>
        {notes.map((note, index) => (
          <li
            key={index}
            style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#e6f2ff' }}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            {note.editable ? (
              <input
                type="text"
                value={note.text}
                onChange={(e) => handleEditChange(index, e.target.value)}
                data-testid="edit-input"
              />
            ) : (
              <span>{note.text}</span>
            )}
            <span
              className="update-icon"
              onClick={() => (note.editable ? handleSave(index) : handleUpdate(index))}
              data-testid="edit-icon"
            >
              {note.editable ? 'Save' : <FaEdit />}
            </span>
            {note.showDelete && (
              <span className="delete-icon" onClick={() => handleDelete(index)} data-testid="delete-icon">
                <FaTrash />
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
