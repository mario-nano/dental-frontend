import { Link, NavLink } from "react-router-dom";
import {useSelector} from "react-redux";
import UserMenu from "./UserMenu";
import GuestMenu from "./GuestMenu";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useEffect} from "react";

const Header = () => {
  const isLogged = useSelector((state) => state.auth.isLogged);
  const toastCount = useSelector((state) => state.notification.toastCount);
  const toastType = useSelector((state) => state.notification.toastType);
  const toastMessage = useSelector((state) => state.notification.toastMessage);

  useEffect(() => {
    if (toastType)
    toast[toastType](toastMessage);
  },[toastCount]);

  return (
    <header>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <div className="logo">
            <Link to="/" className="brand">
              <h1>Dentsemo</h1>
            </Link>
          </div>

          <nav className="nav nav-pills">
            <NavLink
              to="/"
              className={(navData) =>
                navData.isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>
            <NavLink
                to="map"
                className={(navData) =>
                    navData.isActive ? "nav-link active" : "nav-link"
                }
            >
              Search dental
            </NavLink>
            <NavLink
              to="appointment"
              className={(navData) =>
                navData.isActive ? "nav-link active" : "nav-link"
              }
            >
              Appointment
            </NavLink>

            <NavLink
              to="about"
              className={(navData) =>
                navData.isActive ? "nav-link active" : "nav-link"
              }
            >
              About
            </NavLink>

            {isLogged ?
                <UserMenu /> :
                <GuestMenu />
            }

          </nav>
        </div>
      </div>
      <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
      />
    </header>
  );
};

export default Header;
