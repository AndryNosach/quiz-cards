import React, {useEffect, useState} from 'react';
import './EditQuestions.css';
import Box from "@mui/material/Box";
import DeleteIcon from '@mui/icons-material/Delete';
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import TablePaginationActions from "@mui/material/TablePaginationActions";
import TableHead from "@mui/material/TableHead";
import {Edit} from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import {supabase} from "../../api/SupabaseClient";
import Typography from "@mui/material/Typography";
import {languages} from "../../i18n/languages";
import {useTranslate} from "../../hooks/useTranslate";
import {useSelector} from "react-redux";

function EditQuestions({currentCategory, setErrorMessage}) {

    let lang = useSelector((state) => state.language.lang);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [questions, setQuestions] = useState([]);
    const [questionField, setQuestionField] = useState(`question_${lang}`);

    const emptyQuestion = {id: 0, question: '', edit: false};
    const translator = useTranslate();

    useEffect(() => {
        setQuestionField(`question_${lang}`);
    }, [lang]);

    useEffect(() => {
        if (currentCategory) {
            if (currentCategory.questions) {
                const array = [{id: 0, question: '', edit: false}, ...currentCategory.questions.map((el) => {
                    return {...el, edit: false}
                })];
                array.sort((a, b) => a.id - b.id);
                setQuestions(array);
            } else if (currentCategory.id) {
                setQuestions([{id: 0, question: '', edit: false}]);
            } else {
                setQuestions([])
            }
        }
    }, [currentCategory])

    const emptyRows =
        (currentCategory && page > 0) ? Math.max(0, (1 + page) * rowsPerPage - currentCategory.questions.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCellClick = (id) => {
        setQuestions(prev => prev.map(el => id === el.id ? {...el, edit: true} : {...el, edit: false}));
    };

    const setTempValue = (newValue, id, language) => {

        const langField = `question_${language}`;
        setQuestions(prev => prev.map(el => {
            if (id === el.id) {
                el[langField] = newValue;
                return el;
            } else {
                return el;
            }
        }));
    }

    const isEmptyQuestion = (question) => {
        return !question || (!question.question_ua && !question.question_ru && !question.question_en && !question.question_de);
    }

    const isIncompleteQuestion = (question) => {
        return !isEmptyQuestion(question) && (!question.question_ua || !question.question_ru || !question.question_en || !question.question_de);
    }

    const isEquals = (question1, question2) => {
        return question1.question_ua === question2.question_ua &&
            question1.question_ru === question2.question_ru &&
            question1.question_en === question2.question_en &&
            question1.question_de === question2.question_de;
    }

    const saveNewValue = async (question) => {
        setErrorMessage(null);
        console.log('save', question);
        if (isIncompleteQuestion(question)) {
            setErrorMessage(translator("incompleteQuestion"));
            return;
        }
        if (question.id === 0) {
            if (isEmptyQuestion(question)) {
                setQuestions(prev => prev.map(el => ({...el, edit: false})));
                return;
            }
            const savedData = await supabase.from("questions").insert({
                question_ua: question.question_ua,
                question_ru: question.question_ru,
                question_en: question.question_en,
                question_de: question.question_de,
                category_id: currentCategory.id
            }).select();
            questions.forEach(el => {
                if (el.id === question.id) {
                    el.id = savedData.data[0].id;
                }
            });
            questions.sort((a, b) => a.id - b.id);
            currentCategory.questions = questions;
            setQuestions(prev => [emptyQuestion, ...prev.map(el => ({...el, edit: false}))]);
            return;
        }
        const prevQuestion = currentCategory.questions.find(el => el.id === question.id);
        if (!isEquals(prevQuestion, question)) {
            await supabase.from("questions").update({
                question_ua: question.question_ua,
                question_ru: question.question_ru,
                question_en: question.question_en,
                question_de: question.question_de,
            }).eq('id', question.id);
            currentCategory.questions = questions;
        }
        setQuestions(prev => prev.map(el => ({...el, edit: false})));
    }

    const onRemove = async (question) => {
        console.log('remove', question);
        await supabase.from("questions").delete().eq('id', question.id);
        const filtered = questions.filter(el => el.id !== question.id);
        console.log(filtered);
        setQuestions(filtered);
        currentCategory.questions = filtered;
    }

    return (
        <Box className="edit-questions-box">
            {questions && questions.length > 0 &&
            <Box className="edit-questions-table">
                <TableContainer component={Paper}>
                    <Table aria-label="custom pagination table">
                        <TableHead sx={{backgroundColor: '#e9e9e9'}}>
                            <TableRow>
                                <TableCell sx={{fontWeight: "bold"}}>Вопрос</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                    ? questions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : questions
                            ).map((row) => (
                                row && row.edit ?
                                    <TableRow key={row.question_ua}>
                                        <TableCell component="th" scope="row">
                                            <Box display="flex" alignItems="left" gap={1}>
                                                <Box x={{paddingTop: '2px'}}>
                                                    <img
                                                        src={languages[0].flag}
                                                        alt={languages[0].flag}
                                                        width={22}
                                                        height={16}
                                                    />
                                                </Box>
                                                <TextField
                                                    autoFocus
                                                    fullWidth
                                                    value={row.question_ua}
                                                    onChange={(e) => setTempValue(e.target.value, row.id, 'ua')}
                                                    onKeyDown={() => {
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            height: 40
                                                        }
                                                    }}
                                                />
                                            </Box>
                                            <Box display="flex" alignItems="left" gap={1}>
                                                <Box sx={{paddingTop: '18px'}}>
                                                    <img
                                                        src={languages[3].flag}
                                                        alt={languages[3].flag}
                                                        width={22}
                                                        height={16}
                                                    />
                                                </Box>
                                                <TextField
                                                    fullWidth
                                                    value={row.question_ru}
                                                    onChange={(e) => setTempValue(e.target.value, row.id, 'ru')}
                                                    onKeyDown={() => {
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            height: 40,
                                                            marginTop: 1
                                                        }
                                                    }}
                                                />
                                            </Box>
                                            <Box display="flex" alignItems="left" gap={1}>
                                                <Box sx={{paddingTop: '18px'}}>
                                                    <img
                                                        src={languages[1].flag}
                                                        alt={languages[1].flag}
                                                        width={22}
                                                        height={16}
                                                    />
                                                </Box>
                                                <TextField
                                                    fullWidth
                                                    value={row.question_en}
                                                    onChange={(e) => setTempValue(e.target.value, row.id, 'en')}
                                                    onKeyDown={() => {
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            height: 40,
                                                            marginTop: 1
                                                        }
                                                    }}
                                                />
                                            </Box>
                                            <Box display="flex" alignItems="left" gap={1}>
                                                <Box sx={{paddingTop: '18px'}}>
                                                    <img
                                                        src={languages[2].flag}
                                                        alt={languages[2].flag}
                                                        width={22}
                                                        height={16}
                                                    />
                                                </Box>
                                                <TextField
                                                    fullWidth
                                                    value={row.question_de}
                                                    onChange={(e) => setTempValue(e.target.value, row.id, 'de')}
                                                    onKeyDown={() => {
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            height: 40,
                                                            marginTop: 1
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="success" onClick={() => saveNewValue(row)}>
                                                <SaveIcon fontSize="small"/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    :
                                    <TableRow key={row.question_ua}>
                                        <TableCell scope="row" width="60px;">
                                            <Typography
                                                sx={{
                                                    color: 'primary.main',
                                                }}
                                            >
                                                {row[questionField]}
                                            </Typography>
                                        </TableCell>
                                        <TableCell scope="row" width="10%">
                                            <Box className="question-btn-container">
                                                <Box sx={{alignContent: 'end'}}>
                                                    <Edit
                                                        fontSize="small"
                                                        sx={{cursor: 'pointer'}}
                                                        onClick={() => handleCellClick(row.id)}
                                                    />
                                                </Box>
                                                {row.id > 0 &&
                                                <Box sx={{marginLeft: 2}}>
                                                    <IconButton color="error">
                                                        <DeleteIcon
                                                            fontSize="small"
                                                            sx={{cursor: 'pointer'}}
                                                            onClick={() => onRemove(row)}
                                                        />
                                                    </IconButton>
                                                </Box>
                                                }
                                            </Box>
                                        </TableCell>
                                    </TableRow>

                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{height: 53 * emptyRows}}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, {label: 'All', value: -1}]}
                                    colSpan={3}
                                    count={questions.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    slotProps={{
                                        select: {
                                            inputProps: {
                                                'aria-label': 'rows per page',
                                            },
                                            native: true,
                                        },
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
            }
        </Box>
    )
}

export default EditQuestions;