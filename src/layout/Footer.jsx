import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <nav className="d-flex justify-content-center">
          <NavLink
            to="/"
            className={(navData) =>
              navData.isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="Appointment"
            className={(navData) =>
              navData.isActive ? "nav-link active" : "nav-link"
            }
          >
            Appointment
          </NavLink>
          <NavLink
            to="Map"
            className={(navData) =>
              navData.isActive ? "nav-link active" : "nav-link"
            }
          >
            Map
          </NavLink>
          <NavLink
            to="About"
            className={(navData) =>
              navData.isActive ? "nav-link active" : "nav-link"
            }
          >
            About
          </NavLink>
        </nav>
        <div className="copyrights">
          &copy; 2022 <Link to="/"> Dentsemo</Link> - All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
