import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Landing from './pages/Landing/Landing';
import CardQuestions from "./pages/CardQuestions/CardQuestions";

function App() {
    return (
        <div className="App">
            <Router basename="/quiz-cards">
                <Routes>
                    <Route path="/" element={<Landing/>}/>
                    <Route path="/cardQuestions/:categoryId" element={<CardQuestions />}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;