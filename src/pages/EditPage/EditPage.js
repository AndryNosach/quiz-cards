import React, {useEffect, useState} from 'react';
import './EditPage.css';
import {supabase} from "../../api/SupabaseClient";
import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import Box from "@mui/material/Box";
import CategorySelect from "../../components/CategorySelect/CategorySelect";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import EditQuestions from "../EditQuestions/EditQuestions";

function EditPage() {
    const [errorMessage, setErrorMessage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [categoryName, setCategoryName] = useState(null);
    const [updatedCategory, setUpdatedCategory] = useState(null);

    useEffect(() => {
        console.log("fetch categories")
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const {data, error} = await supabase.from("categories").select("*");

        if (error) {
            console.error("Ошибка при получении вопросов:", error);
        } else {
            if (data) {
                data.forEach((category, index) => {
                    fetchQuestions(category.id).then((questions) => {
                        category.questions = questions;
                    });
                });
            }
            setCategories(data);
        }
    };

    const fetchQuestions = async (catId) => {
        const {data, error} = await supabase.from("questions").select("*").eq("category_id", catId);

        if (error) {
            console.error("Ошибка при получении вопросов:", error);
        } else {
            return data;
        }
    };

    const onCategorySelect = (category) => {
        setCurrentCategory(category);
        setCategoryName(category.name);
    };

    const saveCategory = async () => {
        if (currentCategory && currentCategory.id) {
            var {data, error} = await supabase.from("categories").update({name: categoryName}).eq("id", currentCategory.id).select('*');
            if (data) {
                setCategories(prev =>
                    prev.map(cat =>
                        cat.id === currentCategory.id ? data[0] : cat
                    )
                );
            }
        } else {
            var {data, error} = await supabase.from("categories").insert([{name: categoryName}]).select("*");
            if (data) {
                setCategories(prev =>
                    [...prev, data[0]]
                );
            }
        }
        if (error) {
            console.error("Ошибка при получении вопросов:", error);
        } else if (data) {
            setUpdatedCategory(data[0]);
            setErrorMessage(null);
        }
    };

    const removeCategory = async () => {
        if (currentCategory && currentCategory.id) {
            if (!!currentCategory.questions && currentCategory.questions.length > 0) {
                setErrorMessage("Есть вопросы в категории!!!");
                return;
            }
            var {data, error} = await supabase.from("categories").delete().eq("id", currentCategory.id);
        }
        if (error) {
            console.error("Ошибка при удалении категории:", error);
        } else {
            setCategories(categories.filter(category => category.id !== currentCategory.id));
            if (categories) {
                setCurrentCategory(categories[0]);
                setUpdatedCategory(categories[0]);
                setCategoryName(categories[0].name);
            }
            setErrorMessage(null);
        }
    };


    return (
        <Box className="edit-page">
            <Box sx={{visibility: !!errorMessage ? '' : 'hidden'}}>
                <Alert severity="error" sx={{mt: 2}}>
                    {errorMessage}
                </Alert>
            </Box>
            <Box className="category-content">
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center", // по центру
                    }}
                >
                    <Box sx={{marginTop: 5, width: 310}}>
                        <CategorySelect
                            categories={categories}
                            onCategorySelect={category => onCategorySelect(category)}
                            currentCategory={updatedCategory}
                        />
                    </Box>
                    <Box className="add-category-button">
                        <Fab color="success" size="small" aria-label="add"
                             onClick={() => {
                                 setCurrentCategory({name: ""});
                                 setCategoryName("");
                             }}>
                            <AddIcon/>
                        </Fab>
                        <Fab color="error" size="small" aria-label="remove"
                             sx={{marginLeft: 2}}
                             onClick={() => {
                                 removeCategory()
                             }}
                        >
                            <RemoveIcon/>
                        </Fab>
                    </Box>
                </Box>
                <Box className="category-edit"
                     sx={{
                         display: currentCategory ? "flex" : "none",
                     }}
                >
                    <Box className="category-edit-field">
                        <TextField
                            label="Category name"
                            value={categoryName ? categoryName : ''}
                            onChange={(e) => setCategoryName(e.target.value)}
                            fullWidth
                        />
                    </Box>
                    <Box className="save-category-btn">
                        <IconButton color="success" onClick={() => saveCategory()}>
                            <SaveIcon fontSize="large"/>
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            <Box className="divider">
                <Divider
                    sx={{
                        my: 2,
                        borderBottomWidth: 3, // толщина линии
                        borderColor: "grey.400",
                    }}
                />
            </Box>
            <Box>
                <EditQuestions currentCategory={currentCategory}/>
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
    )
}

export default EditPage;