import React from 'react';

// Import Styling
import './CSS/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Component Imports
import AuthForm from './Components/AuthForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<AuthForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
