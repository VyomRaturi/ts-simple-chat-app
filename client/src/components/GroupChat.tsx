import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import {
    Box,
    Button,
    Container,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import Message from "./Message";
import { MessageType } from "../interface";

const GroupChat: FC = () => {
    const location = useLocation();
    const username = (location.state as { username?: string })?.username;

    // responsive font size
    const isSmallScreen = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down("sm")
    );
    const headingVariant = isSmallScreen ? "h5" : "h3";

    const socket: Socket = useMemo(() => io("http://localhost:3000"), []);

    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<MessageType[]>([]);

    // reference to the end of messages div to auto scroll
    const endOfMessagesRef = useRef<null | HTMLDivElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message) return;
        socket.emit("message", {
            username,
            text: message,
            timestamp: new Date(),
        });
        setMessage("");
    };

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("receive-message", (data: MessageType) => {
            console.log(data);
            setMessages((prev) => [...prev, data]);
        });

        socket.on("welcome", (s: string) => {
            console.log(s);
        });

        // set timeout for auto scroll , triggers only after new message is received or sent
        setTimeout(() => {
            endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);

        return () => {
            socket.off("connect");
            socket.off("receive-message");
            socket.off("welcome");
        };
    }, [socket, messages]);

    if (!username) {
        return <Navigate to="/" />;
    }

    return (
        <Box
            sx={{
                backgroundColor: "grey.300",
                height: "100vh",
                padding: "30px",
            }}
        >
            <Container maxWidth="md">
                <Typography variant={headingVariant} component="div">
                    Welcome to Chat App {username}
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
                        <Stack sx={{ overflowY: "auto" }} spacing={2}>
                            {messages.map((msg, i) => (
                                <Message
                                    message={msg}
                                    key={i}
                                    currentUser={username}
                                />
                            ))}

                            {/* Auto scroll to end when new message is received or sent */}
                            <div ref={endOfMessagesRef} />
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
                            sx={{
                                marginLeft: "10px",
                                height: "100%",
                                width: "100px",
                            }}
                            onClick={handleSubmit}
                        >
                            Send
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default GroupChat;
