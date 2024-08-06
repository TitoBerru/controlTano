import React from 'react';
import StudentCard from './StudentCard';

const StudentList = ({ students, selectedDate, absences, onToggleAbsence, isAdmin, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {students.map(student => (
        <StudentCard
          key={student.id}
          student={student}
          selectedDate={selectedDate}
          absences={absences}
          onToggleAbsence={onToggleAbsence}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default StudentList;
