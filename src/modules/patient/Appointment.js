import React, {useState, useEffect} from "react";
import {Col, Row} from "reactstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import Alert from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import {useDispatch, useSelector} from "react-redux";
import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import AppointmentServices from "../../services/appointment.services";
import {AppDispatch} from "../../redux/store";
import {incrementCount, setNotificationParam} from "../../redux/notificationSlice";
import UserServices from "../../services/user.services";
import clsx from "clsx";
import {setDentalParam} from "../../redux/dentalSlice";

const Appointment = () => {
  const dispatch : AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const isLogged = useSelector((state) => state.auth.userId);
  const roles = useSelector((state) => state.auth.roles);
  const userId = useSelector((state) => state.auth.userId);
  const firstname = useSelector((state) => state.auth.firstname);
  const lastname = useSelector((state) => state.auth.lastname);
  const mapSelected = useSelector((state) => state.dental.mapSelected);
  const dentalId = useSelector((state) => state.dental.dentalId);
  const dentalName = useSelector((state) => state.dental.name);
  const address = useSelector((state) => state.dental.address);
  const city = useSelector((state) => state.dental.city);
  const doctors = useSelector((state) => state.dental.doctors);
  const doctorDetails = useSelector((state) => state.dental.doctorDetails);
  const openinghours = useSelector((state) => state.dental.openinghours);
  const [clinicAppointments, setClinicAppointments] = useState([]);
  const [clinicBreaks, setClinicBreaks] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState();
  const [selectedDoctor, setSelectedDoctor] = useState(0);
  const [selectedDoctorName, setSelectedDoctorName] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('Message');
  const [modalContent, setModalContent] = useState('Requesting appointment...');
  const [newAppointment, setNewAppointment] = useState(0);
  let count = 0;

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
    let payload = {}

    if (fieldName === 'doctorDetails') {
      payload = {
        fieldName: fieldName,
        value: []
      }
      payload.value = [...value]
    } else {
      payload = {
        fieldName: fieldName,
        value: value
      }
    }
    dispatch(setDentalParam(payload));
  }

  const clinicClosedEvents = [
    { // this object will be "parsed" into an Event Object
      title: 'Clinic closed',
      daysOfWeek: [1],
      startTime: '00:00:00',
      endTime: (openinghours.monday.open).toString()+':00:00',
      startRecur: '2023-01-01',
      endRecur: '2024-12-25',
      groupId: '1',
      backgroundColor: '#EBECF0',
      borderColor: '#949494',
      textColor: '#808080'
    },
    { // this object will be "parsed" into an Event Object
      title: 'Clinic closed',
      daysOfWeek: [1],
      startTime: (openinghours.monday.close).toString()+':00:00',
      endTime: '24:00:00',
      startRecur: '2023-01-01',
      endRecur: '2024-12-25',
      groupId: '1',
      backgroundColor: '#EBECF0',
      borderColor: '#949494',
      textColor: '#808080'
    },
    { // this object will be "parsed" into an Event Object
      title: 'Clinic closed',
      daysOfWeek: [2],
      startTime: '00:00:00',
      endTime: (openinghours.tuesday.open).toString()+':00:00',
      startRecur: '2023-01-01',
      endRecur: '2024-12-25',
      groupId: '1',
      backgroundColor: '#EBECF0',
      borderColor: '#949494',
      textColor: '#808080'
    },
    { // this object will be "parsed" into an Event Object
      title: 'Clinic closed',
      daysOfWeek: [2],
      startTime: (openinghours.tuesday.close).toString()+':00:00',
      endTime: '24:00:00',
      startRecur: '2023-01-01',
      endRecur: '2024-12-25',
      groupId: '1',
      backgroundColor: '#EBECF0',
      borderColor: '#949494',
      textColor: '#808080'
    },
    { // this object will be "parsed" into an Event Object
      title: 'Clinic closed',
      daysOfWeek: [3],
      startTime: '00:00:00',
      endTime: (openinghours.wednesday.open).toString()+':00:00',
      startRecur: '2023-01-01',
      endRecur: '2024-12-25',
      groupId: '1',
      backgroundColor: '#EBECF0',
      borderColor: '#949494',
      textColor: '#808080'
    },
    { // this object will be "parsed" into an Event Object
      title: 'Clinic closed',
      daysOfWeek: [3],
      startTime: (openinghours.wednesday.close).toString()+':00:00',
      endTime: '24:00:00',
      startRecur: '2023-01-01',
      endRecur: '2024-12-25',
      groupId: '1',
      backgroundColor: '#EBECF0',
      borderColor: '#949494',
      textColor: '#808080'
    },
    { // this object will be "parsed" into an Event Object
      title: 'Clinic closed',
      daysOfWeek: [4],
      startTime: '00:00:00',
      endTime: (openinghours.thursday.open).toString()+':00:00',
      startRecur: '2023-01-01',
      endRecur: '2024-12-25',
      groupId: '1',
      backgroundColor: '#EBECF0',
      borderColor: '#949494',
      textColor: '#808080'
    },
    { // this object will be "parsed" into an Event Object
      title: 'Clinic closed',
      daysOfWeek: [4],
      startTime: (openinghours.thursday.close).toString()+':00:00',
      endTime: '24:00:00',
      startRecur: '2023-01-01',
      endRecur: '2024-12-25',
      groupId: '1',
      backgroundColor: '#EBECF0',
      borderColor: '#949494',
      textColor: '#808080'
    },
    { // this object will be "parsed" into an Event Object
      title: 'Clinic closed',
      daysOfWeek: [5],
      startTime: '00:00:00',
      endTime: (openinghours.friday.open).toString()+':00:00',
      startRecur: '2023-01-01',
      endRecur: '2024-12-25',
      groupId: '1',
      backgroundColor: '#EBECF0',
      borderColor: '#949494',
      textColor: '#808080'
    },
    { // this object will be "parsed" into an Event Object
      title: 'Clinic closed',
      daysOfWeek: [5],
      startTime: (openinghours.friday.close).toString()+':00:00',
      endTime: '24:00:00',
      startRecur: '2023-01-01',
      endRecur: '2024-12-25',
      groupId: '1',
      backgroundColor: '#EBECF0',
      borderColor: '#949494',
      textColor: '#808080'
    }
  ]

  useEffect( () => {
    if (mapSelected && dentalId !== undefined) {
      setIsLoading(true)
      let newClinicAppointments;
      AppointmentServices.getDentalAppointments(dentalId)
          .then(async response => {
            setIsLoading(false)
            let appointmentsArray = [];
            let breaksArray = [];
            await response.data.map(appointment => {
              let endTime;
              if (parseInt(appointment.timeSlot.slice(14,15)) === 0) {
                endTime = appointment.timeSlot.slice(0,13).toString() + ":30:00" +  appointment.timeSlot.slice(19,25)
              } else {
                endTime = appointment.timeSlot.slice(0,11) + (parseInt(appointment.timeSlot.slice(11, 13)) + 1).toString() + ":00:00" + appointment.timeSlot.slice(19,25)
              }
              let newEvent = {
                title: 'Booked',
                start: appointment.timeSlot,
                end: endTime,
                allDay: false
              }

              if (selectedDoctor === 0) {
                appointmentsArray.push(newEvent);
              } else if (selectedDoctor === parseInt(appointment.doctorId)) {
                appointmentsArray.push(newEvent);
              }
            })
            newClinicAppointments = clinicClosedEvents.concat(appointmentsArray)

            if (doctorDetails.length > 0) {
              doctorDetails.forEach(doctor => {
                let doctorLunch = {
                  title: 'Lunch',
                  daysOfWeek: [1, 2, 3, 4, 5],
                  startTime: (doctor.doctor_detail.lunch).toString() + ':00:00',
                  endTime: (parseInt(doctor.doctor_detail.lunch) + 1).toString() + ':00:00',
                  startRecur: '2023-01-01',
                  endRecur: '2024-12-25',
                  groupId: '1',
                  backgroundColor: '#ffd3bd',
                  borderColor: '#ffab84',
                  textColor: '#3b3b3b'
                }

                let fikaEndTime;
                if (doctor.doctor_detail.fika.slice(3, 4) === '0') {
                  fikaEndTime = doctor.doctor_detail.fika.slice(0, 2).toString() + ":30:00"
                } else {
                  fikaEndTime = (parseInt(doctor.doctor_detail.fika.slice(0, 2)) + 1).toString() + ":00:00"
                }

                let doctorFika = {
                  title: 'Unavailable',
                  daysOfWeek: [1, 2, 3, 4, 5],
                  startTime: (doctor.doctor_detail.fika).toString() + ':00:00',
                  endTime: fikaEndTime,
                  startRecur: '2023-01-01',
                  endRecur: '2024-12-25',
                  groupId: '1',
                  backgroundColor: '#dfffbd',
                  borderColor: '#729456',
                  textColor: '#3b3b3b'
                }

                if (selectedDoctor === 0) {
                  breaksArray.push(doctorLunch)
                  breaksArray.push(doctorFika)
                } else if (selectedDoctor === doctor.id) {
                  breaksArray.push(doctorLunch)
                  breaksArray.push(doctorFika)
                }
              })
            }

            let allEvents = newClinicAppointments.concat(breaksArray)
            setClinicAppointments(allEvents);

            await prepDoctorOptions();

          }).catch(error => {
            console.log(error);
          })
    }
  },[selectedDoctor, count])

  function prepDoctorOptions() {
    let options;
    console.log('Prepping options ...')
    options = doctorDetails.map((doctor, key) => {
      return (
          <option key={key} value={doctor.id}>{key+1}. {doctor.firstname} {doctor.lastname}</option>
      );
    });
    setDoctorOptions(options);
  }

  const renderDoctorsList = () => {
    return(
        <>
          {
            (doctors.length === 0) ?
                <div>
                  No doctors found
                </div> :
                <div>
                  <select
                      className={"form-select"}
                      name={selectedDoctor}
                      value={selectedDoctor}
                      onChange={e => handleDoctorSelect(e.target.value)}
                  >
                    <option value={0}>- Select here -</option>
                    {doctorOptions}
                  </select>
                </div>
          }
        </>
    )
  }

  const handleDoctorSelect = (id) => {
    setSelectedDoctor(parseInt(id));
    let doctor = doctorDetails.find((doctor) => doctor.id === parseInt(id));
    let doctorFullname = doctor.firstname + " " + doctor.lastname;
    setSelectedDoctorName(doctorFullname);
  }

  const CalendarSidebar = () => {
    return (
        <div className={'appointment-sidebar'}>
          <div className={'appointment-sidebar-section'}>
            <Card>
              <Card.Header><h4 className={'mt-2'}>Instructions</h4></Card.Header>
              <Card.Body>
                <Card.Text>
                  <div className={'d-flex flex-column'}>
                    <ol>
                      <li className={'pb-3'}>Select a doctor from the list below from Clinic profile.</li>
                      <li className={'pb-3'}>Select dates and click on a free timeslot to request an appointment.</li>
                      <li className={'pb-3'}>You need to register as 'Patient' and sign in for an appointment.</li>
                      <li>You can see your appointments and cancel from your profile or dashboard page.</li>
                    </ol>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className='appointment-sidebar-section'>
            <Card className={'mb-3'}>
              <Card.Header><h4 className={'mt-2'}>Selected clinic</h4></Card.Header>
              <Card.Body>
                <Card.Title>{dentalName}</Card.Title>
                <Card.Text>
                  <div className={'d-flex flex-column mb-3'}>
                    <div className={'col fw-bold'}>Select your doctor:</div>
                    <div className={'col'}>
                      {renderDoctorsList()}
                    </div>
                  </div>
                  <div className={'d-flex flex-column mb-3'}>
                    <div className={'col fw-bold'}>Address:</div>
                    <div className={'col'}>{address}</div>
                  </div>
                  <div className={'d-flex flex-column mb-3'}>
                    <div className={'col fw-bold'}>City:</div>
                    <div className={'col'}>{city}</div>
                  </div>
                  <div className={'d-flex flex-column mb-3'}>
                    <div className={'col fw-bold'}>Opening Hours:</div>
                    <div className={'col'}>
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
          </div>
        </div>
    )
  }

  const handleAppointmentSelect = (startDate) => {
    if (isLogged && roles.includes('ROLE_PATIENT')) {
      let requestedDate = new Date(startDate.startStr).valueOf();
      let nowDate = new Date().valueOf();

      if (selectedDoctor === 0) {
        setModalTitle('Warning');
        setModalContent('Please select a doctor from clinic list. Thank you.');
        setModalShow(true);
      } else if (nowDate > requestedDate) {
        setModalTitle('Warning');
        setModalContent('Sorry, this slot is already past. Please try another appointment slot. Thank you.');
        setModalShow(true);
      } else {
        Alert.fire({
          title: "Booking Confirmation",
          text: `Are you sure you want to book this slot? <br />` + startDate.startStr + " " + startDate.endStr,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Book",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.value) {
            let appointmentData = {
              userId: userId,
              patientName: `${firstname} ${lastname}`,
              dentalId: dentalId,
              dentalName: dentalName,
              doctorId: selectedDoctor,
              doctorName: selectedDoctorName,
              timeSlot: startDate.startStr
            }
            AppointmentServices.newAppointment(appointmentData)
                .then(response => {
                  console.log('Response: ' + response.status)
                  setModalTitle('Confirmation');
                  setModalContent(`Your appointment is confirmed. Please make note of the date and time.` +
                      `Please make sure to arrive at the Dental clinic 15 minutes before your appointment time. Thank you.`);
                  setModalShow(true);
                  setSelectedDoctor(0)
                })
                .catch(error => {
                  console.log('Error: ' + error.response.status)
                  if (error.response.status === 409) {
                    setModalTitle('Error');
                    setModalContent(`This appointment slot is already booked. ` +
                        `Please try a different time slot. Thank you.`);
                    setModalShow(true);
                  } else {
                    setModalTitle('Error');
                    setModalContent(`There was some error processing your request. ` +
                        `Please try again later. Thank you.`);
                    setModalShow(true);
                  }
                  setSelectedDoctor(0)
                })
            handleModalShow();
            // Send the booked slot data to the API
          }
        });
      }
    } else {
      setModalTitle('Warning');
      setModalContent('You need to register or login as Patient to book an appointment. Thank you.');
      setModalShow(true);
    }
  }

  const handleModalClose = (title) => {
    console.log('Here 44 ...' + title)
    let count = newAppointment+1;
    setNewAppointment(count);
    setModalShow(false);
    if (modalTitle === 'Confirmation') {
      console.log('Reloading ...')
      let count = newAppointment+1;
      setNewAppointment(count);
    }

  }

  const handleModalShow = () => setModalShow(true);

  return (
      <div className={'calendar-container'}>
        {
          mapSelected ?
            <>
              <CalendarSidebar />
              <div className={"appointment-main"} id="appointmentCalender">
                <FullCalendar
                    allDaySlot={false}
                    droppable={true}
                    events={clinicAppointments}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "timeGridWeek,timeGridDay",
                    }}
                    initialView="timeGridWeek"
                    locale={'en-GB'}
                    nowIndicator={true}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    rerenderDelay={10}
                    slotDuration="00:30:00"
                    selectable
                    selectOverlap={false}
                    select={(start, end) => handleAppointmentSelect(start)}
                    themeSystem={'bootstrap5'}
                    timeZone={'local'}
                    validRange={{
                      start: new Date().toISOString().replace(/T.*$/, ''),
                      end: '2024-12-25'
                    }}
                    weekends={false}
                    loading={function(isLoading) {
                      console.log('loading ...')
                    }}
                />
              </div>
            </>  :
            <div className={'d-flex justify-content-center m-auto'}>
              <div className={'w-75 my-5'}>
                <Card className={'mb-5'}>
                  <Card.Header><h4>Appointments</h4></Card.Header>
                  <Card.Body>
                    <div className={'row py-5'}>
                      <div className={'text-center'}>
                        <h4 className={'text-info'}>
                          Please search and select a dental clinic from the map to check current appointments and view available times.
                        </h4>
                      </div>
                    </div>
                    <div className={'row'}>
                      <div className={'mt-3 text-center'}>
                        <button className={'btn btn-primary'}>
                          <Link to="/map" className={'text-white'}>Go to the Map</Link>
                        </button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>

        }
        <Modal show={modalShow} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={'d-flex justify-content-center fs-5'}>
              {modalContent}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className={'text-center'} variant="secondary" onClick={() => handleModalClose(modalTitle)}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
}

export default Appointment;
