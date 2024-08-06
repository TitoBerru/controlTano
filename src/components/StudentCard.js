import React from 'react';

const StudentCard = ({ student, selectedDate, absences, onToggleAbsence, isAdmin, onEdit, onDelete }) => {
  const dateKey = selectedDate.toISOString().split('T')[0];
  const isAbsent = absences[student.id]?.[dateKey] || false;

  return (
    <div className={`p-4 border rounded ${isAbsent ? 'bg-red-200' : 'bg-green-200'}`}>
      <h2 className="text-xl font-semibold">{student.name}</h2>
      <p className="text-sm">Apodo: {student.nickname}</p>
      <p className="text-sm">Posición: {student.position}</p>
      <p className="text-xl font-bold">{isAbsent ? 'Ausente' : 'Presente'}</p>
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded"
        onClick={() => onToggleAbsence(student.id)}
      >
        Marcar como {isAbsent ? 'Presente' : 'Ausente'}
      </button>
      {isAdmin && (
        <>
          <button
            className="mt-2 p-2 bg-yellow-500 text-white rounded ml-2"
            onClick={() => onEdit(student)}
          >
            Editar
          </button>
          <button
            className="mt-2 p-2 bg-red-500 text-white rounded ml-2"
            onClick={() => onDelete(student.id)}
          >
            Eliminar
          </button>
        </>
      )}
    </div>
  );
};

export default StudentCard;
