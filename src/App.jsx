import { useState } from "react";
import Register from "./components/Register";
import SigningIn from "./components/SigningIn";
import URL from "./components/URL";
import ShortLinks from "./components/ShortLinks";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const App = () => {
    const [token, setToken] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [alert, setAlert] = useState({ message: "", type: "" });

    const showAlert = (message, type) => {
        setAlert({ message, type });
        setTimeout(() => setAlert({ message: "", type: "" }), 5000);
    };

    return (
        <div className="wrapper">
            <h1>SHORTENER</h1>
            {alert.message && (
                <div className={`alert alert-${alert.type}`}>
                    {alert.message}
                </div>
            )}
            {!token ? (
                <div className="auth-section">
                    <p>
                        Before you start working, please try to log in or
                        register
                    </p>
                    {isRegistering ? (
                        <Register
                            apiBaseUrl={API_BASE_URL}
                            onLoginSuccess={(token) => setToken(token)}
                            showAlert={showAlert}
                        />
                    ) : (
                        <SigningIn
                            apiBaseUrl={API_BASE_URL}
                            onLoginSuccess={setToken}
                            showAlert={showAlert}
                        />
                    )}
                    <p>
                        {isRegistering ? (
                            <span>
                                Do you have an existing account?{" "}
                                <button
                                    className="toggle"
                                    onClick={() => setIsRegistering(false)}
                                >
                                    Log In
                                </button>
                            </span>
                        ) : (
                            <span>
                                Create a new profile{" "}
                                <button
                                    className="toggle"
                                    onClick={() => setIsRegistering(true)}
                                >
                                    here
                                </button>
                            </span>
                        )}
                    </p>
                </div>
            ) : (
                <div className="main-section">
                    <URL
                        apiBaseUrl={API_BASE_URL}
                        token={token}
                        showAlert={showAlert}
                    />
                    <ShortLinks
                        apiBaseUrl={API_BASE_URL}
                        token={token}
                        showAlert={showAlert}
                    />
                </div>
            )}
        </div>
    );
};

export default App;
