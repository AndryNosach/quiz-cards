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

function EditQuestions({currentCategory}) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [questions, setQuestions] = useState([]);

    const emptyQuestion = {id: 0, question: '', edit: false};

    useEffect(() => {
        if (currentCategory) {
            if (currentCategory.questions) {
                const array = [emptyQuestion, ...currentCategory.questions.map((el) => {
                    return {...el, edit: false}
                })];
                array.sort((a, b) => a.id - b.id);
                setQuestions(array);
            } else if (currentCategory.id) {
                setQuestions([emptyQuestion]);
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
        setQuestions(prev => prev.map(el => id == el.id ? {...el, edit: true} : {...el, edit: false}));
    };

    const setTempValue = (newValue, id) => {
        setQuestions(prev => prev.map(el => id == el.id ? {...el, question: newValue} : el));
    }

    const saveNewValue = async (question) => {
        console.log('save', question);
        if (question.id == 0) {
            if (!question.question) {
                setQuestions(prev => prev.map(el => ({...el, edit: false})));
                return;
            }
            const savedData = await supabase.from("questions").insert({
                question: question.question,
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
        const prevQuestion = currentCategory.questions.find(el => el.id == question.id);
        if (prevQuestion.question !== question.question) {
            await supabase.from("questions").update({question: question.question}).eq('id', question.id);
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
        <Box>
            {questions && questions.length > 0 &&
            <Box>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 500}} aria-label="custom pagination table">
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
                                    <TableRow key={row.question}>
                                        <TableCell component="th" scope="row">
                                            <TextField
                                                autoFocus
                                                fullWidth
                                                value={row.question}
                                                onChange={(e) => setTempValue(e.target.value, row.id)}
                                                onBlur={() => {
                                                }}
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
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="success" onClick={() => saveNewValue(row)}>
                                                <SaveIcon fontSize="small"/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    :
                                    <TableRow key={row.question}>
                                        <TableCell scope="row" width="60px;">
                                            {row.question}
                                        </TableCell>
                                        <TableCell scope="row" width="10%">
                                            <Box className="question-btn-container">
                                                <Box  sx={{alignContent: 'end'}}>
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