import React, {useCallback, useEffect, useState} from 'react';
import './EditPage.css';
import {supabase} from "../../api/SupabaseClient";
import {Button} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import CategorySelect from "../../components/CategorySelect/CategorySelect";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

function EditPage() {

    const {categoryId} = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [categories, setCategories] = useState([]);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);

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

    const fetchQuestions = useCallback(async () => {
        const {data, error} = await supabase.from("questions").select("*").eq("category_id", categoryId);

        if (error) {
            console.error("Ошибка при получении вопросов:", error);
        } else {
            setQuestions(data);
        }
    }, [categoryId])

    const onCategorySelect = (id) => {
        setCurrentCategoryId(id);
    };


    return (
        <Box className="edit-page">
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center", // по центру
                }}
            >
                <Box sx={{marginTop: 5, width: 310}}>
                    <CategorySelect
                        categories={categories}
                        onCategorySelect={id => onCategorySelect(id)}
                    />
                </Box>
                <Box className="add-category-button">
                    <Fab color="success" aria-label="add">
                        <AddIcon />
                    </Fab>
                </Box>
            </Box>
            <Divider
                sx={{
                    my: 2,
                    borderBottomWidth: 3, // толщина линии
                    borderColor: "grey.400",
                }}
            />
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
    )
}

export default EditPage;