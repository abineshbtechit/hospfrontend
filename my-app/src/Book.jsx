import React, { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Book() {
  const [token, setToken] = useState(0);
   const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [myToken, setMyToken] = useState(null);


  useEffect(() => {
    socket.on("token_update", (t) => setToken(t));
    return () => socket.off("token_update");
  }, []);
const book = () => {
    socket.emit("book_token", { name, phone });
  };

  return (
    <div>
      <h2>Current Token: {token}</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={book}>Book Token</button>

      {myToken && <h3>Your Token: {myToken}</h3>}
    </div>
  );
}

export default Book;

