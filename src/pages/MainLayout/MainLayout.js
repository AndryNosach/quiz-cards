import { Outlet } from "react-router-dom";
import { AppBar, Toolbar, Box, Typography } from "@mui/material";
import LanguageSelector from "../../components/LanguageSelector/LanguageSelector";
import React from "react";

const MainLayout = () => {
    return (
        <>
            <AppBar position="sticky"
                    color="transparent"
                    elevation={0}
                    sx={{
                        backdropFilter: "blur(6px)",
                    }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>

                    </Typography>

                    {/* 🌍 Переключатель языка */}
                    <LanguageSelector />
                </Toolbar>
            </AppBar>

            {/* 📄 Страницы */}
            <Box sx={{ p: 2 }}>
                <Outlet />
            </Box>
        </>
    );
}

export default MainLayout;
