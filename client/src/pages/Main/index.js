import { useEffect, useState, useRef } from "react";
import StarIcon from '@mui/icons-material/Star';
import LanguageIcon from '@mui/icons-material/Language';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import "./Main.scss";

const photos = [
    "https://seriouseats.com/thmb/e16lLOoVEix_JZTv7iNyAuWkPn8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2014__09__20140918-jamie-olivers-comfort-food-insanity-burger-david-loftus-f7d9042bdc2a468fbbd50b10d467dafd.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hamburger_%28black_bg%29.jpg/800px-Hamburger_%28black_bg%29.jpg",
    "https://www.bhg.com/thmb/QXGyadcA-06uFSeV5woRVtKlFik=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/quick-poutine-BBOQQT52qRM8_P2JsdQxXI-2336ec1ff4744ee89333a3da76fd7ae3.jpg"
];

const placesDetected = [
    "Mc",
    "Za"
];

const Main = () => {
    const [isOpen, setOpen] = useState(false);
    const sheet = useRef();
    const videoRef = useRef(null);
    const [tab, setTab] = useState(0);

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

                <div className="places-detected">
                    {placesDetected.map(placeDetected => (
                        <div className="place-detected">{placeDetected}</div>
                    ))}
                </div>

                <div className={`sheet ${isOpen && "open"}`}>
                    <div className="fit-padding">
                        <div onClick={() => setOpen(!isOpen)}>
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

                        <div className="info">
                            <LanguageIcon className="icon" />
                            <div className="text">mcdonalds.com</div>
                            
                        </div>
                        <div className="info">
                            <LocalPhoneIcon className="icon" />
                            <div className="text">514-697-2799</div>
                        </div>
                        <div className="info">
                            <QueryBuilderIcon className="icon" />
                            <div className="text">Closes 5 pm</div>
                        </div>
                        <div className="info">
                            <LocationOnIcon className="icon" />
                            <div className="text">17000 Trans-Canada Hwy, Kirkland, Quebec H9J 2M5, Canada</div>
                        </div>


                        <div className="tab-menu">
                            <div className="menu">
                                <div
                                    className={`item ${tab === 0 && "active"}`}
                                    onClick={() => setTab(0)}
                                >Photos</div>
                                <div
                                    className={`item ${tab === 1 && "active"}`}
                                    onClick={() => setTab(1)}
                                >About</div>
                            </div>
                        </div>

                    </div>

                    {tab === 0 && (<div className="photos">
                        {photos.map(photo => (
                            <img key={photo} src={photo} />
                        ))}
                    </div>)}

                    {tab === 1 && <div className="fit-padding">Classic, long-running fast-food chain known for its burgers & fries.</div>}
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