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
import ImageIcon from '@mui/icons-material/Image';
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import EditQuestions from "../EditQuestions/EditQuestions";
import ImageUpload from "../ImageUpload/ImageUpload";

function EditPage() {
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [categoryName, setCategoryName] = useState(null);
    const [uploadDialog, setUploadDialog] = useState(false);

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
        clearMessages();
        setCurrentCategory(category);
        setCategoryName(category.name);
    };

    const saveCategory = async () => {
        clearMessages();
        if (currentCategory && currentCategory.id) {
            const nameChanged = categories.find(el => (el.id == currentCategory.id && el.name != categoryName));
            if (!nameChanged) {
                return;
            }
            var {data, error} = await supabase.from("categories").update({name: categoryName}).eq("id", currentCategory.id).select('*');
            if (data) {
                const updateCat = {...data[0], questions: currentCategory.questions};
                setCategories(prev =>
                    prev.map(cat =>
                        cat.id === currentCategory.id ? updateCat : cat
                    )
                );
                setCurrentCategory(updateCat);
            }
        } else {
            var {data, error} = await supabase.from("categories").insert([{name: categoryName}]).select("*");
            if (data) {
                setCategories(prev =>
                    [...prev, data[0]]
                );
                setCurrentCategory(data[0]);
            }
        }
        if (error) {
            console.error("Ошибка при получении вопросов:", error);
        } else if (data) {
            setErrorMessage(null);
            setSuccessMessage(null);
        }
    };

    const removeCategory = async () => {
        clearMessages();
        if (currentCategory && currentCategory.id) {
            if (!!currentCategory.questions &&
                (currentCategory.questions.length > 0 && !(currentCategory.questions.length == 1 && currentCategory.questions[0].id == 0))) {
                setErrorMessage("Есть вопросы в категории!!!");
                setSuccessMessage(null);
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
                setCategoryName(categories[0].name);
            }
        }
    };

    const uploadImage = async (file) => {
        clearMessages();
        const path = file.name;
        var {error} = await supabase.storage.from("assets").upload(path, file, {upsert: true, cacheControl: '3600',});
        if (error) {
            setErrorMessage("Ошибка загрузки файла!!!")
        }
        ;
        var url = await supabase.storage.from('assets').getPublicUrl(path);
        if (url && url.data && url.data.publicUrl) {
            var {error} = await supabase.from("categories").update({img_url: url.data.publicUrl}).eq("id", currentCategory.id).select('*');
            if (!error) {
                setSuccessMessage("Изображение загружено!");
            }
        }
    }

    const clearMessages = () => {
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    return (
        <Box className="edit-page">
            <Box className="edit-page-content">
                <Box sx={{visibility: !!errorMessage || !!successMessage ? '' : 'hidden'}}>
                    <Alert severity={errorMessage ? "error" : "success"} sx={{mt: 2}}>
                        {errorMessage ? errorMessage : successMessage}
                    </Alert>
                </Box>
                <Box className="category-content">
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Box className="category-select-box" sx={{marginTop: 5, width: 310}}>
                            <CategorySelect
                                categories={categories}
                                onCategorySelect={category => onCategorySelect(category)}
                                currentCategory={currentCategory}
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
                            <IconButton onClick={() => setUploadDialog(true)}>
                                <ImageIcon fontSize="large"/>
                            </IconButton>
                        </Box>
                        <Box>
                            <ImageUpload
                                open={uploadDialog}
                                onSave={uploadImage}
                                onClose={() => setUploadDialog(false)}
                            />
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
        </Box>
    )
}

export default EditPage;