import React, { useState } from "react";

const AdminPanel = ({
  students,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
}) => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [position, setPosition] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);

  const handleAdd = () => {
    onAddStudent(name, nickname, position);
    setName("");
    setNickname("");
    setPosition("");
  };

  const handleEdit = () => {
    onEditStudent(editingStudent.id, name, nickname, position);
    setName("");
    setNickname("");
    setPosition("");
    setEditingStudent(null);
  };

  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-xl font-semibold mb-4 p-10 text-center">
        AGREGAR NUEVO JUGADOR
      </h2>
      <div className="mb-4 text-center">
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
      <h2 className="text-xl font-semibold mb-4 text-center p-10">
        EDITAR JUGADORES
      </h2>
      <ul>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="border rounded-lg p-4 shadow-lg bg-slate-300"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold">{student.name}</h3>
                <p className="text-gray-600">
                  Apodo: {student.nickname || "N/A"}
                </p>
                <p className="text-gray-600">
                  Posición: {student.position || "N/A"}
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => {
                    setEditingStudent(student);
                    setName(student.name);
                    setNickname(student.nickname);
                    setPosition(student.position);
                  }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDeleteStudent(student.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </ul>
    </div>
  );
};

export default AdminPanel;
