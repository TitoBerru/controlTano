import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import StudentList from "./components/StudentList";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdminPanel from "./components/AdminPanel";
import ThirdTimePanel from "./components/ThirdTimePanel"; // Importar el nuevo componente
import MatchPanel from "./components/MatchPanel"; // Importar el nuevo componente
import studentsData from "./students.json";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [absences, setAbsences] = useState({});
  const [students, setStudents] = useState([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showThirdTimePanel, setShowThirdTimePanel] = useState(false);
  const [showMatchPanel, setShowMatchPanel] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const sortedStudents = [...studentsData].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setStudents(sortedStudents);

    // Inicializar ausencias
    const initialAbsences = {};
    const dateKey = new Date().toISOString().split("T")[0];
    studentsData.forEach((student) => {
      initialAbsences[student.id] = { [dateKey]: true };
    });
    setAbsences(initialAbsences);
  }, []);

  const handleToggleAbsence = (studentId) => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    setAbsences((prevAbsences) => {
      const studentAbsences = prevAbsences[studentId] || {};
      return {
        ...prevAbsences,
        [studentId]: {
          ...studentAbsences,
          [dateKey]: !studentAbsences[dateKey],
        },
      };
    });
  };

  const handleAddStudent = (name, nickname, position) => {
    const newStudent = { id: students.length + 1, name, nickname, position };
    setStudents((prevStudents) => [...prevStudents, newStudent]);

    const dateKey = selectedDate.toISOString().split("T")[0];
    setAbsences((prevAbsences) => {
      return {
        ...prevAbsences,
        [newStudent.id]: { [dateKey]: true },
      };
    });
  };

  const handleEditStudent = (id, name, nickname, position) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, name, nickname, position } : student
      )
    );
  };

  const handleDeleteStudent = (id) => {
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== id)
    );
    setAbsences((prevAbsences) => {
      const newAbsences = { ...prevAbsences };
      delete newAbsences[id];
      return newAbsences;
    });
  };

  const handleAddItem = (name, responsible) => {
    setItems((prevItems) => [...prevItems, { name, responsible }]);
  };

  const handleDeleteItem = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const generateWhatsAppMessage = () => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    let message = `Listado de asistencia para el ${dateKey}:\n\n`;

    let totalStudents = 0;
    let totalPresent = 0;
    let totalAbsent = 0;

    students.forEach((student) => {
      const isAbsent = absences[student.id]?.[dateKey] || false;
      totalStudents++;
      if (isAbsent) {
        totalAbsent++;
        message += `${student.name}: Ausente\n`;
      } else {
        totalPresent++;
        message += `${student.name}: Presente\n`;
      }
    });

    message += `\nResumen:\n`;
    message += `Total de jugadores: ${totalStudents}\n`;
    message += `Total presentes: ${totalPresent}\n`;
    message += `Total ausentes: ${totalAbsent}`;

    return message;
  };

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4">
        <div className="mb-4">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy/MM/dd"
            className="p-2 border rounded"
          />
        </div>

        <button
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className="p-2 bg-green-500 text-white rounded mb-4"
        >
          {showAdminPanel ? "Cerrar Administrador" : "Administrador"}
        </button>

        <button
          onClick={() => setShowThirdTimePanel(!showThirdTimePanel)}
          className="p-2 bg-orange-500 text-white rounded mb-4 ml-4"
        >
          {showThirdTimePanel ? "Cerrar 3er Tiempo" : "3er Tiempo"}
        </button>

        <button
          onClick={handleSendWhatsApp}
          className="p-2 bg-blue-500 text-white rounded mb-4 ml-4"
        >
          Enviar por WhatsApp
        </button>

        <button
          onClick={() => setShowMatchPanel(!showMatchPanel)}
          className="p-2 bg-yellow-500 text-white rounded mb-4 ml-4"
        >
          {showMatchPanel ? "Cerrar Partido" : "Partido"}
        </button>

        {/* Mostrar el panel de partido */}
        {showMatchPanel && <MatchPanel />}

        {/* Mostrar el panel de administrador */}
        {showAdminPanel && (
          <AdminPanel
            students={students}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        )}

        {/* Mostrar el panel de 3er Tiempo */}
        {showThirdTimePanel && (
          <ThirdTimePanel
            items={items}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {/* Mostrar la lista de estudiantes solo si no están los paneles abiertos */}
        {!showAdminPanel && !showThirdTimePanel && !showMatchPanel && (
          <StudentList
            students={students}
            selectedDate={selectedDate}
            absences={absences}
            onToggleAbsence={handleToggleAbsence}
          />
        )}
      </main>
    </div>
  );
}

export default App;

