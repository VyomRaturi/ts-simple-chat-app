import { FC } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/Landing";
import GroupChat from "./components/GroupChat";

const App: FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/chat" element={<GroupChat />} />
            </Routes>
        </Router>
    );
};

export default App;
