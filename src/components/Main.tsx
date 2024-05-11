import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { userDetails } from "../store/slice/userDetailsSlice";
import { useEffect } from "react";
import Cookie from "js-cookie";

const Main = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = Cookie.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (token) {
      fetchUserDetails();
    }
  });

  const fetchUserDetails = async () => {
    await dispatch(userDetails());
  };

  return <>{token ? <Outlet /> : null}</>;
};

export default Main;
