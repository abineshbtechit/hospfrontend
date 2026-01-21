import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Doctor() {
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(0);
  const [serving,setServing]=useState(0);

  useEffect(() => {
  socket.on("serve_update", setServing);
  socket.on("token_update", setCurrent);
  socket.on("booking_list", setList);

  return () => {
    socket.off("serve_update");
    socket.off("token_update");
    socket.off("booking_list");
  };
}, []);
  return (
    <div className="clinic-container">
      <header className="clinic-header">
        <h1 className="clinic-title">🏥 HealthCare Clinic</h1>
        <p className="clinic-subtitle">Doctor Dashboard</p>
      </header>

      <div className="dashboard-content">
        <div className="main-section">
          <div className="now-serving-card">
            <p className="card-label">Now Serving</p>
            <div className="serving-number">{serving}</div>
            <button className="btn-next" onClick={() => socket.emit("next_token")}>
              Next Patient
            </button>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <p className="stat-label">Total Bookings</p>
              <h3 className="stat-value">{current - 1}</h3>
            </div>
            <div className="stat-card">
              <p className="stat-label">In Queue</p>
              <h3 className="stat-value">{Math.max(list.length - serving, 0)}</h3>

            </div>
          </div>
        </div>

        <div className="queue-section">
          <h3 className="section-title">Patient Queue</h3>
          <div className="queue-list">
            {list.length === 0 && <p className="empty-state">No patients in queue</p>}
            {list.map(b => (
              <div key={b.token} className={`queue-item ${b.token === serving ? 'active' : ''}`}>
                <span className="token-badge">#{b.token}</span>
                <span className="patient-name">{b.name}</span>
                <span className="patient-phone">{b.phone}</span>
                {b.token === serving && <span className="status-badge">Now</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
