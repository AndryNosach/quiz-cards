import React, {useEffect, useState} from 'react';
import './EditQuestions.css';
import Box from "@mui/material/Box";
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
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (currentCategory && currentCategory.questions) {
            setQuestions([ {id: 0, question: '', edit: false}, ...currentCategory.questions.map((el) => {
                return {...el, edit: false}
            })]);
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
        console.log(question);
        if (question.id == 0) {
            if (!question.question) {
                setQuestions(prev => prev.map(el => ({...el, edit: false})));
                return;
            }
            await supabase.from("questions").insert({question: question.question, category_id: currentCategory.id}).select();
            setQuestions(prev => prev.map(el => ({...el, edit: false})));
            currentCategory.questions = questions;
            return;
        }
        const prevQuestion = currentCategory.questions.find(el => el.id == question.id);
        if (prevQuestion.question !== question.question) {
            console.log('update');
            await supabase.from("questions").update({question: question.question}).eq('id', question.id);
            currentCategory.questions = questions;
        }
        setQuestions(prev => prev.map(el => ({...el, edit: false})));
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
                                <TableCell />
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
                                                onBlur={() => {}}
                                                onKeyDown={() => {}}
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
                                        <TableCell component="th" scope="row">
                                            {row.question}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Edit
                                                fontSize="small"
                                                sx={{ cursor: 'pointer' }}
                                                onClick={() => handleCellClick(row.id)}
                                            />
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