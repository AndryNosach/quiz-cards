import React, {useCallback, useEffect, useState} from 'react';
import './CardQuestions.css';
import {supabase} from "../../api/SupabaseClient";
import CustomCard from "../../components/CustomCard/CustomCard";
import {Button} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import Box from "@mui/material/Box";

function CardQuestions() {

    const {categoryId} = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false)
    const [backgroundImg, setBackgroundImg] = useState(null);

    const fetchQuestions = useCallback(async () => {
        const {data, error} = await supabase.from("questions").select("*").eq("category_id", categoryId);

        if (error) {
            console.error("Ошибка при получении вопросов:", error);
        } else {
            setQuestions(data);
        }
    }, [categoryId])

    const fetchBackgroundImg = useCallback(async (imgUrl) => {
        const {data, error} = await supabase.storage.from("assets").getPublicUrl();

        if (error) {
            console.error("Ошибка при получении вопросов:", error);
        } else {
            setQuestions(data);
        }
    }, [categoryId])

    useEffect(() => {
        console.log("fetch categories")
        if (categoryId) {
            fetchQuestions();
        }
    }, [categoryId, fetchQuestions]);

    // --- Обработчик клика на карточку ---
    const handleCardClick = async () => {
        if (isFlipped) return;
        setIsFlipped(true);
    };

    // --- Сброс карточки ---
    const handleReset = () => {
        setIsFlipped(false);
        nextQuestion();
    };

    const nextQuestion = () => {
        setCurrentIndex((prev) => (prev + 1) % questions.length);
    };

    if (questions.length === 0) return <p>Загрузка вопросов...</p>;

    return (
        <Box>
            <Box>
                <CustomCard
                    backText={questions[currentIndex].question}
                    isFlipped={isFlipped}
                    handleCardClick={handleCardClick}
                />
            </Box>
            <Box className="button-box">
                <Box>
                    <Button
                        className="action-button"
                        variant="contained"
                        size="large"
                        sx={{borderRadius: 8, margin: 1}}
                        onClick={() => handleReset()}
                    >
                        Сбросить / Новая карта
                    </Button>
                </Box>
                <Box>
                    <Button
                        className="action-button"
                        variant="contained"
                        size="large"
                        sx={{borderRadius: 8, margin: 1}}
                        component={Link}
                        to="/">
                        Выйти
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default CardQuestions;