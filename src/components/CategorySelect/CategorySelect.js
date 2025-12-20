import React, {useEffect, useState} from 'react';
import './CategorySelect.css';
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

function CategorySelect({categories, onCategorySelect, currentCategory}) {
    const [category, setCategory] = useState({});

    useEffect(() => {
        if (currentCategory) {
            setCategory(currentCategory);
        }
    }, [currentCategory])

    const handleChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value);
        onCategorySelect(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                    labelId="simple-select-label"
                    id="simple-select"
                    value={category}
                    label="Category"
                    onChange={handleChange}
                >
                    {categories.map((item) => (
                        <MenuItem value={item}>{item.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </Box>
    );
}

export default CategorySelect;