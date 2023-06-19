import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {useDispatch} from "react-redux";
import {Spinner} from "react-bootstrap";
import {setAuthParam} from "../../redux/authSlice";
import {AppDispatch} from "../../redux/store";
import UserDataService from "../../services/user.services";
import {incrementCount, setNotificationParam} from "../../redux/notificationSlice";

export function Logout() {
    const dispatch : AppDispatch = useDispatch();
    const navigate = useNavigate();

    const dispatchAuthDetail = (fieldName, value) => {
        const payload = {
            fieldName: fieldName,
            value: value
        }
        dispatch(setAuthParam(payload));
    };

    const dispatchNotificationDetail = (fieldName, value) => {
        const payload = {
            fieldName: fieldName,
            value: value
        }
        if (fieldName === 'toastCount')
            dispatch(incrementCount())
        else
            dispatch(setNotificationParam(payload));
    }

    useEffect(() => {
            logoutUser();
        },
        []);

    const logoutUser = () => {
        const userRoles = []
        localStorage.removeItem("user");
        dispatchAuthDetail('isLogged', false);
        dispatchAuthDetail('username', undefined);
        dispatchAuthDetail('firstname', undefined);
        dispatchAuthDetail('lastname', undefined);
        dispatchAuthDetail('email', undefined);
        dispatchAuthDetail('roles', [...userRoles]);
        dispatchNotificationDetail('toastType', 'info');
        dispatchNotificationDetail('toastMessage', 'Successfully logged out!');
        dispatchNotificationDetail('toastCount', undefined);
        navigate('/');
    }

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <div className="d-flex flex-center flex-column flex-column-fluid p-12 pb-lg-15 pt-lg-15">
                <div className='w-lg-500px bg-white rounded shadow-lg p-4 p-lg-8 mx-auto'>
                    <div className='text-center'>
                        <div className={"custom-select-div d-flex flex-column align-items-center"}>
                            <div className={'mt-auto'}>
                                <Spinner className={'mt-auto mb-auto'} animation="border" role="status" variant='primary'>
                                    <span className="visually-hidden">Logging out...</span>
                                </Spinner>
                            </div>
                            <div className={'mb-auto mt-5'}>Logging out...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
