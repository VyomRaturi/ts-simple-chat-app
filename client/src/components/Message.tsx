import { Box, Typography } from "@mui/material";
import { MessageType } from "../interface";

type Props = {
    message: MessageType;
    currentUser: string;
};

const Message = ({ message, currentUser }: Props) => {
    const isCurrentUser = message.username === currentUser;
    const timestamp = new Date(message.timestamp);
    const formattedTimestamp = timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <Box
            sx={{
                alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                bgcolor: isCurrentUser ? "primary.main" : "grey.500",
                color: "white",
                m: 1,
                p: 0.7,
                borderRadius: 1,
                width: "fit-content",
                minWidth: "130px",
                maxWidth: "50%",
                wordWrap: "break-word",
                overflowWrap: "break-word",
            }}
        >
            <Typography variant="subtitle2">
                {isCurrentUser ? "" : <strong>{message.username}</strong>}
            </Typography>
            <Typography variant="body1">{message.text}</Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Typography variant="caption">{formattedTimestamp}</Typography>
            </Box>
        </Box>
    );
};

export default Message;
