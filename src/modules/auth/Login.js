import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import {useFormik} from 'formik'
import UserServices from "../../services/user.services";
import {AppDispatch} from "../../redux/store";
import {useDispatch} from "react-redux";
import {setAuthParam} from "../../redux/authSlice";
import {setNotificationParam, incrementCount} from "../../redux/notificationSlice";
import Button from "react-bootstrap/Button";
import http from "../../services/api.config";

const loginSchema = Yup.object().shape({
    username: Yup.string()
        .required('Please enter your username!')
        .min(6, 'You need to enter at least 6 characters.')
        .max(50, 'You can enter maximum of 50 characters.'),
    password: Yup.string()
        .required('Please enter your password!')
        .min(8, 'You need to enter at least 6 characters.')
        .max(50, 'You can enter maximum of 50 characters.')
})

const initialValues = {
    username: '',
    password: '',
}

export function Login() {
    const dispatch : AppDispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const dispatchAuthDetail = (fieldName, value) => {
        const payload = {
            fieldName: fieldName,
            value: value
        }
        dispatch(setAuthParam(payload));
    }

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

    const formik = useFormik({
        initialValues,
        validationSchema: loginSchema,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setLoading(true);
            try {
                let data = {
                    username: values.username,
                    password: values.password
                };

                await http.post(`/auth-service/login`, data)
                    .then(response => {
                        if (response === null || response === undefined) {
                            console.log('Empty res')
                        }

                        dispatchAuthDetail('isLogged', true);
                        dispatchAuthDetail('userId', response.data.id);
                        dispatchAuthDetail('username', response.data.username);
                        dispatchAuthDetail('firstname', response.data.firstname);
                        dispatchAuthDetail('lastname', response.data.lastname);
                        dispatchAuthDetail('email', response.data.email);
                        dispatchAuthDetail('roles', response.data.roles);
                        dispatchAuthDetail('status', response.data.status);
                        if (response.data.roles.includes('ROLE_ADMIN')) {
                            navigate('/dashboard');
                        } else if (response.data.roles.includes('ROLE_OFFICE')) {
                            navigate('/dental');
                        } else if (response.data.roles.includes('ROLE_DOCTOR')) {
                            dispatchAuthDetail('doctorDetails', response.data.doctorDetails);
                            navigate('/doctor');
                        }
                        else if (response.data.roles.includes('ROLE_PATIENT')) {
                            dispatchAuthDetail('patientDetails', response.data.patientDetails);
                            navigate('/profile');
                        }
                        dispatchNotificationDetail('toastType', 'success');
                        dispatchNotificationDetail('toastMessage', 'Login successful!');
                        dispatchNotificationDetail('toastCount', undefined);

                    })
                    .catch(e => {
                        console.log('Error on login: ' + JSON.stringify(e))
                        setSubmitting(false);
                        setLoading(false);
                        if (e.response.status === 401) {
                            setStatus(e.response.data.message);
                        } else if (e.response.status === 404) {
                            setStatus(e.response.data.message);
                        } else if (e.response.status === 429 || e.status === 429) {
                            setStatus('Too many requests. Please try again after 10 minutes.');
                        } else if (e.response.status === 500) {
                            setStatus('Server error. Please try later.');
                        } else if (e.response.status === 503) {
                            setStatus('Microservice timeout. Please try later.');
                        } else {
                            setStatus('System error. Please try later.');
                        }
                    });
            } catch (error) {
                // saveAuth(undefined)
                console.log('Error on login: ' + JSON.stringify(error))
                if (error.response.data.message.includes("timeout")) {
                    setStatus('Microservice timeout. Please try later.');
                } else {
                    setStatus('Invalid login info.')
                }
                setSubmitting(false)
                setLoading(false)
            }
        },
    })

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <div className="d-flex flex-center flex-column flex-column-fluid p-12 pb-lg-15 pt-lg-15">
                <div className='col-lg-4 col-md-6 col-sm-9 col-xs-12 bg-white rounded shadow-lg px-5 py-3 mx-auto my-5'>
                    <form
                        className='form'
                        onSubmit={formik.handleSubmit}
                        noValidate
                        id='login_form'
                    >
                        {/* begin::Heading */}
                        <div className='text-center mb-8'>
                            <h2 className='text-dark mb-3'>Login</h2>
                            <div className='text-gray-600 fw-bold font-size-7'>
                                New user?{' '}
                                <Link to='/register' className='link-primary fw-bold'>
                                    Register
                                </Link>
                            </div>
                        </div>
                        {/* begin::Heading */}
                        {formik.status ? (
                            <div className='mb-1 alert alert-danger'>
                                <div className='d-flex alert-text font-weight-bold justify-content-center'>{formik.status}</div>
                            </div>
                        ) : (
                            <div className='mb-1 bg-primary-lighter p-4 rounded'>
                                <div className='d-flex text-primary-dark justify-content-center'>
                                    Welcome to Dentsemo!
                                </div>
                            </div>
                        )}
                        <div className={'mx-lg-10 mx-md-0'}>
                            {/* begin::Username field */}
                            <div className='row mb-3'>
                                <div className={'d-flex flex-column'}>
                                    <label className='form-label fs-6 fw-bolder'>Username</label>
                                    <input
                                        {...formik.getFieldProps('username')}
                                        className={clsx(
                                            'form-control',
                                            {'is-invalid': formik.touched.username && formik.errors.username},
                                            {
                                                'is-valid': formik.touched.username && !formik.errors.username,
                                            }
                                        )}
                                        type='text'
                                        name='username'
                                    />
                                    {formik.touched.username && formik.errors.username && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert'>{formik.errors.username}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* end::Username */}
                            {/* begin::Password field */}
                            <div className='fv-row mb-3'>
                                <div className='d-flex justify-content-between'>
                                    <div className='d-flex flex-stack mb-2'>
                                        {/* begin::Label */}
                                        <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
                                        {/* end::Label */}
                                    </div>
                                </div>
                                <input
                                    type='password'
                                    autoComplete='off'
                                    {...formik.getFieldProps('password')}
                                    className={clsx(
                                        'form-control',
                                        {
                                            'is-invalid': formik.touched.password && formik.errors.password,
                                        },
                                        {
                                            'is-valid': formik.touched.password && !formik.errors.password,
                                        }
                                    )}
                                />

                                {formik.touched.password && formik.errors.password && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.password}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* end::Form group */}
                        {/* begin::Buttons */}
                        <div className='text-center p-4'>
                            <Button
                                type='submit'
                                id='login_submit'
                                className='btn btn-primary px-5'
                                disabled={formik.isSubmitting || !formik.isValid}
                            >
                                {!loading && <span className='indicator-label'>Login</span>}
                                {loading && (
                                    <span className='indicator-progress' style={{display: 'block'}}>
                                        Verifying...{' '}
                                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span>
                                )}
                            </Button>
                            <Link to='/'>
                                <button
                                    type='button'
                                    className='btn btn-outline-secondary ms-4 px-5'
                                >
                                    Cancel
                                </button>
                            </Link>
                        </div>
                        {/* end::Buttons */}
                    </form>
                </div>
            </div>
        </div>
    )
}
