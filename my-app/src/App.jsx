import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Doctor from "./Doctor";
import Patient1 from "./Patient1";
import Book from "./Book";

import Signup from "./Signup";
import Login from "./Login"
function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Signup />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/patient1" element={<Patient1 />} />
        <Route path="/book" element={<Book />} />
       
      </Routes>
    </Router>
  );
}

export default App;