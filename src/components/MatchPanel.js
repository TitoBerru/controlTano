import React, { useState, useEffect } from "react";

const MatchPanel = () => {
  const [localTeam, setLocalTeam] = useState("ITALIANO");
  const [visitorTeam, setVisitorTeam] = useState("Equipo Visitante");
  const [localScore, setLocalScore] = useState(0);
  const [visitorScore, setVisitorScore] = useState(0);
  const [timer, setTimer] = useState(0); // Inicia desde 0
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [history, setHistory] = useState([]); // Historial de acciones

  // Contador hacia adelante
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    } else if (!isTimerRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  // Función para formatear el tiempo
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleStartStopTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    setTimer(0);
    setIsTimerRunning(false);
  };

  const handleScoreUpdate = (team, points, event) => {
    const eventTime = formatTime(timer); // Calcula el minuto en que ocurrió el evento

    setHistory((prevHistory) => [
      ...prevHistory,
      { team, points, event, time: eventTime },
    ]);

    if (team === "local") {
      setLocalScore(localScore + points);
    } else {
      setVisitorScore(visitorScore + points);
    }
  };

  const handlePenalOtorgado = (team) => {
    const eventTime = formatTime(timer);
    setHistory((prevHistory) => [
      ...prevHistory,
      { team, points: 0, event: "Penal Otorgado", time: eventTime },
    ]);
  };
  const handleScrumGanado = (team) => {
    const eventTime = formatTime(timer);
    setHistory((prevHistory) => [
      ...prevHistory,
      { team, points: 0, event: "Scrum Ganado", time: eventTime },
    ]);
  };
  const handleScrumPerdido = (team) => {
    const eventTime = formatTime(timer);
    setHistory((prevHistory) => [
      ...prevHistory,
      { team, points: 0, event: "Scrum Perdido", time: eventTime },
    ]);
  };
  const handleLineGanado = (team) => {
    const eventTime = formatTime(timer);
    setHistory((prevHistory) => [
      ...prevHistory,
      { team, points: 0, event: "Line Ganado", time: eventTime },
    ]);
  };
  const handleLinePerdido = (team) => {
    const eventTime = formatTime(timer);
    setHistory((prevHistory) => [
      ...prevHistory,
      { team, points: 0, event: "Line Perdido", time: eventTime },
    ]);
  };
  const handleTackle = (team) => {
    const eventTime = formatTime(timer);
    setHistory((prevHistory) => [
      ...prevHistory,
      { team, points: 0, event: "Tackle", time: eventTime },
    ]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    const lastAction = history[history.length - 1];
    setHistory(history.slice(0, -1));

    // Revertir la última acción si afectó al marcador
    if (lastAction.points > 0) {
      if (lastAction.team === "local") {
        setLocalScore(localScore - lastAction.points);
      } else {
        setVisitorScore(visitorScore - lastAction.points);
      }
    }
  };

  const handleSendWhatsApp = () => {
    const matchDetails = history
      .map(
        (action) =>
          `${action.event} para ${
            action.team === "local" ? localTeam : visitorTeam
          } en el minuto ${action.time}`
      )
      .join("\n");
    const message = `Partido:\n${localTeam} ${localScore} - ${visitorScore} ${visitorTeam}\n\nIncidencias:\n${matchDetails}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-lg">
      {/* Temporizador */}
      <div className="mb-4 flex flex-col items-center">
        <div className="flex items-center mb-2">
          <label className="block text-lg font-bold mb-2">
            Tiempo del partido
          </label>
        </div>
        <button
          onClick={handleStartStopTimer}
          className={`p-2 ${
            isTimerRunning ? "bg-red-500" : "bg-green-500"
          } text-white rounded w-full`}
        >
          {isTimerRunning ? "Pausar" : "Iniciar"}
        </button>
        <div className="text-4xl font-bold mt-4">
          Tiempo transcurrido: {formatTime(timer)}
        </div>
      </div>

      {/* Equipos */}
      <div className="flex flex-col md:flex-row">
        {/* Equipo Local */}
        <div className="bg-green-300 text-white p-4 rounded flex-1 mb-4 md:mb-0 md:mr-2">
          <input
            type="text"
            value={localTeam}
            onChange={(e) => setLocalTeam(e.target.value)}
            className="p-2 mb-2 text-center w-full text-xl font-bold bg-gray-900 border border-gray-700 rounded"
          />
          {/* BOTONES */}
          <div className="text-6xl font-bold text-center items-center">
            {localScore}
          </div>
          <div className="mt-4 flex font-semibold flex-col space-y-2">
            <button
              onClick={() => handleScoreUpdate("local", 5, "TRY")}
              className="p-2 bg-green-500 text-white rounded"
            >
              TRY (+5)
            </button>
            <button
              onClick={() => handleScoreUpdate("local", 2, "CONVERSION")}
              className="p-2  bg-green-500 text-white rounded"
            >
              CONVERSION (+2)
            </button>
            <button
              onClick={() => handleScoreUpdate("local", 3, "PENAL")}
              className="p-2  bg-green-500 text-white rounded"
            >
              PENAL (+3)
            </button>
          </div>
          {/* Botones Auxiliares PENAL - TACKLE */}

          <div className="mt-4 flex flex-wrap justify-between space-x-2 gap-2">
          <button
              onClick={() => handlePenalOtorgado("local")}
              className="p-2 bg-red-500 text-white rounded w-1/3 ml-2"
            >
              Penal Otorgado
            </button>
            <button
              onClick={() => handleTackle("local")}
              className="p-2 bg-red-500 text-white rounded w-1/3"
            >
              Tackle
            </button>

            {/* Mas BOTONES EXTRAS - SCRUM - LINE  */}

            <button
              onClick={() => handleScrumGanado("local")}
              className="p-2 bg-red-500 text-white rounded w-1/3"
            >
              Scrum Ganado
            </button>
            <button
              onClick={() => handleScrumPerdido("local")}
              className="p-2 bg-red-500 text-white rounded w-1/3"
            >
              Scrum Perdido
            </button>

            <button
              onClick={() => handleLineGanado("local")}
              className="p-2 bg-red-500 text-white rounded w-1/3"
            >
              Line Ganado
            </button>
            <button
              onClick={() => handleLinePerdido("local")}
              className="p-2 bg-red-500 text-white rounded w-1/3"
            >
              Line Perdido
            </button>
          </div>
        </div>

        {/* Equipo Visitante */}
        <div className="bg-blue-400 text-white p-4 rounded flex-1">
          <input
            type="text"
            value={visitorTeam}
            onChange={(e) => setVisitorTeam(e.target.value)}
            className="p-2 mb-2 text-center w-full text-xl font-bold bg-gray-900 border border-gray-700 rounded"
          />
          <div className="text-6xl font-bold text-center">{visitorScore}</div>
          <div className="mt-4 flex flex-col font-semibold space-y-2">
            <button
              onClick={() => handleScoreUpdate("visitor", 5, "TRY")}
              className="p-2 bg-green-500 text-white rounded"
            >
              TRY (+5)
            </button>
            <button
              onClick={() => handleScoreUpdate("visitor", 2, "CONVERSION")}
              className="p-2  bg-green-500 text-white rounded"
            >
              CONVERSION (+2)
            </button>
            <button
              onClick={() => handleScoreUpdate("visitor", 3, "PENAL")}
              className="p-2  bg-green-500 text-white rounded"
            >
              PENAL (+3)
            </button>
            <button
              onClick={() => handlePenalOtorgado("visitor")}
              className="p-2 bg-red-500 text-white rounded"
            >
              Penal Otorgado
            </button>
          </div>
        </div>
      </div>

      {/* Botones de deshacer y enviar por WhatsApp */}
      <div className="mt-4">
        <button
          onClick={handleUndo}
          className="p-2 bg-red-500 text-white rounded w-full mb-2"
        >
          Deshacer
        </button>
        <button
          onClick={handleSendWhatsApp}
          className="p-2 bg-blue-500 text-white rounded w-full"
        >
          Enviar resultado por WhatsApp
        </button>
      </div>
    </div>
  );
};

export default MatchPanel;
