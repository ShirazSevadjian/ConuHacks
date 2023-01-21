import { useEffect, useState, useRef } from "react";
import StarIcon from '@mui/icons-material/Star';

import "./Main.scss";

const Main = () => {
    const [isOpen, setOpen] = useState(true);
    const sheet = useRef();
    const videoRef = useRef(null);

    useEffect(() => {
        if (!videoRef) return
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        });
    }, [videoRef]);

    return (
        <div className="main">
            <div className="display">
                <div className="sheet">
                    <div className="handle">
                        <div className="knob" />
                    </div>
                    <div className="title-row">
                        <div className="title">McDonald's</div>
                        <div className="rating">
                            <div className="score">4.5</div>
                            <StarIcon className="star-icon" />
                        </div>
                    </div>
                    <div className="description-row">
                        <div className="place-type">
                            <div className="type">Restaurant</div>
                            <div className="cost"> . $$</div>
                        </div>
                        <div className="place-status">Open</div>
                    </div>
                </div>
            </div>

            <video
                width={window.innerWidth}
                height={window.innerHeight}
                ref={videoRef}
            />
        </div>
    );
};

export default Main;