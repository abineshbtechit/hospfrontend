import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Patient() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [list, setList] = useState([]);
  const [currentToken, setCurrentToken] = useState(0);
  const [servingToken, setServingToken] = useState(0);

  const avgMinutes = 5; // ✅ define once

  useEffect(() => {
    socket.on("booking_list", (data) => {
      setList(data);
      setCurrentToken(data.length + 1);
    });

    socket.on("serve_update", setServingToken);

    return () => {
      socket.off("booking_list");
      socket.off("serve_update");
    };
  }, []);

  const book = () => {
    if (!name || !phone) return;
    socket.emit("book_token", { name, phone });
    setName("");
    setPhone("");
  };

  return (
    <div className="clinic-container">
      <header className="clinic-header">
        <h1 className="clinic-title">🏥 HealthCare Clinic</h1>
        <p className="clinic-subtitle">Patient Portal</p>
      </header>

      <div className="patient-content">
        <div className="info-cards">
          <div className="info-card highlight">
            <p className="card-label">Now Serving</p>
            <div className="serving-number">{servingToken}</div>
          </div>
          <div className="info-card">
            <p className="card-label">Total Bookings</p>
            <h3 className="stat-value">{currentToken - 1}</h3>
          </div>
          <div className="info-card">
            <p className="card-label">book Your Token</p>
            <h3 className="stat-value">{currentToken}</h3>
          </div>
        </div>

        <div className="booking-form-card">
          <h3 className="section-title">Book Your Token</h3>
          <div className="form-group">
            <input 
              className="form-input" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Enter your name" 
            />
            <input 
              className="form-input" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="Phone number" 
            />
            <button className="btn-book" onClick={book}>Book Token</button>
          </div>
        </div>

        <div className="queue-section">
          <h3 className="section-title">Current Queue</h3>
          <div className="queue-list">
            {list.length === 0 && <p className="empty-state">No patients in queue</p>}
            {list.map(b => {
              const estTime = new Date(
                Date.now() + Math.max(b.token - servingToken, 0) * avgMinutes * 60000
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              return (
                <div key={b.token} className={`queue-item ${b.token === servingToken ? 'active' : ''}`}>
                  <span className="token-badge">#{b.token}</span>
                  <span className="patient-name">{b.name}</span>
                  <span className="patient-phone">{b.phone}</span>
                  <span className="est-time">{estTime}</span>
                  {b.token === servingToken && <span className="status-badge">Now</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
