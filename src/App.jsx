import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./modules/auth/RequireAuth";
import Home from "./modules/public/Home.jsx";
import About from "./modules/public/About.jsx";
import Map from "./modules/public/Map.jsx";
import Appointment from "./modules/patient/Appointment";
import Error from "./modules/public/Error.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import { Register } from "./modules/auth/Register";
import { Login } from "./modules/auth/Login";
import { Logout } from "./modules/auth/Logout";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import PatientProfile from "./modules/patient/Profile";
import DentalOffice from "./modules/dental/DentalOffice";
import DoctorProfile from "./modules/doctor/DoctorProfile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/map" element={<Map />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path={"register"} element={<Register />} />
            <Route path={"login"} element={<Login />} />
            <Route path={"logout"} element={<Logout />} />
            <Route path="*" element={<Error />} />
          </Route>
          {/* Protected routes */}
          <Route path="/" element={<MainLayout />}>
            <Route element={<RequireAuth allowedRoles={['ROLE_PATIENT']} />}>
              <Route path={"profile"} element={<PatientProfile />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={['ROLE_OFFICE']} />}>
              <Route path={"dental"} element={<DentalOffice />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={['ROLE_DOCTOR']} />}>
              <Route path={"doctor"} element={<DoctorProfile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
