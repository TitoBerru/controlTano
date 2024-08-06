import React, { useState } from 'react';

const AddStudentForm = ({ onAddStudent }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() !== '') {
      onAddStudent(name);
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded bg-white">
      <div className="mb-2">
        <label className="block text-sm font-bold mb-1">Nombre del Estudiante</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded w-full"
          placeholder="Ingrese el nombre"
        />
      </div>
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Agregar Estudiante
      </button>
    </form>
  );
};

export default AddStudentForm;
