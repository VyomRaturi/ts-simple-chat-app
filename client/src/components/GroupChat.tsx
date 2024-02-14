import { FC, useEffect, useMemo, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import {
    Box,
    Button,
    Container,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

interface Message {
    username: string;
    text: string;
}

const GroupChat: FC = () => {
    const location = useLocation();
    const username = (location.state as { username?: string })?.username;

    const socket: Socket = useMemo(() => io("http://localhost:3000"), []);

    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        socket.emit("message", { username, text: message });
        setMessage("");
    };

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("receive-message", (data: Message) => {
            console.log(data);
            setMessages((prev) => [...prev, data]);
        });

        socket.on("welcome", (s: string) => {
            console.log(s);
        });

        return () => {
            socket.off("connect");
            socket.off("receive-message");
            socket.off("welcome");
        };
    }, [socket]);

    if (!username) {
        return <Navigate to="/" />;
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h3" component="div">
                Welcome to socket.io {username}
            </Typography>
            <Box
                sx={{
                    height: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: "1px solid gray",
                    borderRadius: "5px",
                    padding: "20px",
                    marginTop: "20px",
                    overflow: "auto",
                }}
            >
                <Box
                    component="div"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        flexGrow: 1,
                        overflow: "auto",
                    }}
                >
                    <Stack spacing={2}>
                        {messages.map((msg, i) => (
                            <Typography key={i} variant="h6" component="div">
                                <strong>{msg.username}:</strong>
                                {msg.text}
                            </Typography>
                        ))}
                    </Stack>
                </Box>
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "20px",
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        variant="outlined"
                        fullWidth
                        id="message"
                        label="Type a message"
                        name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ marginLeft: "10px" }}
                        onClick={handleSubmit}
                    >
                        Send
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default GroupChat;
