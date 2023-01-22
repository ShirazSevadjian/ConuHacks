import { useEffect, useState, useRef } from "react";
import StarIcon from '@mui/icons-material/Star';
import LanguageIcon from '@mui/icons-material/Language';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import stringSimilarity from "string-similarity";
import icon from "../../icon-w-text.svg";

import "./Main.scss";

function randomIntFromInterval(min, max) { // min and max included 
    return Math.random() * (max - min + 1) + min
  }

const Main = () => {
    const [isOpen, setOpen] = useState(false);
    const videoRef = useRef(null);
    const [tab, setTab] = useState(0);
    const [detections, setDetections] = useState([]);
    const [currentPlace, setCurrentPlace] = useState(null);
    const [welcome, setWelcome] = useState(true);

    useEffect(() => {
        if (!videoRef) return
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(stream => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        });
    }, [videoRef]);

    useEffect(() => {
        axios({
            method: "get",
            url: "https://api.geoapify.com/v2/places?categories=catering,commercial,accommodation,education,childcare,entertainment,healthcare,rental,service,amenity,ski,activity&filter=circle:-73.57769911783691,45.495842959494865,300&bias=proximity:-73.57769911783691,45.495842959494865&limit=500&apiKey=6c7cdd89d74a4aa0936ed60483946fe6"
        })
        .then(res => {
            setInterval(() => {
                googleCloutFunc(res.data.features);
            }, 2000);
        });
    }, []);

    const findMatches = (wordsFound, nearbyPlaces) => {
        wordsFound = wordsFound ? wordsFound.map(word => word.toLowerCase()) : "";

        for (let i = 0; i < wordsFound.length; i++) {
            for (let j = 0; j < nearbyPlaces.length; j++) {
                const wordFound = wordsFound[i];
                const nearbyPlace = nearbyPlaces[j].properties.name ? nearbyPlaces[j].properties.name.toLowerCase() : "00000000000000";

                if (stringSimilarity.compareTwoStrings(wordFound, nearbyPlace) >= 0.7) {
                    const newDetection = {
                        ...nearbyPlaces[j],
                        rating: randomIntFromInterval(3,4).toFixed(2),
                        website: nearbyPlace.replace(/\s/g, '').toLowerCase(),
                        number: "514-" + (Math.floor(Math.random() * 10) + 1).toString() + (Math.floor(Math.random() * 10) + 1).toString() + (Math.floor(Math.random() * 10) + 1).toString() + "-" + (Math.floor(Math.random() * 10) + 1).toString() + (Math.floor(Math.random() * 10) + 1).toString() +(Math.floor(Math.random() * 10) + 1).toString() +(Math.floor(Math.random() * 10) + 1).toString(),
                    };
                    setDetections(detections => {
                        if (detections.length === 0) {
                            setCurrentPlace(newDetection)
                        }
                        return (detections.find(detection => detection.properties.place_id === nearbyPlaces[j].properties.place_id) ? detections : [newDetection, ...detections]
                        );
                });
                    break;
                }
            }
        }
    };

    const googleCloutFunc = async (places) => {
        // Convert current frame to image
        let player = document.getElementById('webcam');
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = player.videoWidth;
        canvas.height = player.videoHeight;
        ctx.drawImage(player, 0, 0);
        let imgdata = ctx.getImageData(0,0, canvas.width, canvas.height);
        let len = imgdata.data.length;
        for(let i=0; i<len; i=i+4){
            let red = imgdata.data[i];
            let green = imgdata.data[i+1];
            let blue = imgdata.data[i+2];
            let lum = (red + green + blue)/3;
            imgdata.data[i] = lum;
            imgdata.data[i+1] = lum;
            imgdata.data[i+2] = lum;
        }
        ctx.putImageData(imgdata, 0, 0);
        canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob); 
            reader.onloadend = function() {
                const base64data = reader.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                axios({
                    method: 'post',
                    url: 'https://vision.googleapis.com/v1/images:annotate',
                    headers: {
                        'Authorization': 'Bearer ya29.a0AX9GBdXkydzE9W7sMzyaKEsWKEdJlAI6-Mu7FVnmaVYjBlGoaZqupNon4QCuZlolFaF491gDM67nLuFlCEuF5cQ6ouTWMDAdzpxYGDKKcKMZI7gXRySbhC0OmqicamGUZSy-o_ngNHr8UEFBzNPSXgwvqtiPQz1HW0nrZpGoUFz7D50iLxGb7q56EAHQAombVjXVyHi-RJwuY_nDTEY68Tr2giDsodjXqBz1WB8aCgYKAesSARESFQHUCsbCqYdW7A0xyGaPPevEt_aMzw0238',
                        'x-goog-user-project': 'august-balancer-375502',
                        'Content-Type': 'application/json; charset= utf-8'
                    },
                    data: {
                        requests: [
                            {
                            image: {
                                content: base64data
                            },
                            features: [
                                {
                                type: "TEXT_DETECTION"
                                }
                            ]
                            }
                        ]
                    }                  
                }).then(res => {
                    const potentialMatches = res.data.responses[0].fullTextAnnotation ? res.data.responses[0].fullTextAnnotation.text.split("\n") : "";
                    findMatches(potentialMatches, places);
                });
            }
        }, 'image/png'); //create binary png from canvas contents
    };

    return (
        <div className="main">
            <div className="display">

                <img src={icon} className="main-icon" />

                {welcome && <div className="welcome-modal">
                    <div className="modal">
                        <div className="intro-text">Welcome to</div>
                        <div className="intro-title">NearbyNow!</div>

                        <ol>
                            <li className="sentence-1">Point your phone at a nearby store or restaurant.</li>
                            <li className="sentence-2">Click on the top right icon for the business you wish to view.</li>
                            <li className="sentence-3">Scroll up for more info.</li>
                        </ol>
                        <div className="get-started" onClick={() => setWelcome(false)}>Get Started</div>
                    </div>
                </div>}

                <div className="places-detected">
                    {detections.map((detection, idx) => (idx < 5) && (
                        <div
                            key={detection.properties.place_id}
                            className="place-detected"
                            onClick={() => {
                                setCurrentPlace(detection)
                            }}
                        >{detection.properties.name}</div>
                    ))}
                </div>

                {!welcome && currentPlace && <div className={`sheet ${isOpen ? "open" : ""}`}>
                    <div className="fit-padding">
                        <div onClick={() => setOpen(!isOpen)}>
                            <div className="handle">
                                <div className="knob" />
                            </div>

                            <div className="title-row">
                                <div className="title">{currentPlace && (currentPlace.properties.name ? currentPlace.properties.name : "")}</div>
                                <div className="rating">
                                    <div className="score">{currentPlace && currentPlace.rating}</div>
                                    <StarIcon className="star-icon" />
                                </div>
                            </div>

                            <div className="description-row">
                                <div className="place-type">
                                    <div className="type">{"Store"}</div>
                                    <div className="cost"> . $$</div>
                                </div>
                                <div className="place-status">Open</div>
                            </div>
                        </div>

                        <div className="info">
                            <LanguageIcon className="icon" />
                            <div className="text">{currentPlace && currentPlace.website}.ca</div>
                            
                        </div>
                        <a className="info" href={`tel:+1${currentPlace && currentPlace.number}`}>
                            <LocalPhoneIcon className="icon" />
                            <div className="text">{currentPlace && currentPlace.number}</div>
                        </a>
                        <div className="info">
                            <QueryBuilderIcon className="icon" />
                            <div className="text">Closes 5 pm</div>
                        </div>
                        <div className="info">
                            <LocationOnIcon className="icon" />
                            <div className="text">{currentPlace && (currentPlace.properties.address_line2 ? currentPlace.properties.address_line2 : "")}</div>
                        </div>

                    </div>

                    {tab === 1 && <div className="fit-padding">Classic, long-running fast-food chain known for its burgers & fries.</div>}
                </div>}
                {!welcome && !currentPlace && (
                    <div className="initial-sheet">Scan your surroundings to discover the wonderful places around you.</div>
                )}
            </div>

            <video
                id="webcam"
                autoPlay={true}
                playsInline={true}
                muted={true}                
                width={window.innerWidth}
                height={window.innerHeight}
                ref={videoRef}
            />
            <canvas style={{ display: "none" }} id="canvas"></canvas>
        </div>
    );
};

export default Main;