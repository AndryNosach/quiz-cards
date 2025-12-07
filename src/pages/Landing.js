import React, {useEffect, useState} from 'react';
import './Landing.css';
import {supabase} from "../api/SupabaseClient";
import CustomCard from "../components/CustomCard/CustomCard";

function Landing() {

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        console.log("fetch questions")
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        const { data, error } = await supabase.from("questions").select("*");

        if (error) {
            console.error("Ошибка при получении вопросов:", error);
        } else {
            setQuestions(data);
        }
    };

    const nextQuestion = () => {
        setCurrentIndex((prev) => (prev + 1) % questions.length);
    };

    if (questions.length === 0) return <p>Загрузка вопросов...</p>;

    return (
        <div className="card-game-wrapper">
            <CustomCard
                backText={questions[currentIndex].question}
                onCardClick={() => {nextQuestion()}}
            />
        </div>
    )
}

export default Landing;