import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Joi from "joi";
import Cookie from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorContainer } from "../utils/model";
import "../App.css";
import { BASE_URL } from "../services/helper";

const Register = () => {
  const [loading, setLoading] = useState(false); // loading state
  const [errors, setErrors] = useState<ErrorContainer>({}); // joi errors
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const token = Cookie.get("token");

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  // Form validation
  const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().min(3).max(12).required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Passwords must match" }),
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/register`, data);
      console.log(response);
      if (response.data.success === true) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(`Error: Try again!`);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = registerSchema.validate(data, { abortEarly: true });

    // getting the joi errors in valErr
    if (error) {
      const valErr: ErrorContainer = {};
      error.details.map((err) => {
        valErr[err.path[0]] = err.message;
      });
      setErrors(valErr);
      return;
    }

    setLoading(true);
    handleRegister();
    setLoading(false);
    setErrors({});
  };

  const handlePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-5 w-50">
      <form
        className="w-50 p-4 shadow-lg border mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={data.name}
            onChange={handleChange}
          />
          <small className="text-danger">{errors.name}</small>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={data.email}
            onChange={handleChange}
          />
          <small className="text-danger">{errors.email}</small>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="input-password">
            <input
              type={`${showPassword ? `text` : `password`}`}
              className="form-control"
              id="password"
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
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={handleChange}
          />
          <small className="text-danger">{errors.confirmPassword}</small>
        </div>
        <p>
          Already have an account?
          <span>
            <NavLink to="/login" className="text-decoration-none">
              {" "}
              Login
            </NavLink>
          </span>
        </p>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
