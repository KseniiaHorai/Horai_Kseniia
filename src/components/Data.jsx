import { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const Data = ({ apiBaseUrl, token, shortUrl, showAlert }) => {
    const [clickData, setClickData] = useState([]);
    const [grouping, setGrouping] = useState("day");

    const fetchClickData = async () => {
        try {
            const response = await axios.get(
                `${apiBaseUrl}/api/me/links/${shortUrl}/redirects`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setClickData(response.data);
        } catch (error) {
            showAlert(
                "Error fetching click data: " + error.response?.data?.detail,
                "error"
            );
        }
    };

    useEffect(() => {
        fetchClickData();
        const interval = setInterval(fetchClickData, 10000);
        return () => clearInterval(interval);
    }, [apiBaseUrl, token, shortUrl]);

    const processClickData = () => {
        const counts = {};

        clickData.forEach((timestamp) => {
            const dateObj = new Date(timestamp);
            console.log(dateObj.toUTCString());
            let key;

            switch (grouping) {
                case "minute":
                    key =
                        dateObj.toUTCString().slice(0, 11) +
                        dateObj.toUTCString().slice(16, 22);
                    break;
                case "hour":
                    key =
                        dateObj.toUTCString().slice(0, 11) +
                        dateObj.toUTCString().slice(16, 19);
                    break;
                case "day":
                default:
                    key = dateObj.toUTCString().slice(0, 11);
                    break;
            }

            counts[key] = (counts[key] || 0) + 1;
        });

        const sortedKeys = Object.keys(counts).sort();
        const labels = sortedKeys.map((key) => {
            switch (grouping) {
                case "minute":
                case "hour":
                    return key + ":00";
                default:
                    return key;
            }
        });
        const data = sortedKeys.map((key) => counts[key]);

        return { labels, data };
    };

    const { labels, data } = processClickData();

    return (
        <div className="click-stats">
            <div className="grouping-controls">
                <button
                    className={`grouping-btn ${
                        grouping === "day" ? "active" : ""
                    }`}
                    onClick={() => setGrouping("day")}
                >
                    By days
                </button>
                <button
                    className={`grouping-btn ${
                        grouping === "hour" ? "active" : ""
                    }`}
                    onClick={() => setGrouping("hour")}
                >
                    By hours
                </button>
                <button
                    className={`grouping-btn ${
                        grouping === "minute" ? "active" : ""
                    }`}
                    onClick={() => setGrouping("minute")}
                >
                    By minutes
                </button>
            </div>

            {clickData.length === 0 ? (
                <p>No click data available for this URL.</p>
            ) : (
                <Line
                    data={{
                        labels,
                        datasets: [
                            {
                                label: `Clicks per ${
                                    grouping === "day"
                                        ? "Day"
                                        : grouping === "hour"
                                        ? "Hour"
                                        : "Minute"
                                }`,
                                data,
                                borderColor: "rgba(75, 192, 192, 1)",
                                backgroundColor: "rgba(75, 192, 192, 0.2)",
                                tension: 0.4,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { display: true },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text:
                                        grouping === "minute"
                                            ? "Minute"
                                            : grouping === "hour"
                                            ? "Hour"
                                            : "Date",
                                },
                            },
                            y: { title: { display: true, text: "Clicks" } },
                        },
                    }}
                />
            )}
        </div>
    );
};

export default Data;
