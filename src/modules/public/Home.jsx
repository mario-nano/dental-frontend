import {useEffect} from "react";
import { useNavigate } from 'react-router-dom'
import DentalServices from "../../services/dental.services";
import {AppDispatch} from "../../redux/store";
import {useDispatch} from "react-redux";
import {setDentalParam} from "../../redux/dentalSlice";
const HomeCardOne = require("./home-00.jpg");
const HomeCardTwo = require("./home-01.jpg");
const HomeCardThree = require("./home-02.jpg");

const Home = () => {
    const dispatch : AppDispatch = useDispatch();
    const navigate = useNavigate();

    const dispatchDentalParam = (fieldName, value) => {
        const payload = {
            fieldName: fieldName,
            value: value
        }
        dispatch(setDentalParam(payload));
    }

    useEffect(() => {
        DentalServices.getAll()
            .then(response => {
                dispatchDentalParam('dentals', response.data)
            }).catch(error => {
                console.log(error);
        })
    },[])

  return (
    <div className={'container'}>
        <div className="row">
            <div className={'mt-4 mb-3'}>
                <h1>Welcome to Dentsemo system</h1>
            </div>
        </div>
        <div className="row">
            <div className="col-4">
                <div className={"card"}>
                    <img src={HomeCardOne} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">1. Register your account</h5>
                            <p className="card-text">"Register" by providing personal information (username, email, password) and follow the prompts to complete the account creation process. Log in with your account to access the website's features.</p>
                            <a href="#" className="btn btn-primary" onClick={() => navigate('/register')}>Register here...</a>
                        </div>
                </div>
            </div>
            <div className="col-4">
                <div className={"card"}>
                    <img src={HomeCardTwo} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">2. Find your dentist</h5>
                        <p className="card-text">The feature allows users to view a map of their location and see nearby clinics marked on it. The user can click on a clinic marker to see more information. This feature provides an easy way to help users locate and choose the appropriate clinic based on their needs.</p>
                        <a href="#" className="btn btn-primary" onClick={() => navigate('/map')}>Go to map...</a>
                    </div>
                </div>
            </div>
            <div className="col-4">
                <div className={"card"}>
                    <img src={HomeCardThree} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">3. Book your appointment</h5>
                        <p className="card-text">The "Book Appointment" feature enables users to schedule appointments with a clinic by selecting a date and time from an online calendar. Users can view available slots and book their appointment with ease, and get a confirmation for the scheduled time. This feature helps users to plan and schedule their appointments more efficiently.</p>
                        <a href="#" className="btn btn-primary" onClick={() => navigate('/appointment')}>View appointments...</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Home;
