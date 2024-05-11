import React from "react";
import Cookie from "js-cookie";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import "../App.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = Cookie.get("token");

  const handleLogout = () => {
    Cookie.remove("token");
    Cookie.remove("userID");
    navigate("/");
  };

  const name = useAppSelector((state) => state.userDetails.name);

  return (
    <>
      <div className="container-fluid navbar-container">
        <nav className="navbar navbar-expand-lg bg-body-tertiary mb-3">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="/dashboard"
                  >
                    <i className="bi bi-house-fill"></i>&nbsp;Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="/offers"
                  >
                    <i className="fa-solid fa-percent"></i>&nbsp;Offers
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link active"
                    aria-current="page"
                    to="/bookmarks"
                  >
                    <i className="bi bi-bookmark-fill"></i>&nbsp;Bookmarks
                  </NavLink>
                </li>
              </ul>

              <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
                {token ? (
                  <>
                    <div
                      className="navbar-collapse dropdown-center"
                      id="navbarNavDarkDropdown"
                    >
                      <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                          <a
                            className="btn btn-light dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <b>Welcome {name}</b>
                          </a>
                          <ul className="dropdown-menu dropdown-menu-dark dropdown-button">
                            {/* <li>
                              <a
                                className="dropdown-item"
                                href="javascript:void(0)"
                              >
                                <i className="bi bi-person-fill"></i>
                                &nbsp;&nbsp;Profile
                              </a>
                            </li> */}
                            <li>
                              <NavLink
                                className="dropdown-item"
                                onClick={handleLogout}
                                to="/login"
                              >
                                <i className="bi bi-box-arrow-right"></i>
                                &nbsp;&nbsp;Logout
                              </NavLink>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <li className="nav-item">
                    <NavLink className="nav-link active" to="/login">
                      Login
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
