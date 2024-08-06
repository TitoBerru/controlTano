import React, { useState } from 'react';

const AdminPanel = ({ students, onAddStudent, onEditStudent, onDeleteStudent }) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [position, setPosition] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);

  const handleAdd = () => {
    onAddStudent(name, nickname, position);
    setName('');
    setNickname('');
    setPosition('');
  };

  const handleEdit = () => {
    onEditStudent(editingStudent.id, name, nickname, position);
    setName('');
    setNickname('');
    setPosition('');
    setEditingStudent(null);
  };

  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-xl font-semibold mb-4">Panel de Administración</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Apodo"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Posición"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="p-2 border rounded"
        />
        {editingStudent ? (
          <button
            onClick={handleEdit}
            className="p-2 bg-yellow-500 text-white rounded ml-2"
          >
            Editar
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="p-2 bg-green-500 text-white rounded ml-2"
          >
            Agregar
          </button>
        )}
      </div>
      <ul>
        {students.map(student => (
          <li key={student.id} className="mb-2">
            {student.name} ({student.nickname}) - {student.position}
            <button
              onClick={() => {
                setEditingStudent(student);
                setName(student.name);
                setNickname(student.nickname);
                setPosition(student.position);
              }}
              className="p-2 bg-yellow-500 text-white rounded ml-2"
            >
              Editar
            </button>
            <button
              onClick={() => onDeleteStudent(student.id)}
              className="p-2 bg-red-500 text-white rounded ml-2"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
