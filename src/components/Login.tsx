import React, { ChangeEvent, FormEvent, useEffect } from "react";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Joi from "joi";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorContainer } from "../utils/model";
import "../App.css";
import { BASE_URL } from "../services/helper";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorContainer>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const token = Cookie.get("token");
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  // Form validation
  const loginSchema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().min(3).max(12).required(),
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      if (!token) {
        const response = await axios.post(`${BASE_URL}/api/login`, data);
        if (response.data.success === true) {
          Cookie.set("token", response.data.token);
          Cookie.set("userID", response.data.userID);
          toast.success(response.data.message);
          navigate("/dashboard");
        } else {
          toast.error(`Check your credentials`);
        }
      } else {
        toast.info(`Already logged in`);
        navigate("/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = loginSchema.validate(data, { abortEarly: true });

    if (error) {
      const valErr: ErrorContainer = {};
      error.details.forEach((err) => {
        valErr[err.path[0]] = err.message;
      });
      setErrors(valErr);
      return;
    }

    setLoading(true);
    handleLogin();
    setLoading(false);
    setErrors({});
  };

  const handlePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="container mt-5 w-50">
        <form
          className="w-50 mx-auto p-4 shadow-lg border"
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              name="email"
              value={data.email}
              onChange={handleChange}
            />
            <small className="text-danger">{errors.email}</small>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <div className="input-password">
              <input
                type={`${showPassword ? `text` : `password`}`}
                className="form-control"
                id="exampleInputPassword1"
                name="password"
                value={data.password}
                onChange={handleChange}
              />
              <i
                role="button"
                className={`bi ${
                  showPassword ? `bi-eye-slash-fill` : `bi-eye-fill`
                } show-pass`}
                onClick={handlePassword}
              ></i>
            </div>
            <small className="text-danger">{errors.password}</small>
          </div>
          <p>
            New User?
            <span>
              <NavLink to="/register" className="text-decoration-none">
                {" "}
                Register
              </NavLink>
            </span>
          </p>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
