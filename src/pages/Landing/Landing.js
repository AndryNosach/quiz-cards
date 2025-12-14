import React, {useEffect, useState} from 'react';
import './Landing.css';
import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import questionPng from "../../assets/images/question.png";
import CategorySelect from "../../components/CategorySelect/CategorySelect";
import {supabase} from "../../api/SupabaseClient";
import Alert from "@mui/material/Alert";

function Landing() {
    const [categories, setCategories] = useState([]);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        console.log("fetch categories")
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const {data, error} = await supabase.from("categories").select("*");

        if (error) {
            console.error("Ошибка при получении вопросов:", error);
        } else {
            setCategories(data);
        }
    };

    const onCategorySelect = (id) => {
        setCurrentCategoryId(id);
    };

    const checkError = () => {
        if (!currentCategoryId) {
         setErrorMessage("Выберите категорию!!!")
        }
    };

    if (!categories) return (
        <Box>
            Loading....
        </Box>
    );

    return (
        <Box sx={{marginTop: -40}}>
            <Box>
                <CardMedia
                    component="img"
                    height="200"
                    width="1000"
                    src={questionPng}
                    alt="My Image"
                />
            </Box>
            <Box sx={{
                marginTop: 2,
                height: 50
            }}>
                {errorMessage && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {errorMessage}
                    </Alert>
                )}
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        sx={{borderRadius: 8, margin: 1}}
                        onClick={() => checkError()}
                        to={currentCategoryId ? '/cardQuestions/' + currentCategoryId : '#'}
                    >
                        New game
                    </Button>
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        sx={{borderRadius: 8, margin: 1}}
                        onClick={() => checkError()}
                        to="/edit"
                    >
                        Edit questions
                    </Button>
                </Box>
            </Box>
            <Box sx={{marginTop: 5, width: 310}}>
                <CategorySelect
                    categories={categories}
                    onCategorySelect={id => onCategorySelect(id)}
                />
            </Box>
        </Box>
    )
}

export default Landing;