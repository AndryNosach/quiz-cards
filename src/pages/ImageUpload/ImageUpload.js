import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from '@mui/material';
import { useState } from 'react';

function ImageUpload({ open, onClose, onSave }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSave = () => {
        if (file) {
            onSave(file);
            setFile(null);
            onClose();
        }
    };

    const handleClose = () => {
        setFile(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Загрузить изображение 300x450 px </DialogTitle>

            <DialogContent>
                <Button component="label" variant="outlined">
                    Выбрать файл
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </Button>

                {file && (
                    <Typography mt={2}>
                        Выбран файл: <b>{file.name}</b>
                    </Typography>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button
                    variant="contained"
                    disabled={!file}
                    onClick={handleSave}
                >
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ImageUpload;
