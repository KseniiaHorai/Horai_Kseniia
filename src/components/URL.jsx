import { useState } from "react";
import axios from "axios";

const URL = ({ apiBaseUrl, token, showAlert }) => {
    const [newUrl, setNewUrl] = useState("");
    const [shortUrl, setShortUrl] = useState(null);

    const URL = async () => {
        try {
            const responce = await axios.post(
                `${apiBaseUrl}/api/me/urls`,
                { url: newUrl },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            showAlert("URL shortened successfully!", "success");
            setShortUrl(responce.data.short);
        } catch (error) {
            showAlert(
                "Error shortening URL: " + error.response?.data?.detail[0].msg,
                "error"
            );
        }
    };

    return (
        <div className="shorten-url">
            <h2>Enter your URL and press button to short it</h2>
            <input
                type="text"
                placeholder="Enter URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
            />
            <button className="short-btn" onClick={URL}>
                Short
            </button>
            {shortUrl && (
                <>
                    <br />
                    <p>
                        Your shortered URL:{" "}
                        <a
                            href={`${apiBaseUrl}/${shortUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {` ${apiBaseUrl}/${shortUrl}`}
                        </a>
                    </p>
                </>
            )}
        </div>
    );
};

export default URL;
