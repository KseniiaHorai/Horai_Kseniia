import { useState, useEffect } from "react";
import axios from "axios";
import Data from "./Data";

const ShortLinks = ({ apiBaseUrl, token, showAlert }) => {
    const [urls, setUrls] = useState([]);
    const [selectedShortUrl, setSelectedShortUrl] = useState(null);

    const handleStatsToggle = (shortUrl) => {
        setSelectedShortUrl(selectedShortUrl === shortUrl ? null : shortUrl);
    };

    const fetchUrls = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/me/urls`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUrls(response.data);
        } catch (error) {
            showAlert("Error fetching URLs: " + error.response?.data?.detail);
        }
    };

    useEffect(() => {
        fetchUrls();
        const interval = setInterval(fetchUrls, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="url-list">
            <h2>List of all your shortened URLs</h2>
            {urls.length === 0 ? (
                <p className="no-urls-text">
                    Here you can see a list of all the URLs you have shortened.
                </p>
            ) : (
                <ul>
                    {urls.map((url, index) => (
                        <li className="list-item" key={index}>
                            <div>
                                <a
                                    href={`${apiBaseUrl}/${url.short}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {`${apiBaseUrl}/${url.short}`}
                                </a>
                                {selectedShortUrl === url.short && (
                                    <Data
                                        apiBaseUrl={apiBaseUrl}
                                        token={token}
                                        shortUrl={url.short}
                                    />
                                )}
                            </div>
                            <button
                                className="stats-btn"
                                onClick={() => handleStatsToggle(url.short)}
                            >
                                {selectedShortUrl === url.short
                                    ? "Hide Stats"
                                    : "View Stats"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShortLinks;
