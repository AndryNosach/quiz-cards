import React from 'react';
import './App.css';
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import Landing from './pages/Landing/Landing';
import CardQuestions from "./pages/CardQuestions/CardQuestions";
import EditPage from "./pages/EditPage/EditPage";
import MainLayout from "./pages/MainLayout/MainLayout";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route  element={<MainLayout />}>
                        <Route path="/" element={<Landing/>}/>
                        <Route path="/cardQuestions/:categoryId" element={<CardQuestions />}/>
                        <Route path="/edit" element={<EditPage />}/>
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;