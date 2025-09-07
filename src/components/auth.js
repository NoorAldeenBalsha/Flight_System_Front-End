import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthContext from "../context/auth/authContext";
import CartContext from "../context/cart/cartContext";
import LoadingContext from "../context/loading/loadingContext";
import { useLanguage } from "../context/LanguageContext";
import "../auth.css";
import Toast from "./toastAnimated";
import axios from "axios";
// Auth Component: Handles login and registration
const Auth = () => {
  // State: Form data, loading, toast, input type, language
  const history = useHistory();
  const { register, login, isAuthenticated } = useContext(AuthContext);
  const { loadCart } = useContext(CartContext);
  const { Loader } = useContext(LoadingContext);
  const { t, lang } = useLanguage();
  const isMounted = useRef(true);
  const [flag, setFlag] = useState(0); // 0 = login, 1 = signup
  const [signUpData, setSignUpData] = useState({fullName: "",email: "",password: "",gender: "",phone: "",passportNumber: "",});
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [inputType, setInputType] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  //=======================================================================================================
  // Redirect if already authenticated
  useEffect(() => {
    return () => {
      isMounted.current = false; // حماية من memory leak
    };
  }, []);
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
      history.push("/");
    }
  }, [isAuthenticated, history, loadCart]);
  //=======================================================================================================
  // Update Sign Up form state
  const handleSignUpChange = (e) =>setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  // Update Sign In form state  
  const handleSignInChange = (e) =>setSignInData({ ...signInData, [e.target.name]: e.target.value });
  //=======================================================================================================
  // Toggle password visibility
  const togglePassword = () =>setInputType(inputType === "password" ? "text" : "password");
  // Toggle between Sign In and Sign Up forms
  const toggleForm = () => setFlag(flag ^ 1);
  //=======================================================================================================
  // Handle user registration
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, gender, phone, passportNumber } = signUpData;
    // تحقق أولي في الفارونت
    if (!fullName || !email || !password || !gender || !phone || !passportNumber) {
      setToast({
        show: true,
        message: t('error_fill_all'),
        type: 'error'
      });
      return;
    }

  setIsLoading(true);

try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "lang": lang // اللغة ترسل في الهيدر
      }
    };

    const res = await axios.post(
      "http://localhost:5000/api/user/auth/register",
      signUpData, 
      config
    );
    // فقط إذا الباك رد بدون خطأ
    setToast({show: true,message: res.message,type: 'success'}); // الرسالة من الباك


    // بعد ثواني قصيرة، انتقل لصفحة النجاح
    setTimeout(() => {
      window.location.href = "http://localhost:3000/registration-success"; // ضع هنا رابط الصفحة التي تريدها
    }, 1000);

  } catch (err) {
    // التعامل مع الأخطاء من الباك
    const data = err.response?.data;

    if (data?.errors?.length > 0) {
      setToast({show: true,message: data.errors[0].message,type: 'error'}); // أول خطأ فقط
    } else 
      if (data?.message) {
      setToast({show: true,message: data.message,type: 'error'});
    } else {
      setToast({show: true,message: t('error_server'),type: 'error'});
    }
  } finally {
    setIsLoading(false);
  }
  };
  // Handle user login
  const handleSignInSubmit = async (e) => {
  e.preventDefault();
  const { email, password } = signInData;

  if (!email || !password) {
    setToast({ show: true, message: t("error_fill_all"), type: "error" });
    return;
  }

  setIsLoading(true);

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "lang": lang, // إرسال لغة الموقع للباك
      },
    };

    const res = await axios.post(
      "http://localhost:5000/api/user/auth/login",
      signInData,
      config
    );

    // تسجيل الدخول ناجح
    setToast({
      show: true,
      message: res.data.message || t("success_login"),
      type: "success",
    });

    // الانتقال للصفحة الرئيسية بعد ثانية
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);

  } catch (err) {
    // التعامل مع الأخطاء من الباك
    const data = err.response?.data;

    if (data?.errors?.length > 0) {
      // عرض أول خطأ من الباك
      setToast({
        show: true,
        message: data.errors[0].message,
        type: "error",
      });
    } else if (data?.message) {
      setToast({
        show: true,
        message: data.message,
        type: "error",
      });
    } else {
      setToast({
        show: true,
        message: t("error_server"),
        type: "error",
      });
    }
  } finally {
    setIsLoading(false);
  }
  };
  //=======================================================================================================
  return (
    <>
      {isLoading && <Loader />}
      {toast.show && (
        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className={flag === 0 ? "container1" : "container1 sign-up-mode"}>
        <div className="forms-container">
          <div className="signin-signup">
            {/* Sign In */}
            <form className="sign-in-form" onSubmit={handleSignInSubmit}>
              <h2 className="title">{t("sign_in")}</h2>
              <div className="input-field">
                <i className="fas fa-user" />
                <input
                  name="email"
                  type="email"
                  placeholder={t("email")}
                  value={signInData.email}
                  onChange={handleSignInChange}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input
                  name="password"
                  type={inputType}
                  placeholder={t("password")}
                  value={signInData.password}
                  onChange={handleSignInChange}
                />
              </div>
              <input type="submit" value={t("login")} className="btn solid" />
              <Link to="/forget">{t("forgot_password")}</Link>
            </form>

            {/* Sign Up */}
            <form className="sign-up-form" onSubmit={handleSignUpSubmit}>
              <h2 className="title">{t("sign_up")}</h2>
              <div className="input-field">
                <i className="fas fa-user" />
                <input
                  name="fullName"
                  type="text"
                  placeholder={t("full_name")}
                  value={signUpData.fullName}
                  onChange={handleSignUpChange}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-envelope" />
                <input
                  name="email"
                  type="email"
                  placeholder={t("email")}
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                />
              </div>
              <div className="input-field select-wrapper">
                <i className="fas fa-venus-mars" />
                <select name="gender" value={signUpData.gender} onChange={handleSignUpChange}>
                  <option value="">{t("select_gender")}</option>
                  <option value="male">{t("male")}</option>
                  <option value="female">{t("female")}</option>
                  <option value="other">{t("other")}</option>
                </select>
              </div>
              <div className="input-field">
                <i className="fas fa-phone" />
                <input
                  name="phone"
                  type="text"
                  placeholder={t("phone")}
                  value={signUpData.phone}
                  onChange={handleSignUpChange}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-id-card" />
                <input
                  name="passportNumber"
                  type="text"
                  placeholder={t("passport_number")}
                  value={signUpData.passportNumber}
                  onChange={handleSignUpChange}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input
                  name="password"
                  type="password"placeholder={t("password")}
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                />
              </div>
              <input type="submit" className="btn" value={t("sign_up")} />
            </form>
          </div>
        </div>

        {/* Panels */}
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>{t("new_here")}</h3>
              <p>{t("signup_prompt")}</p>
              <button className="btn transparent" onClick={toggleForm}>
                {t("sign_up")}
              </button>
            </div>
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>{t("one_of_us")}</h3>
              <p>{t("signin_prompt")}</p>
              <button className="btn transparent" onClick={toggleForm}>
                {t("sign_in")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
//=======================================================================================================
export default Auth