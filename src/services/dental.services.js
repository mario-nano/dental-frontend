import http from "./api.config";
const serviceName = "dental-service";

class DentalServices {
  register(data) {
    return http.post(`/${serviceName}/dentals`, data);
  }

  getAll() {
    return http.get(`/${serviceName}/dentals`);
  }

  get(id) {
    return http.get(`/${serviceName}/dentals/${id}`);
  }

  getByOwnerId(id) {
    return http.get(`/${serviceName}/dentals/owner/${id}`);
  }

  getByDoctorId(id) {
    return http.get(`/${serviceName}/dentals/doctor/${id}`);
  }


  delete(id) {
    return http.delete(`/${serviceName}/dentals/${id}`);
  }
  deleteAll() {
    return http.delete(`/${serviceName}/dentals`);
  }
}
export default new DentalServices();
