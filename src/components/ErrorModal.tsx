/*
    Modul: ErrorModal.tsx
    Autor: Hůlek Matěj
*/

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ErrorIcon from '@mui/icons-material/Error';

import { errorState } from "../App"

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type ErrorModalProps = {
    error: errorState,
    closeErrorModal: () => void
};

const ErrorModal: React.FC<ErrorModalProps> = (props) => {

    return (
        <Modal
            open={props.error.isError}
            onClose={props.closeErrorModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>

                <Stack direction="row" alignItems="center" gap={1} style={{ color: "red" }}>
                    <ErrorIcon />
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Error
                    </Typography>
                </Stack>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {props.error.message}
                </Typography>
            </Box>
        </Modal>
    )
}

export default ErrorModal;