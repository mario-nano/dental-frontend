import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Card, Spinner, Table} from "react-bootstrap";
import AppointmentServices from "../../services/appointment.services";
import {AppDispatch} from "../../redux/store";
import {setAuthParam} from "../../redux/authSlice";
import {setDentalParam} from "../../redux/dentalSlice";
import {incrementCount, setNotificationParam} from "../../redux/notificationSlice";
import * as Yup from "yup";
import {useFormik} from "formik";
import UserServices from "../../services/user.services";
import {Link} from "react-router-dom";
import clsx from "clsx";
import Button from "react-bootstrap/Button";

const DoctorProfile = () => {
  const dispatch : AppDispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const [loading, setLoading] = useState(true);
  const firstname = useSelector((state) => state.auth.firstname);
  const lastname = useSelector((state) => state.auth.lastname);
  const email = useSelector((state) => state.auth.email);
  const status = useSelector((state) => state.auth.status);
  const doctorDetails = useSelector((state) => state.auth.doctorDetails);
  const [appointments, setAppointments] = useState([]);
  const [currentDental, setCurrentDental] = useState('-1');
  const dentals = useSelector((state) => state.dental.dentals);

    useEffect(() => {
      getDoctorAppointments()
    }, [status]);

    const getDoctorAppointments = () => {
        AppointmentServices.getDoctorAppointments(userId)
            .then(appointments => {
              setAppointments(appointments.data);
              setLoading(false);
            }).catch(error => {
          console.log(error)
        })
    }

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

    const timeoutError = () => {
        dispatchNotificationDetail('toastType', 'error');
        dispatchNotificationDetail('toastMessage', 'Service timout! Please try again later.');
        dispatchNotificationDetail('toastCount', undefined);
    }

    const dispatchDentalParam = (fieldName, value) => {
        const payload = {
            fieldName: fieldName,
            value: value
        }
        dispatch(setDentalParam(payload));
    }

    const DoctorAppointments = () => {
    return(
        <Card>
          <Card.Header><h4>Your appointments</h4></Card.Header>
          <Card.Body>
            <Card.Text>
              {
                loading ?
                    <div className={"custom-select-div d-flex flex-column align-items-center"}>
                      <div className={'mt-5'}>
                        <Spinner className={'mt-auto mb-auto'} animation="border" role="status" variant='primary'>
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </div>
                      <div className={'mb-auto mt-3 mb-5'}>Loading...</div>
                    </div>
                    :
                    <Table striped bordered hover>
                      <thead>
                      <th>id</th>
                      <th>Patient name</th>
                      <th>Appointment details</th>
                      </thead>
                      { (appointments.length === 0) ?
                          <tr>
                            <td className={'text-center py-5 bg-light'} colSpan={5}>No appointments</td>
                          </tr> :
                          appointments.map((record, index) =>
                              <tr key={index} className={'py-3'}>
                                <td>{index + 1}</td>
                                <td>{record.patientName}</td>
                                <td>{record.timeSlot}</td>
                              </tr>
                          )
                      }
                    </Table>
              }
            </Card.Text>
          </Card.Body>
        </Card>
    )
  }

    const NewDoctorForm = () => {
        const initialValues = {
          dentalId: currentDental,
          lunch: '',
          fika: ''
        }

        const doctorSchema = Yup.object().shape({
            dentalId: Yup.string()
                .required('Please select dental clinic')
                .test('not default', 'Please select dental clinic', (value) => value !== '-1'),
            lunch: Yup.string()
                .required('Please select your lunch time.')
                .test('not default', 'Please select your lunch time.', (value) => value !== ''),
            fika: Yup.string()
                .required('Please select your fika break time.')
                .test('not default', 'Please select your fika break time.', (value) => value !== '')
                .when('lunch', {
                    is: value => value !== '',
                    then:
                        Yup.string().notOneOf([Yup.ref('lunch')], 'Lunchtime and fika time must be different')
                })
        });

        const formik = useFormik({
          initialValues,
          validationSchema: doctorSchema,
          onSubmit: async (values, {setStatus, setSubmitting}) => {
              setLoading(true);
              try {
                  let data = {
                      dentalId: values.dentalId,
                      lunch: values.lunch,
                      fika: values.fika
                  };

                  await UserServices.update(userId, data)
                      .then(response => {
                          dispatchAuthDetail('status', response.data.user.status);
                          dispatchAuthDetail('doctorDetails', response.data.user.doctorDetails);
                          dispatchNotificationDetail('toastType', 'success');
                          dispatchNotificationDetail('toastMessage', 'Profile update successful!');
                          dispatchNotificationDetail('toastCount', undefined);
                      })
                      .catch(e => {
                          setSubmitting(false);
                          setLoading(false);
                          if (e.response.status === 401) {
                              setStatus(e.response.data.message);
                          } else if (e.response.status === 404) {
                              setStatus(e.response.data.message);
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

        useEffect(() => {
            setCurrentDental(formik.values.dentalId)
        }, [formik.values])

        return(
            <div>
                <div className='col-lg-4 col-md-6 col-sm-9 col-xs-12 bg-white rounded shadow-lg px-5 py-3 mx-auto my-5'>
                    <form
                        className='form'
                        onSubmit={formik.handleSubmit}
                        id='login_form'
                    >
                        {/* begin::Heading */}
                        {formik.status && (
                            <div className='mb-1 alert alert-danger'>
                                <div className='d-flex alert-text font-weight-bold justify-content-center'>{formik.status}</div>
                            </div>
                        )}
                        <div className={'mt-3 mx-lg-10 mx-md-0'}>
                            {/* begin::Dental office selection field */}
                            <div className='row mb-3'>
                                <div className={'d-flex flex-column'}>
                                    <label className='form-label fs-6 fw-bolder'>Select your dental clinic</label>
                                    <select
                                        {...formik.getFieldProps("dentalId")}
                                        className={clsx(
                                            "form-select",
                                            {
                                                "is-invalid":
                                                    formik.touched.dentalId &&
                                                    formik.errors.dentalId,
                                            },
                                            {
                                                "is-valid":
                                                    formik.touched.dentalId &&
                                                    !formik.errors.dentalId,
                                            }
                                        )
                                    }
                                    >
                                        <option value={-1}> - Select- </option>
                                        {
                                            dentals.map((clinic, index) =>
                                                <option key={index} value={clinic.id}>{clinic.name}</option>
                                            )
                                        }
                                    </select>
                                    {formik.touched.dentalId &&
                                        formik.errors.dentalId && (
                                            <div className="fv-plugins-message-container">
                                                <div className="fv-help-block">
                                                  <span role="alert">
                                                    {formik.errors.dentalId}
                                                  </span>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                            {/* end::Dental office selection end */}
                            {/* begin::Lunchtime select field */}
                            <div className='fv-row mb-3'>
                                <div className={'mt-2 mb-2 text-center text-danger'}>** Choose lunch and fika break starts and finishes within clinic's opening hours **</div>
                                <div className={'d-flex flex-column'}>
                                    {/* begin::Label */}
                                    <label className='form-label fw-bolder text-dark fs-6 mb-0'>Lunch time (1 hour)</label>
                                    <select
                                        {...formik.getFieldProps("lunch")}
                                        className={clsx(
                                            "form-select",
                                            {
                                                "is-invalid":
                                                    formik.touched.lunch &&
                                                    formik.errors.lunch,
                                            },
                                            {
                                                "is-valid":
                                                    formik.touched.lunch &&
                                                    !formik.errors.lunch,
                                            }
                                        )}
                                    >
                                        <option value={-1}> - Select- </option>
                                        <option value={'00:00:00'}>00:00</option>
                                        <option value={'00:30:00'}>00:30</option>
                                        <option value={'01:00:00'}>01:00</option>
                                        <option value={'01:30:00'}>01:30</option>
                                        <option value={'02:00:00'}>02:00</option>
                                        <option value={'02:30:00'}>02:30</option>
                                        <option value={'03:00:00'}>03:00</option>
                                        <option value={'03:30:00'}>03:30</option>
                                        <option value={'04:00:00'}>04:00</option>
                                        <option value={'04:30:00'}>04:30</option>
                                        <option value={'05:00:00'}>05:00</option>
                                        <option value={'05:30:00'}>05:30</option>
                                        <option value={'06:00:00'}>06:00</option>
                                        <option value={'06:30:00'}>06:30</option>
                                        <option value={'07:00:00'}>07:00</option>
                                        <option value={'07:30:00'}>07:30</option>
                                        <option value={'08:00:00'}>08:00</option>
                                        <option value={'08:30:00'}>08:30</option>
                                        <option value={'09:00:00'}>09:00</option>
                                        <option value={'09:30:00'}>09:30</option>
                                        <option value={'10:00:00'}>10:00</option>
                                        <option value={'10:30:00'}>10:30</option>
                                        <option value={'11:00:00'}>11:00</option>
                                        <option value={'11:30:00'}>11:30</option>
                                        <option value={'12:00:00'}>12:00</option>
                                        <option value={'12:30:00'}>12:30</option>
                                        <option value={'13:00:00'}>13:00</option>
                                        <option value={'13:30:00'}>13:30</option>
                                        <option value={'14:00:00'}>14:00</option>
                                        <option value={'14:30:00'}>14:30</option>
                                        <option value={'15:00:00'}>15:00</option>
                                        <option value={'15:30:00'}>15:30</option>
                                        <option value={'16:00:00'}>16:00</option>
                                        <option value={'16:30:00'}>16:30</option>
                                        <option value={'17:00:00'}>17:00</option>
                                        <option value={'17:30:00'}>17:30</option>
                                        <option value={'18:00:00'}>18:00</option>
                                        <option value={'18:30:00'}>18:30</option>
                                        <option value={'19:00:00'}>19:00</option>
                                        <option value={'19:30:00'}>19:30</option>
                                        <option value={'20:00:00'}>20:00</option>
                                        <option value={'20:30:00'}>20:30</option>
                                        <option value={'21:00:00'}>21:00</option>
                                        <option value={'21:30:00'}>21:30</option>
                                        <option value={'22:00:00'}>22:00</option>
                                        <option value={'22:30:00'}>22:30</option>
                                        <option value={'23:00:00'}>23:00</option>
                                        <option value={'23:30:00'}>23:30</option>
                                    </select>
                                    {formik.touched.lunch &&
                                        formik.errors.lunch && (
                                            <div className="fv-plugins-message-container">
                                                <div className="fv-help-block">
                                                    <span role="alert">
                                                        {formik.errors.lunch}
                                                    </span>
                                                </div>
                                            </div>
                                    )}
                                </div>
                            </div>
                            {/* begin::Fika break select field */}
                            <div className='fv-row mb-3'>
                                <div className={'d-flex flex-column'}>
                                    {/* begin::Label */}
                                    <label className='form-label fw-bolder text-dark fs-6 mb-0'>Fika break time (30 minutes)</label>
                                    <select
                                        {...formik.getFieldProps("fika")}
                                        className={clsx(
                                            "form-select",
                                            {
                                                "is-invalid":
                                                    formik.touched.fika &&
                                                    formik.errors.fika,
                                            },
                                            {
                                                "is-valid":
                                                    formik.touched.fika &&
                                                    !formik.errors.fika,
                                            }
                                        )}
                                    >
                                        <option value={-1}> - Select- </option>
                                        <option value={'00:00:00'}>00:00</option>
                                        <option value={'00:30:00'}>00:30</option>
                                        <option value={'01:00:00'}>01:00</option>
                                        <option value={'01:30:00'}>01:30</option>
                                        <option value={'02:00:00'}>02:00</option>
                                        <option value={'02:30:00'}>02:30</option>
                                        <option value={'03:00:00'}>03:00</option>
                                        <option value={'03:30:00'}>03:30</option>
                                        <option value={'04:00:00'}>04:00</option>
                                        <option value={'04:30:00'}>04:30</option>
                                        <option value={'05:00:00'}>05:00</option>
                                        <option value={'05:30:00'}>05:30</option>
                                        <option value={'06:00:00'}>06:00</option>
                                        <option value={'06:30:00'}>06:30</option>
                                        <option value={'07:00:00'}>07:00</option>
                                        <option value={'07:30:00'}>07:30</option>
                                        <option value={'08:00:00'}>08:00</option>
                                        <option value={'08:30:00'}>08:30</option>
                                        <option value={'09:00:00'}>09:00</option>
                                        <option value={'09:30:00'}>09:30</option>
                                        <option value={'10:00:00'}>10:00</option>
                                        <option value={'10:30:00'}>10:30</option>
                                        <option value={'11:00:00'}>11:00</option>
                                        <option value={'11:30:00'}>11:30</option>
                                        <option value={'12:00:00'}>12:00</option>
                                        <option value={'12:30:00'}>12:30</option>
                                        <option value={'13:00:00'}>13:00</option>
                                        <option value={'13:30:00'}>13:30</option>
                                        <option value={'14:00:00'}>14:00</option>
                                        <option value={'14:30:00'}>14:30</option>
                                        <option value={'15:00:00'}>15:00</option>
                                        <option value={'15:30:00'}>15:30</option>
                                        <option value={'16:00:00'}>16:00</option>
                                        <option value={'16:30:00'}>16:30</option>
                                        <option value={'17:00:00'}>17:00</option>
                                        <option value={'17:30:00'}>17:30</option>
                                        <option value={'18:00:00'}>18:00</option>
                                        <option value={'18:30:00'}>18:30</option>
                                        <option value={'19:00:00'}>19:00</option>
                                        <option value={'19:30:00'}>19:30</option>
                                        <option value={'20:00:00'}>20:00</option>
                                        <option value={'20:30:00'}>20:30</option>
                                        <option value={'21:00:00'}>21:00</option>
                                        <option value={'21:30:00'}>21:30</option>
                                        <option value={'22:00:00'}>22:00</option>
                                        <option value={'22:30:00'}>22:30</option>
                                        <option value={'23:00:00'}>23:00</option>
                                        <option value={'23:30:00'}>23:30</option>
                                    </select>
                                    {formik.touched.fika &&
                                        formik.errors.fika && (
                                            <div className="fv-plugins-message-container">
                                                <div className="fv-help-block">
                                                    <span role="alert">
                                                        {formik.errors.fika}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                        {/* end::Lunchtime select field */}
                        {/* end::Form fields */}
                        {/* begin::Buttons */}
                        <div className='text-center mb-3'>
                            <Button
                                type='submit'
                                id='login_submit'
                                className='btn btn-primary px-4'
                                disabled={formik.isSubmitting || !formik.isValid}
                            >
                                {!loading && <span className='indicator-label'>Submit</span>}
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
                                    className='btn btn-outline-secondary ms-4 px-4'
                                >
                                    Cancel
                                </button>
                            </Link>
                        </div>
                        {/* end::Buttons */}
                    </form>
                </div>
            </div>
        )
    }

    const RenderCurrentDental = () => {
        let selectedDental = {
            name: 'No dental clinic found. Please reload app.',
            address: '-',
            city: '-',
            openinghours: {
                monday: {
                    open: '-',
                    close: '-'
                },
                tuesday: {
                    open: '-',
                    close: '-'
                },
                wednesday: {
                    open: '-',
                    close: '-'
                },
                thursday: {
                    open: '-',
                    close: '-'
                },
                friday: {
                    open: '-',
                    close: '-'
                }
            }
        };

        let filteredDental;
        if (status) {
            filteredDental = dentals.find(dental => dental.id === doctorDetails.dentalId);
        } else {
            filteredDental = dentals.find(dental => dental.id === currentDental);
        }

        if (filteredDental !== undefined)
            selectedDental = filteredDental;

        return(
            <Card>
                <Card.Header><h4>Clinic profile</h4></Card.Header>
                <Card.Body>
                    <Card.Title>{selectedDental.name}</Card.Title>
                    <Card.Text>
                        <div className={'row'}>
                            <div className={'col-3'}>Address:</div>
                            <div className={'col-9'}>{selectedDental.address}</div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-3'}>City:</div>
                            <div className={'col-9'}>{selectedDental.city}</div>
                        </div>
                        <div className={'row mt-1'}>
                            <div className={'col-3'}>Opening Hours:</div>
                            <div className={'col-9'}>
                                Monday: {selectedDental.openinghours.monday.open} - {selectedDental.openinghours.monday.close}<br />
                                Tuesday: {selectedDental.openinghours.tuesday.open} - {selectedDental.openinghours.tuesday.close}<br />
                                Wednesday: {selectedDental.openinghours.wednesday.open} - {selectedDental.openinghours.wednesday.close}<br />
                                Thursday: {selectedDental.openinghours.thursday.open} - {selectedDental.openinghours.thursday.close}<br />
                                Friday: {selectedDental.openinghours.friday.open} - {selectedDental.openinghours.friday.close}
                            </div>
                        </div>
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }

    return (
        <main className="about">
      <div className="pg-header">
        <div className="container">
          <h1>Doctor profile</h1>
        </div>
      </div>
      <div className="container content">
        <div>
            <div className={'row mb-4'}>
                <div className={'col-6'}>
                    <Card className={'h-100'}>
                    <Card.Header><h4>Your profile</h4></Card.Header>
                    <Card.Body>
                        <Card.Title>Dr. {firstname} {lastname}</Card.Title>
                        <Card.Text>
                            <div className={'row'}>
                                <div className={'col-2'}>Email:</div>
                                <div className={'col-10'}>{email}</div>
                            </div>
                            {
                                status ?
                                    <>
                                        <div className={'row'}>
                                            <div className={'col-2'}>Lunchtime:</div>
                                            <div className={'col-10'}>{doctorDetails.lunch}</div>
                                        </div>
                                        <div className={'row'}>
                                            <div className={'col-2'}>Fika break:</div>
                                            <div className={'col-10'}>{doctorDetails.fika}</div>
                                        </div>
                                    </> :
                                    <div className={'row text-danger mt-3'}>
                                        <div className={'col'}>
                                            Please complete your profile to continue.
                                        </div>
                                    </div>
                            }
                        </Card.Text>
                    </Card.Body>
                </Card>
                </div>
                <div className={'col-6'}>
                    {
                        (currentDental !== '-1' || status) ?
                        <RenderCurrentDental /> :
                        <Card>
                            <Card.Header><h4>Clinic profile</h4></Card.Header>
                            <Card.Body>
                                <Card.Title>Please select clinic</Card.Title>
                                <Card.Text>
                                    <div className={'row'}>
                                        <div className={'col-3'}>Address:</div>
                                        <div className={'col-9'}>-</div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={'col-3'}>City:</div>
                                        <div className={'col-9'}>-</div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={'col-3'}>Opening Hours:</div>
                                        <div className={'col-9'}>
                                            Monday: -<br />
                                            Tuesday: -<br />
                                            Wednesday: -<br />
                                            Thursday: -<br />
                                            Friday: -
                                    </div>
                                    </div>
                            </Card.Text>
                            </Card.Body>
                        </Card>
                    }
                </div>
            </div>
          {
            (status === true) ?
                <DoctorAppointments /> :
                <NewDoctorForm />
          }
        </div>
      </div>
    </main>
    );
};

export default DoctorProfile;
