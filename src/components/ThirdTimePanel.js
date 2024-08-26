// ThirdTimePanel.js
import React, { useState } from 'react';


function ThirdTimePanel({ items = [], onAddItem, onAssignResponsible, onDeleteItem }) {
  const [newItem, setNewItem] = useState('');
  const [responsible, setResponsible] = useState('');

  const handleAddItem = () => {
    if (newItem && responsible) {
      onAddItem(newItem, responsible);
      setNewItem('');
      setResponsible('');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">3er Tiempo - Tareas</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Nueva tarea"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Responsable"
          value={responsible}
          onChange={(e) => setResponsible(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={handleAddItem}
          className="p-2 bg-green-500 text-white rounded"
        >
          Agregar Tarea
        </button>
      </div>

      <ul>
        {items.map((item, index) => (
          <li key={index} className="mb-2">
            {item.name} - Responsable: {item.responsible}
            <button
              onClick={() => onDeleteItem(index)}
              className="p-2 bg-red-500 text-white rounded ml-4"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ThirdTimePanel;
