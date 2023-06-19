import http from "./api.config";
const serviceName = 'auth-service';

class UserServices {
    register(data) {
        return http.post(`/${serviceName}/register`, data);
    }

    login(data) {
        return http.post(`/${serviceName}/login`, data);
    }

    logout(data) {
        return http.post(`/${serviceName}/logout`, data);
    }

    getAll() {
        return http.get(`/${serviceName}/users`);
    }

    get(id) {
        return http.get(`/${serviceName}/users/${id}`);
    }

    update(id, data) {
        return http.put(`/${serviceName}/users/${id}`, data);
    }

    findDoctors(data) {
        return http.post(`/${serviceName}/doctors`, data);
    }

    delete(id) {
        return http.delete(`/${serviceName}/users/${id}`);
    }

    deleteAll() {
        return http.delete(`/${serviceName}/users`);
    }
}
export default new UserServices();
