import React, { useState, useRef, useEffect } from "react";
import "./FlipCard.css";
import Button from "@mui/material/Button"; // сюда перенеси свои стили карточки

const BASE_FONT_SIZE = 1.4;
const MIN_FONT_SIZE = 0.8;

export default function FlipCard({ backText, onCardClick }) {
    const [question, setQuestion] = useState("Нажмите на карту, чтобы получить свой вопрос.");
    const [isFlipped, setIsFlipped] = useState(false);
    const cardRef = useRef(null);
    const questionRef = useRef(null);
    const contentRef = useRef(null);

    // --- Динамическое уменьшение шрифта ---
    const adjustFontSize = () => {
        if (!questionRef.current || !contentRef.current) return;

        questionRef.current.style.fontSize = `${BASE_FONT_SIZE}em`;

        const contentHeight = contentRef.current.clientHeight;
        let textHeight = questionRef.current.scrollHeight;

        let currentSize = BASE_FONT_SIZE;
        while (textHeight > contentHeight && currentSize > MIN_FONT_SIZE) {
            currentSize -= 0.05;
            questionRef.current.style.fontSize = `${currentSize}em`;
            textHeight = questionRef.current.scrollHeight;
        }
    };

    // --- Обработчик клика на карточку ---
    const handleCardClick = async () => {
        if (isFlipped) return;
        setQuestion(backText);
        setIsFlipped(true);
        // Корректируем размер шрифта после обновления текста
        setTimeout(adjustFontSize, 50);
    };

    // --- Сброс карточки ---
    const handleReset = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setQuestion("Нажмите на карту, чтобы получить свой вопрос.");
            onCardClick();
            if (questionRef.current) {
                questionRef.current.style.fontSize = `${BASE_FONT_SIZE}em`;
            }
        }, 800); // Ждём окончания анимации переворота
    };

    // Инициализация шрифта при монтировании
    useEffect(() => {
        if (questionRef.current) {
            questionRef.current.style.fontSize = `${BASE_FONT_SIZE}em`;
        }
    }, []);

    return (
        <div>
            <div className="card-container" ref={cardRef} onClick={handleCardClick}>
                <div className={`card ${isFlipped ? "is-flipped" : ""}`}>
                    <div className="card-face card-back">
                        <div className="back-content">
                            <h1>Перевернуть</h1>
                        </div>
                    </div>
                    <div className="card-face card-front">
                        <div className="question-content" ref={contentRef}>
                            <p ref={questionRef}>{question}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Button
                variant="contained"
                size="large"
                sx={{ borderRadius: 8, margin: 1 }}
                onClick={handleReset}
            >
                Сбросить / Новая карта
            </Button>
        </div>
    );
}
