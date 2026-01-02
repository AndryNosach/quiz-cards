import React from 'react';
import './LanguageSelector.css';
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from '@mui/material/Select';
import {useDispatch, useSelector} from "react-redux";
import {setLanguage} from "../../store/languageSlice";
import { languages } from "../../i18n/languages";
import Typography from "@mui/material/Typography";

const LanguageSelector = () => {

    const dispatch = useDispatch();
    const lang = useSelector((state) => state.language.lang);

    return (
        <Select
            value={lang}
            size="small"
            onChange={(e) => dispatch(setLanguage(e.target.value))}
            renderValue={(selected) => {
                const current = languages.find(l => l.code === selected);
                return (
                    <Box display="flex" alignItems="center" gap={1}>
                        <img
                            src={current.flag}
                            alt={current.label}
                            width={22}
                            height={16}
                        />
                        <Typography variant="body2">
                            {current.code.toUpperCase()}
                        </Typography>
                    </Box>
                );
            }}
        >
            {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <img
                            src={lang.flag}
                            alt={lang.label}
                            width={22}
                            height={16}
                        />
                        <Typography>{lang.label}</Typography>
                    </Box>
                </MenuItem>
            ))}
        </Select>
    );
}

export default LanguageSelector;