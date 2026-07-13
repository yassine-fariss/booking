import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axiosClient from "../../../AxiosClient";
import {
  AlertErrorMessage,
  AuthButton,
  Header,
  Footer,
} from "../../../Components";
import { loginSuccess } from "../../../Redux/SliceAuthAdmin";
import { useToast } from "../../../Context/ToastContext";
import {
  get,
  storeInLocalStorage,
} from "../../../Services/LocalStorageService";

const AuthAdmin = () => {
  document.title = "Admin Connexion";

  const adminData = useSelector((state) => state.AuthAdmin);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  console.log(adminData);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminData.isAuthenticated && get("TOKEN_ADMIN")) {
      navigate("/admin/dashboard");
    }
  }, [navigate, adminData.isAuthenticated]);

  const [rememberMe, setRememberMe] = useState(false);
  const [DataForm, setDataForm] = useState({
    email: "admin@example.com",
    password: "admin_password",
  });

  const [error, setError] = useState("");

  // Load remember me details on mount
  useEffect(() => {
    const savedEmail = get("REMEMBER_ME_ADMIN");
    if (savedEmail) {
      setDataForm((prev) => ({ ...prev, email: savedEmail, password: "" }));
      setRememberMe(true);
    }
  }, []);

  const HandleChangeData = (ev) => {
    const { name, value } = ev.target;
    setDataForm({ ...DataForm, [name]: value });
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    
    // Front-end Form Validation
    if (!DataForm.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (DataForm.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    
    setError("");
    setLoading(true);
    
    axiosClient
      .post("/admin/login", DataForm)
      .then(({ data }) => {
        dispatch(loginSuccess(data));
        storeInLocalStorage("TOKEN_ADMIN", data.token);
        
        // Handle Remember Me storage logic
        if (rememberMe) {
          storeInLocalStorage("REMEMBER_ME_ADMIN", DataForm.email);
        } else {
          localStorage.removeItem("REMEMBER_ME_ADMIN");
        }
        
        showToast("Login successful! Welcome back, Admin.", "success");
        setLoading(false);
        navigate("/admin/dashboard");
      })
      .catch((err) => {
        setLoading(false);
        const errMsg = err.response?.data?.error || "Invalid login credentials.";
        setError(errMsg);
        showToast(errMsg, "error");
      });
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-10 space-y-6 text-left animate-fade-in">
            
            {/* Header info */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <img src="/img/logo.png" className="w-[123px] object-contain" alt="DocAppoint logo" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Admin Portal</h2>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                Access database settings, doctor validation grids, and platform moderation panels.
              </p>
            </div>

            {error && <AlertErrorMessage message={error} />}

            <form className="space-y-4" onSubmit={HandleSubmit}>
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Admin Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={DataForm.email}
                  className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl py-3 px-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
                  placeholder="admin@example.com"
                  required
                  onChange={HandleChangeData}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="Password" className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Password
                </label>
                <input
                  type="password"
                  id="Password"
                  name="password"
                  value={DataForm.password}
                  className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl py-3 px-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
                  placeholder="••••••••"
                  required
                  onChange={HandleChangeData}
                />
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded outline-none"
                  />
                  <span>Remember Me</span>
                </label>
                <Link to="/forgotpassword" className="text-xs text-blue-600 font-bold hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <AuthButton Text={"Login as Admin"} Loading={loading} />
              </div>
            </form>

            <div className="border-t border-gray-50 pt-6 text-center">
              <p className="text-xs text-gray-400">
                Are you a patient?{" "}
                <Link to="/Connexion" className="text-blue-600 font-semibold hover:underline">
                  Patient Login
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

export default AuthAdmin;
