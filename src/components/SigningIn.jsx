import { useState } from "react";
import axios from "axios";

const SigningIn = ({ apiBaseUrl, onLoginSuccess, showAlert }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/login`,
                new URLSearchParams({
                    username,
                    password,
                    grant_type: "password",
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            onLoginSuccess(response.data.access_token);
            showAlert("Login successful!", "success");
        } catch (error) {
            showAlert(
                "Error during login: " + error.response?.data?.detail,
                "error"
            );
        }
    };

    return (
        <div className="login">
            <input
                type="text"
                placeholder="Your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Sign in</button>
        </div>
    );
};

export default SigningIn;
