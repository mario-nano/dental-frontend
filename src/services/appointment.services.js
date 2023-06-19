import http from "./api.config";
const serviceName = "appointment-service";

class AppointmentServices {
  newAppointment(data) {
    return http.post(`/${serviceName}/appointments`, data);
  }

  getAll() {
    return http.get(`/${serviceName}/appointments`);
  }

  get(id) {
    return http.get(`/${serviceName}/appointments/${id}`);
  }

  getUserAppointments(id) {
    return http.get(`/${serviceName}/appointments/users/${id}`);
  }

  getDentalAppointments(id) {
    return http.get(`/${serviceName}/appointments/dentals/${id}`);
  }

  getDoctorAppointments(id) {
    return http.get(`/${serviceName}/appointments/doctors/${id}`);
  }

  delete(id) {
    return http.delete(`/${serviceName}/appointments/${id}`);
  }
}
export default new AppointmentServices();
