import React from "react";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Redux/userSlice";
import Swal from "sweetalert2";

const Navbarr = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    let timerInterval;

    Swal.fire({
      title: "Logging out...",
      html: "You will be logged out in <b></b> milliseconds.",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
        dispatch(logout());
        navigate("/");
      },
    });
  };

  return (
    <Navbar expand="lg" className="custom-bg" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <h1
            className="navbar-title text-primary"
            style={{ color: "#4a90e2" }}
          >
            TODay
          </h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                {/* Dropdown pour l'image de profil */}
                <Dropdown align="end" className="ms-3">
                  <Dropdown.Toggle
                    variant="transparent"
                    id="dropdown-profile"
                    className="p-0 border-0"
                  >
                    <img
                      src={user?.profile_photo || "./default-avatar.png"}
                      alt="User Avatar"
                      className="rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        border: "2px solid #f76c6c", // Couleur principale appliquée ici
                      }}
                    />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={"/profil"}>
                      Profil
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={handleLogout}
                      className="text-danger"
                      style={{ color: "#f76c6c" }} // Couleur principale pour le bouton Logout
                    >
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <Nav.Link as={Link} to="/">
                <Button
                  className="login-btn"
                  style={{ backgroundColor: "#4a90e2" }}
                >
                  Log In
                </Button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbarr;
