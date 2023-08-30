import { useCallback, useEffect, useState } from "react";
import "./App.css";
import "./Facts.css";
import { FactClientResponse, getRandomFact, getTodayFact } from "./FactsClient";

function Facts() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [shouldShowJson, setShouldShowJson] = useState<boolean>(false);
    const [fact, setFact] = useState<string>("");
    const [language, setLanguage] = useState<string>("en");
    const [rawResponse, setRawResponse] = useState<string>("");
    const [factUrl, setFactUrl] = useState<string>("https://uselessfacts.jsph.pl");

    const showLoading = () => {
        setIsLoading(true);
        const msg = "Loading...";
        setFact(msg);
        setRawResponse(msg);
    };

    const hideLoading = () => {
        setIsLoading(false);
    };

    const getFact = useCallback(() => {
        const f = async () => {
            showLoading();
            const response = await getRandomFact(language);
            handleResponse(response);
            hideLoading();
        };

        f();
    }, [language]);

    const handleResponse = (response: FactClientResponse | undefined) => {
        if (response == null) {
            return;
        }

        setRawResponse(JSON.stringify(response, null, 2));

        if (response.status === 429) {
            const time = new Date().toLocaleTimeString();
            setFact(`(${time}) Too many attempts! Try again later :)`);
            setFactUrl("");
            return;
        }

        if (response.json == null) {
            setFact("Ups, try again.");
            setFactUrl("");
            return;
        }

        setFact(response.json.text);
        setFactUrl(response.json.permalink);
    };

    const toggleDebugMode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShouldShowJson(e.target.checked);
    };

    useEffect(() => {
        const onMount = async () => {
            showLoading();
            const response = await getTodayFact("en");
            handleResponse(response);
            hideLoading();

            const cameraStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    facingMode: "environment",
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
            });

            let video = document.querySelector("video");
            if (video == null) {
                return;
            }

            video.srcObject = cameraStream;
        };

        onMount();
    }, []);

    useEffect(() => {
        getFact();
    }, [getFact]);

    return (
        <div className="Facts">
            <p>Video</p>
            <video autoPlay playsInline muted />
        </div>
    );
}

export default Facts;
