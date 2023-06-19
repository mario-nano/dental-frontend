import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Card, Spinner, Table} from "react-bootstrap";
import AppointmentServices from "../../services/appointment.services";

const PatientProfile = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.auth.userId);
  const firstname = useSelector((state) => state.auth.firstname);
  const lastname = useSelector((state) => state.auth.lastname);
  const email = useSelector((state) => state.auth.email);
  const patientDetails = useSelector((state) => state.auth.patientDetails);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    setTimeout(getAppointments,1500)
  }, []);

  const getAppointments = () => {
    AppointmentServices.getUserAppointments(userId)
        .then(appointments => {
          setAppointments(appointments.data);
          setLoading(false);
        }).catch(error => {
      console.log(error)
    })
  }

  return (
    <main className="about">
      <div className="pg-header">
        <div className="container">
          <h1>Profile</h1>
        </div>
      </div>
      <div className="container content">
        <div>
          <Card className={'mb-5'}>
            <Card.Header><h4>Your profile</h4></Card.Header>
            <Card.Body>
              <Card.Text>
                <div className={'row'}>
                  <div className={'col-2'}>Full name:</div>
                  <div className={'col-10'}>{firstname} {lastname}</div>
                </div>
                <div className={'row'}>
                  <div className={'col-2'}>Email:</div>
                  <div className={'col-10'}>{email}</div>
                </div>
                <div className={'row'}>
                  <div className={'col-2'}>Phone:</div>
                  <div className={'col-10'}>{patientDetails.phone}</div>
                </div>
                <div className={'row'}>
                  <div className={'col-2'}>Address:</div>
                  <div className={'col-10'}>{patientDetails.address}</div>
                </div>
                <div className={'row'}>
                  <div className={'col-2'}>City:</div>
                  <div className={'col-10'}>{patientDetails.city}</div>
                </div>
                <div className={'row'}>
                  <div className={'col-2'}>Postcode:</div>
                  <div className={'col-10'}>{patientDetails.postcode}</div>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
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
                          <th>Dental office</th>
                          <th>Doctor</th>
                          <th>Appointment details</th>
                        </thead>
                        { (appointments.length === 0) ?
                          <tr>
                            <td className={'text-center py-5 bg-light'} colSpan={5}>No appointments</td>
                          </tr> :
                            appointments.map((record, index) =>
                                <tr key={index} className={'py-3'}>
                                  <td>{index + 1}</td>
                                  <td>{record.dentalName}</td>
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
        </div>
      </div>
    </main>
  );
};

export default PatientProfile;
