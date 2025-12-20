import React, {useState, useEffect} from 'react';
import {Card, CardContent} from '@mui/material';
import './CustomCard.css';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import bgImage from "../../assets/images/dog.png";

export default function CustomCard({backText, isFlipped, handleCardClick}) {

    const [question, setQuestion] = useState("...");

    useEffect(() => {
        if(!isFlipped) {
            setQuestion("...");
            setTimeout(() => {
                setQuestion(backText);
            }, 800); // Ждём окончания анимации переворота
        }
    }, [isFlipped, backText])

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
                    <CardContent className="back-content"
                                 sx={{
                                     backgroundImage: `url(${bgImage})`,
                                     backgroundSize: "cover",
                                     backgroundPosition: "center",
                                     minHeight: 200,
                                 }}
                    >
                        {/*<Typography variant="h5" align="center">*/}
                        {/*    Перевернуть*/}
                        {/*</Typography>*/}
                    </CardContent>
                </Card>

                {/* BACK SIDE */}
                <Card className="flip-card"
                      sx={{
                          borderRadius: 3,
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
        </Box>
    );
};