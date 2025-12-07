import React, {useState} from 'react';
import {Card, CardContent} from '@mui/material';
import './CustomCard.css';
import Button from "@mui/material/Button"; // Import your custom CSS
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function CustomCard({backText, onCardClick}) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [question, setQuestion] = useState("Нажмите на карту, чтобы получить свой вопрос.");

    // --- Обработчик клика на карточку ---
    const handleCardClick = async () => {
        if (isFlipped) return;
        setQuestion(backText);
        setIsFlipped(true);
    };

    // --- Сброс карточки ---
    const handleReset = () => {
        setIsFlipped(false);
        onCardClick();
    };

    return (
        <Box className="flip-card-container" onClick={handleCardClick}>
            <Box className={`flip-card-inner  ${isFlipped ? "flipped" : "not-flipped"}`}
                sx={{transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",}}
            >
                {/* FRONT SIDE */}
                <Card className="flip-card"
                    sx={{
                        boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
                        borderRadius: 3,
                        background: "linear-gradient(135deg, #ffffff, #f0f0f0)",
                    }}
                >
                    <CardContent className="back-content">
                        <Typography variant="h5" align="center">
                            Перевернуть
                        </Typography>
                    </CardContent>
                </Card>

                {/* BACK SIDE */}
                <Card className="flip-card"
                    sx={{
                        transform: "rotateY(180deg)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
                        background: "linear-gradient(135deg, #e7f1ff, #d0e4ff)",
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" align="center">
                            {question}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <Button
                variant="contained"
                size="large"
                sx={{borderRadius: 8, margin: 1}}
                onClick={handleReset}
            >
                Сбросить / Новая карта
            </Button>
        </Box>
    );
};