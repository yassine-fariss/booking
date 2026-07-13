import React, { useEffect, useState } from "react";
import { AuthButton, Footer, Header } from "../../Components";
import axiosClient from "../../AxiosClient.js";
import { useDispatch, useSelector } from "react-redux";
import { signUpSuccess } from "../../Redux/SliceAuthDoctor";
import { get, storeInLocalStorage } from "../../Services/LocalStorageService";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useToast } from "../../Context/ToastContext";

const Signup = () => {
  document.title = "S'identifier Doctors";

  const doctorData = useSelector((state) => state.AuthDoctor);
  console.log(doctorData);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctorData.isAuthenticated && get("TOKEN_DOCTOR")) {
      navigate("/doctor/dashboard");
    }
  }, [navigate, doctorData.isAuthenticated]);

  const [DataForm, setData] = useState({
    firstname: "",
    lastname: "",
    Matricule: "",
    phoneNumber: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState({
    firstname: "",
    lastname: "",
    Matricule: "",
    phoneNumber: "",
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
    console.log(DataForm);

    axiosClient
      .post("/doctor/register", DataForm)

      .then(({ data }) => {
        dispatch(signUpSuccess(data));

        storeInLocalStorage("TOKEN_DOCTOR", data.token);
        showToast("Registration successful! Welcome, Doctor.", "success");
        setLoading(false);
        navigate("/doctor/dashboard");
      })

      .catch((er) => {
        setLoading(false);
        const errMsg = er.response?.data?.message || "Registration failed. Please try again.";
        showToast(errMsg, "error");
        if (er.response && er.response.status === 422) {
          setError({ ...error, ...er.response.data.errors });
          console.log(er);
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
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Doctor Registration</h2>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                Register your clinic registry profile details to accept patient appointment bookings.
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
                    placeholder="Prenom"
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
                    placeholder="Nom"
                    required
                    onChange={HandleChangeData}
                  />
                  {error.lastname && (
                    <p className="text-[11px] text-red-600 font-semibold">{error.lastname[0]}</p>
                  )}
                </div>
              </div>

              {/* Matricule */}
              <div className="space-y-1.5">
                <label htmlFor="Matricule" className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Matricule / Professional Registry ID
                </label>
                <input
                  type="text"
                  id="Matricule"
                  name="Matricule"
                  className={`w-full bg-gray-50 border text-sm rounded-xl py-3 px-4 outline-none focus:ring-1 focus:ring-blue-500/20 transition ${
                    error.Matricule ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                  }`}
                  placeholder="e.g. 12345"
                  required
                  onChange={HandleChangeData}
                />
                {error.Matricule && (
                  <p className="text-[11px] text-red-600 font-semibold">{error.Matricule[0]}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label htmlFor="phoneNumber" className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  className={`w-full bg-gray-50 border text-sm rounded-xl py-3 px-4 outline-none focus:ring-1 focus:ring-blue-500/20 transition ${
                    error.phoneNumber ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                  }`}
                  placeholder="e.g. 0612345678"
                  required
                  onChange={HandleChangeData}
                />
                {error.phoneNumber && (
                  <p className="text-[11px] text-red-600 font-semibold">{error.phoneNumber[0]}</p>
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
                  placeholder="doctor@example.com"
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
                Already registered?{" "}
                <Link to="/doctor/login" className="text-blue-600 font-bold hover:underline">
                  Log In
                </Link>
              </p>
              <p className="text-xs text-gray-400">
                Are you a patient?{" "}
                <Link to="/identifier" className="text-blue-600 font-semibold hover:underline">
                  Patient Registration
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
