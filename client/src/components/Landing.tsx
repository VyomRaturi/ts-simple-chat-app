import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    TextField,
    Container,
    Box,
    Snackbar,
    SnackbarContent,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const LandingPage: FC = () => {
    const [username, setUsername] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleStartChatting = (e: React.FormEvent) => {
        e.preventDefault();

        // trigger alert if username is empty
        if (username.trim() === "") {
            setOpen(true);
            return;
        }
        navigate("/chat", { state: { username } });
    };

    // handle closing of alert
    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url(/landingimg.jpg)`,
                backgroundSize: "cover",
            }}
        >
            <Container maxWidth="sm">
                <Box
                    component="form"
                    sx={{
                        width: "100%",
                        marginTop: 1,
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleStartChatting}
                        sx={{ marginTop: "10px" }}
                    >
                        Start Chatting
                    </Button>
                </Box>
            </Container>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <SnackbarContent
                    message="Username is required"
                    sx={{ bgcolor: "error.main" }}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleClose}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                />
            </Snackbar>
        </Box>
    );
};

export default LandingPage;
