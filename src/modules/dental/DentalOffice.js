import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Card, Spinner, Table} from "react-bootstrap";
import AppointmentServices from "../../services/appointment.services";
import DentalServices from "../../services/dental.services";
import {AppDispatch} from "../../redux/store";
import {setDentalParam} from "../../redux/dentalSlice";
import {incrementCount, setNotificationParam} from "../../redux/notificationSlice";
import NewDental from "./NewDental";

const DentalOffice = () => {
  const dispatch : AppDispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const [loading, setLoading] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const firstname = useSelector((state) => state.auth.firstname);
  const lastname = useSelector((state) => state.auth.lastname);
  const email = useSelector((state) => state.auth.email);
  const isDentalFound = useSelector((state) => state.dental.isDentalFound);
  const [dental, setDental] = useState();
  const [appointments, setAppointments] = useState([]);

  const dentalName = useSelector((state) => state.dental.name);
  const address = useSelector((state) => state.dental.address);
  const city = useSelector((state) => state.dental.city);
  const openinghours = useSelector((state) => state.dental.openinghours);

  useEffect(() => {
    getDentalOffice().then(r => console.log('Dental office loaded...'));
  }, []);

  const getDentalOffice = async () => {
    DentalServices.getByOwnerId(userId)
        .then(async dental => {
          setDental(dental.data);
          dispatchDentalParam('isDentalFound', true);
          dispatchDentalParam('dentalId', dental.data.id)
          dispatchDentalParam('name', dental.data.name)
          dispatchDentalParam('owner', dental.data.owner)
          dispatchDentalParam('ownerId', dental.data.ownerId)
          dispatchDentalParam('doctors', dental.data.doctors)
          dispatchDentalParam('address', dental.data.address)
          dispatchDentalParam('city', dental.data.city)
          dispatchDentalParam('coordinate', dental.data.coordinate)
          dispatchDentalParam('openinghours', dental.data.openinghours)
            setLoading(false);
          setLoadingAppointments(true)
          await getDentalAppointments(dental.data.id)
              .then(appointments => {
                console.log(appointments)
              }).catch(err => {
                  console.log(err)
              })
        })
        .catch(error => {
          setLoading(false);
          if (error.response === undefined || error.response.status === undefined) {
            console.log('error: ' + error)
          } else if (error.response.status === 404) {
            dispatchDentalParam('isDentalFound', false);
            console.log(error)
          }
        })
  }

  const getDentalAppointments = (id) => {
    AppointmentServices.getDentalAppointments(id)
        .then(appointments => {
          setLoadingAppointments(false)
          setAppointments(appointments.data);
        }).catch(error => {
            setLoadingAppointments(false)
            console.log(error)
        })
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

  const dispatchDentalParam = (fieldName, value) => {
    const payload = {
      fieldName: fieldName,
      value: value
    }
    dispatch(setDentalParam(payload));
  }

  const DentalAppointments = () => {
    return(
        <Card>
          <Card.Header><h4>Your appointments</h4></Card.Header>
          <Card.Body>
            <Card.Text>
              {
                  loadingAppointments ?
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
                      <th>Doctor's name</th>
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
                                <td>{record.doctorName}</td>
                                <td>{record.timeSlot}</td>
                                <td>{record.confirmed}</td>
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

  return (
    <main className="about">
      <div className="pg-header">
        <div className="container">
          <h1>Dental office</h1>
        </div>
      </div>
      <div className="container content">
        <div>
            <div className={'row mb-4'}>
                <div className={'col-6'}>
                    <Card className={'h-100'}>
                    <Card.Header><h4>Your clinic</h4></Card.Header>
                    <Card.Body>
                        <Card.Title>Special title treatment</Card.Title>
                        <Card.Text>
                            <div className={'row'}>
                                <div className={'col-2'}>Full name:</div>
                                <div className={'col-10'}>{firstname} {lastname}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col-2'}>Email:</div>
                                <div className={'col-10'}>{email}</div>
                            </div>
                        </Card.Text>
                    </Card.Body>
                </Card>
                </div>
                <div className={'col-6'}>
                    {
                        isDentalFound &&
                        <Card>
                            <Card.Header><h4>Clinic profile</h4></Card.Header>
                            <Card.Body>
                                <Card.Title>{dentalName}</Card.Title>
                                <Card.Text>
                                    <div className={'row'}>
                                        <div className={'col-2'}>Address:</div>
                                        <div className={'col-10'}>{address}</div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={'col-2'}>City:</div>
                                        <div className={'col-10'}>{city}</div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={'col-2'}>Opening Hours:</div>
                                        <div className={'col-10'}>
                                            Monday: {openinghours.monday.open} - {openinghours.monday.close}<br />
                                            Tuesday: {openinghours.tuesday.open} - {openinghours.tuesday.close}<br />
                                            Wednesday: {openinghours.wednesday.open} - {openinghours.wednesday.close}<br />
                                            Thursday: {openinghours.thursday.open} - {openinghours.thursday.close}<br />
                                            Friday: {openinghours.friday.open} - {openinghours.friday.close}
                                        </div>
                                    </div>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    }
                </div>
            </div>
          {
            loading &&
                'Loading'
          }
          {
              (!loading && isDentalFound === true) && <DentalAppointments />
          }
          {
              (!loading && isDentalFound === false) && <NewDental />
          }
          {
              (!loading && isDentalFound === undefined) && <>Service down</>
          }
        </div>
      </div>
    </main>
  );
};

export default DentalOffice;
