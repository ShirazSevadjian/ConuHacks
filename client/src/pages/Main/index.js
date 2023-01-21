import { useEffect, useRef } from "react";
import "./Main.scss";

const Main = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (!videoRef) return
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        });
    }, [videoRef]);

    useEffect(() => {
        
    }, []);

    return (
        <div className="main">
            <video
                width={window.innerWidth}
                height={window.innerHeight}
                ref={videoRef}
            />
        </div>
    );
};

export default Main;