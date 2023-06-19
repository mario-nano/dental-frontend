import {useState} from 'react'
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../redux/store";
import {setAuthParam} from "../../redux/authSlice";
import {setNotificationParam, incrementCount} from "../../redux/notificationSlice";
import {useFormik} from 'formik'
import UserServices from '../../services/user.services';
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PasswordStrengthBar from 'react-password-strength-bar';
import Button from 'react-bootstrap/Button';

const initialValues = {
    firstname: '',
    lastname: '',
    username: '',
    role: '',
    email: '',
    address: '',
    city: '',
    phone: '',
    postcode: '',
    password: '',
    confirmPassword: ''
}

const registrationSchema = Yup.object().shape({
    firstname: Yup.string()
        .required('Please enter your firstname.')
        .min(3, 'You need to enter at least 3 characters.')
        .max(50, 'You can enter maximum of 50 characters.'),
    lastname: Yup.string()
        .required('Please enter your lastname.')
        .min(3, 'You need to enter at least 3 characters.')
        .max(50, 'You can enter maximum of 50 characters.'),
    username: Yup.string()
        .required('Please enter your username.')
        .min(6, 'You need to enter at least 6 characters.')
        .max(50, 'You can enter maximum of 50 characters.'),
    role: Yup.string()
        .required('Please enter your role.'),
    email: Yup.string()
        .required('Email address is required.')
        .email('Invalid email address. Please check.')
        .min(6, 'You need to enter at least 6 characters.')
        .max(50, 'You can enter maximum of 50 characters.'),
    address: Yup.string()
        .when('role', {
            is: 'patient',
            then:
                Yup.string()
                    .required('Your address is required.')
                    .min(6, 'You need to enter at least 6 characters.')
                    .max(50, 'You can enter maximum of 50 characters.')
        }),
    city: Yup.string()
        .when('role', {
            is: 'patient',
            then:
                Yup.string()
                    .required('City is required.')
                    .min(6, 'You need to enter at least 6 characters.')
                    .max(50, 'You can enter maximum of 50 characters.')
        }),
    phone: Yup.string()
        .when('role', {
            is: 'patient',
            then:
                Yup.string()
                    .required('Your phone number is required.')
                    .min(6, 'You need to enter at least 6 characters.')
                    .max(50, 'You can enter maximum of 50 characters.')
        }),
    postcode: Yup.string()
        .when('role', {
            is: 'patient',
            then:
                Yup.string()
                    .required('Postcode is required.')
                    .min(5, 'You need to enter exactly 5 numbers.')
                    .max(5, 'You can enter maximum of 5 numbers.')
        }),
    password: Yup.string()
        .required('Enter your password!')
        .min(6, 'You need to enter at least 6 characters.')
        .max(50, 'You can enter maximum of 50 characters.'),
    confirmPassword: Yup.string()
        .required('Please repeat your password!')
        .when('password', {
            is: (val: string) => (val && val.length > 0 ? true : false),
            then: Yup.string().oneOf([Yup.ref('password')], "Password and confirmation does not match."),
        })
})

export function Register() {
    const dispatch : AppDispatch = useDispatch();
    const [loading, setLoading] = useState(false);
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

    // const {saveAuth, setCurrentUser} = useAuth()
    const formik = useFormik({
        initialValues,
        validationSchema: registrationSchema,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setLoading(true);
            try {
                let data = {
                    firstname: values.firstname,
                    lastname: values.lastname,
                    username: values.username,
                    email: values.email,
                    password: values.password,
                    roles: [],
                    address: values.address,
                    city: values.city,
                    postcode: values.postcode,
                    phone: values.phone
                };
                data.roles.push(values.role);

                await UserServices.register(data)
                    .then(response => {
                        dispatchAuthDetail('email', data.email);
                        dispatchNotificationDetail('toastType', 'success');
                        dispatchNotificationDetail('toastMessage', 'User registered successfully!');
                        dispatchNotificationDetail('toastCount', undefined);
                        navigate('/login');
                    })
                    .catch(e => {
                        setSubmitting(false)
                        setLoading(false)
                        if (e.response.status === 400) {
                            console.log(JSON.stringify(e.response))
                            setStatus(e.response.data.message);
                        } else if (e.response.status === 429 || e.status === 429) {
                            setStatus('Too many requests. Please try again after 10 minutes.');
                        } else {
                            setStatus('System error. Please try later.');
                        }
                    })
            } catch (error) {
                // saveAuth(undefined)
                setStatus('The registration details is incorrect')
                setSubmitting(false)
                setLoading(false)
            }
        },
    })

    return (
        <div id={'master-layout'} className='page d-flex flex-row flex-column-fluid'>
            <div className='wrapper d-flex flex-column flex-row-fluid'>
                <div className="d-flex flex-column flex-column-fluid">
                    <div className="d-flex flex-center flex-column flex-column-fluid p-8 pb-lg-10 pt-lg-8">
                        <div className='col-lg-4 col-md-6 col-sm-9 col-xs-12 bg-white rounded shadow-lg px-5 py-3 mx-auto my-5'>
                            <form className='form row fv-plugins-bootstrap5 fv-plugins-framework'
                                  noValidate
                                  onSubmit={formik.handleSubmit}>
                                {/* begin::Heading */}
                                <div className='mb-3 text-center'>
                                    {/* begin::Title */}
                                    <h2 className='text-dark mb-3'>User registration</h2>
                                    {/* end::Title */}
                                    {/* begin::Link */}
                                    <div className='text-gray-400 fw-bold font-size-7'>
                                        Already user?
                                        <Link to='/login' className='link-primary fw-bold' style={{marginLeft: '5px'}}>
                                            Login
                                        </Link>
                                    </div>
                                    {/* end::Link */}
                                </div>
                                {/* begin::Status msg */}
                                {formik.status && (
                                    <div className='mb-lg-8 alert alert-danger'>
                                        <div className={'d-flex flex-row'}>
                                            <div className={'me-3'}><FontAwesomeIcon className={'fs-2'} icon={faExclamationCircle} /></div>
                                            <div className='alert-text font-weight-bold'>{formik.status}</div>
                                        </div>
                                    </div>
                                )}
                                {/* begin::Firstname */}
                                <div className='col-xl-6 mb-3'>
                                    <label className='form-label fw-bolder text-dark fs-6'>Firstname</label>
                                    <input
                                        placeholder='name'
                                        type='text'
                                        autoComplete='off'
                                        {...formik.getFieldProps('firstname')}
                                        className={clsx(
                                            'form-control',
                                            {
                                                'is-invalid': formik.touched.firstname && formik.errors.firstname,
                                            },
                                            {
                                                'is-valid': formik.touched.firstname && !formik.errors.firstname,
                                            }
                                        )}
                                    />
                                    {formik.touched.firstname && formik.errors.firstname && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert'>{formik.errors.firstname}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* begin::Lastname */}
                                <div className='col-xl-6 mb-3 pr-3'>
                                    <label className='form-label fw-bolder text-dark fs-6'>Lastname</label>
                                    <input
                                        placeholder='lastname'
                                        type='text'
                                        autoComplete='off'
                                        {...formik.getFieldProps('lastname')}
                                        className={clsx(
                                            'form-control',
                                            {
                                                'is-invalid': formik.touched.lastname && formik.errors.lastname,
                                            },
                                            {
                                                'is-valid': formik.touched.lastname && !formik.errors.lastname,
                                            }
                                        )}
                                    />
                                    {formik.touched.lastname && formik.errors.lastname && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert'>{formik.errors.lastname}</span>
                                            </div>
                                        </div>
                                    )}
                                    {/* end::Form group */}
                                </div>
                                {/* Username field */}
                                <div className='fv-row mb-3'>
                                    <label className='form-label fw-bolder text-dark fs-6'>Username</label>
                                    <input
                                        type='text'
                                        autoComplete='off'
                                        {...formik.getFieldProps('username')}
                                        className={clsx(
                                            'form-control',
                                            {'is-invalid': formik.touched.username && formik.errors.username},
                                            {
                                                'is-valid': formik.touched.username && !formik.errors.username,
                                            }
                                        )}
                                    />
                                    {formik.touched.username && formik.errors.username && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert'>{formik.errors.username}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Email field */}
                                <div className='fv-row mb-3'>
                                    <label className='form-label fw-bolder text-dark fs-6'>Email address</label>
                                    <input
                                        placeholder='email@domain.com'
                                        type='email'
                                        autoComplete='off'
                                        {...formik.getFieldProps('email')}
                                        className={clsx(
                                            'form-control',
                                            {'is-invalid': formik.touched.email && formik.errors.email},
                                            {
                                                'is-valid': formik.touched.email && !formik.errors.email,
                                            }
                                        )}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert'>{formik.errors.email}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Role field */}
                                <div className='fv-row mb-3'>
                                    <label className='form-label fw-bolder text-dark fs-6'>Role</label>
                                    <div role="group" aria-labelledby="user-roles">
                                        <label className={'ms-1 me-4'}>
                                            <input
                                                className={'me-1'}
                                                type="radio"
                                                name="role" value="patient"
                                                checked={formik.values.role === "patient"}
                                                onChange={(e) => formik.setFieldValue('role', e.target.value)}
                                            />
                                            Patient
                                        </label>
                                        <label className={'ms-1 me-4'}>
                                            <input
                                                type="radio"
                                                className={'me-1'}
                                                name="role" value="office"
                                                checked={formik.values.role === "office"}
                                                onChange={(e) => formik.setFieldValue('role', e.target.value)}
                                            />
                                            Dental office
                                        </label>
                                        <label className={'ms-1 me-4'}>
                                            <input
                                                type="radio"
                                                className={'me-1'}
                                                name="role" value="doctor"
                                                checked={formik.values.role === "doctor"}
                                                onChange={(e) => formik.setFieldValue('role', e.target.value)}
                                            />
                                            Doctor
                                        </label>
                                        {formik.touched.role && formik.errors.role && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert'>{formik.errors.role}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Address field */}
                                {
                                    (formik.values.role === 'patient') &&
                                        <>
                                            <div className='fv-row mb-3'>
                                                <label className='form-label fw-bolder text-dark fs-6'>Address</label>
                                                <input
                                                    type='text'
                                                    autoComplete='off'
                                                    {...formik.getFieldProps('address')}
                                                    className={clsx(
                                                        'form-control',
                                                        {'is-invalid': formik.touched.address && formik.errors.address},
                                                        {
                                                            'is-valid': formik.touched.address && !formik.errors.address,
                                                        }
                                                    )}
                                                />
                                                {formik.touched.address && formik.errors.address && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert'>{formik.errors.address}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className='col-xl-6 mb-3 pr-3'>
                                                <label className='form-label fw-bolder text-dark fs-6'>City</label>
                                                <input
                                                    type='text'
                                                    autoComplete='off'
                                                    {...formik.getFieldProps('city')}
                                                    className={clsx(
                                                        'form-control',
                                                        {'is-invalid': formik.touched.city && formik.errors.city},
                                                        {
                                                            'is-valid': formik.touched.city && !formik.errors.city,
                                                        }
                                                    )}
                                                />
                                                {formik.touched.city && formik.errors.city && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert'>{formik.errors.city}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className='col-xl-6 mb-3 pr-3'>
                                                <label className='form-label fw-bolder text-dark fs-6'>Postcode</label>
                                                <input
                                                    type='text'
                                                    placeholder='12345'
                                                    autoComplete='off'
                                                    {...formik.getFieldProps('postcode')}
                                                    className={clsx(
                                                        'form-control',
                                                        {'is-invalid': formik.touched.postcode && formik.errors.postcode},
                                                        {
                                                            'is-valid': formik.touched.postcode && !formik.errors.postcode,
                                                        }
                                                    )}
                                                />
                                                {formik.touched.postcode && formik.errors.postcode && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert'>{formik.errors.postcode}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className='fv-row mb-3'>
                                                <label className='form-label fw-bolder text-dark fs-6'>Phone number</label>
                                                <input
                                                    type='text'
                                                    placeholder={'+46 xx xxxx xxx'}
                                                    autoComplete='off'
                                                    {...formik.getFieldProps('phone')}
                                                    className={clsx(
                                                        'form-control',
                                                        {'is-invalid': formik.touched.phone && formik.errors.phone},
                                                        {
                                                            'is-valid': formik.touched.phone && !formik.errors.phone,
                                                        }
                                                    )}
                                                />
                                                {formik.touched.phone && formik.errors.phone && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert'>{formik.errors.phone}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                }
                                {/* Password field */}
                                <div className='fv-row' data-kt-password-meter='true'>
                                    <div className='mb-1'>
                                        <label className='form-label fw-bolder text-dark fs-6'>Password</label>
                                        <div className='position-relative mb-3'>
                                            <input
                                                type='password'
                                                placeholder='password...'
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
                                    <div className='text-muted'>
                                        <PasswordStrengthBar
                                            password={formik.values.password}
                                            scoreWords={['very weak', 'weak', 'neutral', 'good', 'very good']}
                                            barColors={['#ddd', '#c42222', '#f7961c', '#8fe593', '#006600']}
                                            minLength={6}
                                            shortScoreWord={' '}
                                            scoreWordClassName={'font-size-4 fw-bold'}
                                        />
                                    </div>
                                </div>
                                {/* Confirm password field */}
                                <div className='fv-row mb-8'>
                                    <label className='form-label fw-bolder text-dark fs-6'>Confirm password</label>
                                    <input
                                        type='password'
                                        placeholder='Confirm your password'
                                        autoComplete='off'
                                        {...formik.getFieldProps('confirmPassword')}
                                        className={clsx(
                                            'form-control',
                                            {
                                                'is-invalid': formik.touched.confirmPassword && formik.errors.confirmPassword,
                                            },
                                            {
                                                'is-valid': formik.touched.confirmPassword && !formik.errors.confirmPassword,
                                            }
                                        )}
                                    />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert'>{formik.errors.confirmPassword}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Submit buttons */}
                                <div className='text-center p-4'>
                                    <Button
                                        variant="primary"
                                        type='submit'
                                        id='sign_up_submit'
                                        className={'btn btn-primary px-5'}
                                        disabled={formik.isSubmitting || !formik.isValid} >
                                        {!loading && <span className='indicator-label'>Register</span>}
                                        {loading && (
                                            <span className='indicator-progress' style={{display: 'block'}}>
                                                Registering...{' '}
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
                                {/* end::Form group */}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
