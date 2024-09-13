import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import StudentList from "./components/StudentList";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdminPanel from "./components/AdminPanel";
import ThirdTimePanel from "./components/ThirdTimePanel";
import MatchPanel from "./components/MatchPanel";
import studentsData from "./students.json";
import * as XLSX from "xlsx"; // Importar la librería XLSX

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

  const generateExcel = () => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    const attendanceData = students.map((student) => ({
      Nombre: student.name,
      Presente: absences[student.id]?.[dateKey] ? "No" : "Sí",
    }));

    let totalStudents = students.length;
    let totalPresent = students.filter(
      (student) => !absences[student.id]?.[dateKey]
    ).length;
    let totalAbsent = totalStudents - totalPresent;

    // Agregar resumen al final de los datos
    attendanceData.push({});
    attendanceData.push({ Nombre: "Resumen", Presente: "" });
    attendanceData.push({ Nombre: "Total de jugadores", Presente: totalStudents });
    attendanceData.push({ Nombre: "Total presentes", Presente: totalPresent });
    attendanceData.push({ Nombre: "Total ausentes", Presente: totalAbsent });

    // Crear hoja de cálculo
    const ws = XLSX.utils.json_to_sheet(attendanceData);

    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asistencia");

    // Generar archivo y descargarlo
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Control_Asistencia_${dateKey}.xlsx`; // Nombre del archivo
    a.click();
    window.URL.revokeObjectURL(url); // Limpiar el objeto URL
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

        {/** Solo mostrar el botón si no están abiertos los paneles de 3er Tiempo o Partido */}
        {!showThirdTimePanel && !showMatchPanel && (
          <button
            onClick={generateExcel} // Botón para descargar Excel
            className="p-2 bg-purple-500 text-white rounded mb-4 ml-4"
          >
            Descargar Excel
          </button>
        )}

        <button
          onClick={() => setShowMatchPanel(!showMatchPanel)}
          className="p-2 bg-yellow-500 text-white rounded mb-4 ml-4"
        >
          {showMatchPanel ? "Cerrar Partido" : "Partido"}
        </button>

        {showMatchPanel && <MatchPanel />}
        {showAdminPanel && (
          <AdminPanel
            students={students}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        )}
        {showThirdTimePanel && (
          <ThirdTimePanel
            items={items}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
          />
        )}
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
