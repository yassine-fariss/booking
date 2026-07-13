import React, { useEffect, useState } from "react";
import { Footer, Header, AuthButton } from "../Components";
import axiosClient from "../AxiosClient.js";
import { useDispatch, useSelector } from "react-redux";
import { signUpSuccess } from "../Redux/SliceAuthUser";
import { get, storeInLocalStorage } from "../Services/LocalStorageService";
import { useToast } from "../Context/ToastContext";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const Signup = () => {
  document.title = "S'identifier";

  const userData = useSelector((state) => state.authUser);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData.isAuthenticated && get("TOKEN_USER")) {
      navigate("/user/profile");
    }
  }, [navigate, userData.isAuthenticated]);

  const [DataForm, setData] = useState({
    firstname: "",
    lastname: "",
    cin: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState({
    firstname: "",
    lastname: "",
    cin: "",
    email: "",
    password: "",
  });

  const HandleChangeData = (e) => {
    const { name, value } = e.target;
    setData({ ...DataForm, [name]: value });
  };

  const HandleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    axiosClient
      .post("/user/register", DataForm)

      .then(({ data }) => {
        dispatch(signUpSuccess(data));

        storeInLocalStorage("TOKEN_USER", data.token);
        showToast("Registration successful! Welcome to DocAppoint.", "success");
        setLoading(false);
        navigate("/user/profile");
      })

      .catch((er) => {
        setLoading(false);
        const errMsg = er.response?.data?.message || "Registration failed. Please try again.";
        showToast(errMsg, "error");
        if (er.response && er.response.status === 422) {
          setError({ ...error, ...er.response.data.errors });
        } else {
          console.log(er);
        }
      });
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-10 space-y-6 text-left animate-fade-in">
            
            {/* Header info */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <img src="/img/logo.png" className="w-[123px] object-contain" alt="DocAppoint logo" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Create Patient Account</h2>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                Join DocAppoint to manage consultations and coordinate healthcare appointments.
              </p>
            </div>

            <form className="space-y-4" onSubmit={HandleSubmit}>
              
              {/* Names grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="FirstName" className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="FirstName"
                    name="firstname"
                    className={`w-full bg-gray-50 border text-sm rounded-xl py-3 px-4 outline-none focus:ring-1 focus:ring-blue-500/20 transition ${
                      error.firstname ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="John"
                    required
                    onChange={HandleChangeData}
                  />
                  {error.firstname && (
                    <p className="text-[11px] text-red-600 font-semibold">{error.firstname[0]}</p>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <label htmlFor="LastName" className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="LastName"
                    name="lastname"
                    className={`w-full bg-gray-50 border text-sm rounded-xl py-3 px-4 outline-none focus:ring-1 focus:ring-blue-500/20 transition ${
                      error.lastname ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="Doe"
                    required
                    onChange={HandleChangeData}
                  />
                  {error.lastname && (
                    <p className="text-[11px] text-red-600 font-semibold">{error.lastname[0]}</p>
                  )}
                </div>
              </div>

              {/* CIN */}
              <div className="space-y-1.5">
                <label htmlFor="cin" className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  CIN / Identity Card Number
                </label>
                <input
                  type="text"
                  id="cin"
                  name="cin"
                  className={`w-full bg-gray-50 border text-sm rounded-xl py-3 px-4 outline-none focus:ring-1 focus:ring-blue-500/20 transition ${
                    error.cin ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                  }`}
                  placeholder="e.g. AB123456"
                  required
                  onChange={HandleChangeData}
                />
                {error.cin && (
                  <p className="text-[11px] text-red-600 font-semibold">{error.cin[0]}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`w-full bg-gray-50 border text-sm rounded-xl py-3 px-4 outline-none focus:ring-1 focus:ring-blue-500/20 transition ${
                    error.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                  }`}
                  placeholder="john.doe@example.com"
                  required
                  onChange={HandleChangeData}
                />
                {error.email && (
                  <p className="text-[11px] text-red-600 font-semibold">{error.email[0]}</p>
                )}
              </div>

              {/* Password Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="Password" className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Password
                  </label>
                  <input
                    type="password"
                    id="Password"
                    name="password"
                    className={`w-full bg-gray-50 border text-sm rounded-xl py-3 px-4 outline-none focus:ring-1 focus:ring-blue-500/20 transition ${
                      error.password ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="••••••••"
                    required
                    onChange={HandleChangeData}
                  />
                  {error.password && (
                    <p className="text-[11px] text-red-600 font-semibold">{error.password[0]}</p>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <label htmlFor="PasswordConfirmation" className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="PasswordConfirmation"
                    name="password_confirmation"
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl py-3 px-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
                    placeholder="••••••••"
                    required
                    onChange={HandleChangeData}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <AuthButton Text="Sign Up" Loading={loading} />
              </div>
            </form>

            <div className="border-t border-gray-50 pt-6 text-center space-y-3">
              <p className="text-xs md:text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/Connexion" className="text-blue-600 font-bold hover:underline">
                  Log In
                </Link>
              </p>
              <p className="text-xs text-gray-400">
                Are you a healthcare provider?{" "}
                <Link to="/doctor/signup" className="text-blue-600 font-semibold hover:underline">
                  Doctor Registration
                </Link>
              </p>
            </div>

          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Signup;
