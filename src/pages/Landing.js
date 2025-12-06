import React, {useEffect, useState} from 'react';
import './Landing.css';
import FlipCard from "../components/FlipCard/FlipCard";

function Landing() {

    const [number, setNumber] = useState(1);
    const [question, setQuestion] = useState("Вопрос №" + number);

    useEffect(() => {
        setQuestion("Вопрос №" + number)
    }, [number])

    return (
        <div className="card-game-wrapper">
            <FlipCard
                backText={question}
                onCardClick={() => {setNumber(number + 1)}}
            />
        </div>
    )
}

export default Landing;