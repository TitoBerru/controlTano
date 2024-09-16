import React, { useState, useEffect } from 'react';

const MatchPanel = () => {
  const [localTeam, setLocalTeam] = useState('Equipo Local');
  const [visitorTeam, setVisitorTeam] = useState('Equipo Visitante');
  const [localScore, setLocalScore] = useState(0);
  const [visitorScore, setVisitorScore] = useState(0);
  const [matchTime, setMatchTime] = useState(35); // Tiempo en minutos, ajustable
  const [timer, setTimer] = useState(matchTime * 60); // Tiempo en segundos
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [history, setHistory] = useState([]); // Historial de acciones

  // Contador hacia atrás
  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerRunning, timer]);

  // Función para formatear el tiempo
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleStartStopTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    setTimer(matchTime * 60);
    setIsTimerRunning(false);
  };

  const handleScoreUpdate = (team, points, event) => {
    const eventTime = formatTime(matchTime * 60 - timer); // Calcula el minuto en que ocurrió el evento

    setHistory((prevHistory) => [
      ...prevHistory,
      { team, points, event, time: eventTime }
    ]);

    if (team === 'local') {
      setLocalScore(localScore + points);
    } else {
      setVisitorScore(visitorScore + points);
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    const lastAction = history[history.length - 1];
    setHistory(history.slice(0, -1));

    // Revertir la última acción
    if (lastAction.team === 'local') {
      setLocalScore(localScore - lastAction.points);
    } else {
      setVisitorScore(visitorScore - lastAction.points);
    }
  };

  const handleSendWhatsApp = () => {
    const matchDetails = history.map((action) => 
      `${action.event} para ${action.team === 'local' ? localTeam : visitorTeam} en el minuto ${action.time}`).join('\n');
    const message = `Partido:\n${localTeam} ${localScore} - ${visitorScore} ${visitorTeam}\n\nIncidencias:\n${matchDetails}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-lg">
      {/* Temporizador */}
      <div className="mb-4 flex flex-col items-center">
        
        <div className="flex items-center mb-2">
        <label className="block text-lg font-bold mb-2">Tiempo del partido</label>
          <input
            type="number"
            value={matchTime}
            onChange={(e) => setMatchTime(e.target.value)}
            className="p-2 border rounded w-20 text-center"
          />
          <span className="ml-2">min</span>
        </div>
        <button
          onClick={handleStartStopTimer}
          className={`p-2 ${isTimerRunning ? 'bg-red-500' : 'bg-green-500'} text-white rounded w-full`}
        >
          {isTimerRunning ? 'Pausar' : 'Iniciar'}
        </button>
        {/* <button
          onClick={handleResetTimer}
          className="p-2 bg-gray-500 text-white rounded w-full mt-2"
        >
          Resetear
        </button> */}
        <div className="text-4xl font-bold mt-4">
          Tiempo restante: {formatTime(timer)}
        </div>
      </div>

      {/* Equipos */}
      <div className="flex flex-col md:flex-row">
        {/* Equipo Local */}
        <div className="bg-green-500 text-white p-4 rounded flex-1 mb-4 md:mb-0 md:mr-2">
          <input
            type="text"
            value={localTeam}
            onChange={(e) => setLocalTeam(e.target.value)}
            className="p-2 mb-2 text-center w-full text-xl font-bold bg-gray-900 border border-gray-700 rounded"
          />
          <div className="text-6xl font-bold text-center">{localScore}</div>
          <div className="mt-4 flex flex-col space-y-2">
            <button
              onClick={() => handleScoreUpdate('local', 5, 'TRY')}
              className="p-2 bg-yellow-500 text-white rounded"
            >
              TRY (+5)
            </button>
            <button
              onClick={() => handleScoreUpdate('local', 2, 'CONVERSION')}
              className="p-2 bg-yellow-500 text-white rounded"
            >
              CONVERSION (+2)
            </button>
            <button
              onClick={() => handleScoreUpdate('local', 3, 'PENAL')}
              className="p-2 bg-yellow-500 text-white rounded"
            >
              PENAL (+3)
            </button>
          </div>
        </div>

        {/* Equipo Visitante */}
        <div className="bg-red-500 text-white p-4 rounded flex-1">
          <input
            type="text"
            value={visitorTeam}
            onChange={(e) => setVisitorTeam(e.target.value)}
            className="p-2 mb-2 text-center w-full text-xl font-bold bg-gray-900 border border-gray-700 rounded"
          />
          <div className="text-6xl font-bold text-center">{visitorScore}</div>
          <div className="mt-4 flex flex-col space-y-2">
            <button
              onClick={() => handleScoreUpdate('visitor', 5, 'TRY')}
              className="p-2 bg-yellow-500 text-white rounded"
            >
              TRY (+5)
            </button>
            <button
              onClick={() => handleScoreUpdate('visitor', 2, 'CONVERSION')}
              className="p-2 bg-yellow-500 text-white rounded"
            >
              CONVERSION (+2)
            </button>
            <button
              onClick={() => handleScoreUpdate('visitor', 3, 'PENAL')}
              className="p-2 bg-yellow-500 text-white rounded"
            >
              PENAL (+3)
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
