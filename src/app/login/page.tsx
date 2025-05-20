'use client'
import { useState } from "react";
import { toast } from "react-toastify";
import { ifetch } from "../services/utils";
import validator from "validator";
import { useRouter } from "next/navigation";

export default function Login() {
  const [otpDisabled, setOtpDisabled] = useState(true);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendOTP = async () => {
    if (!email) {
      return toast.error("Email is required");
    }
    if (!validator.isEmail(email)) {
      return toast.error("Invalid email");
    }
    setLoading(true);
    const { success, message } = await ifetch("/api/login/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (success) {
      setOtpDisabled(false);
    }
    setLoading(false);
  }

  const verifyOTP = async () => {
    if (!otp) {
      return toast.error("OTP is required");
    }
    setLoading(true);
    const response = await ifetch("/api/login/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });
    setLoading(false);
    if (response.success) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      router.push("/");
    }
  }

  return (
    <main className="min-h-[100vh] flex items-center justify-center">
      <div className="container m-auto w-auto md:2-96 p-8 md:p-20 bg-[#B1ACED] rounded-lg flex flex-col items-center gap-4">
        <img src="/logo.svg" alt="Logo" className="w-80 md:w-96" />
        <h2 className="text-black font-bold text-3xl m-auto my-8">Sign In</h2>
        <div className="flex flex-col gap-2">
          <div className={`border-b-2 border-white m-2 px-1 text-xl`}>
            <input type="text" placeholder={"Enter Email Address"} className={`bg-transparent text-white placeholder:text-gray-100 focus-visible:outline-none`} value={email} onChange={e => setEmail(e.target.value)} disabled={!otpDisabled} />
          </div>
          <div className={`border-b-2 border-white m-2 px-1 text-xl ${otpDisabled ? "opacity-50" : ""}`}>
            <input type="number" placeholder={"Enter OTP"} className={`bg-transparent text-white placeholder:text-gray-100 focus-visible:outline-none`} disabled={otpDisabled} value={otp} onChange={e => setOtp(e.target.value)} />
          </div>
        </div>
        <button className={`${loading ? "bg-gray-400" : "bg-[#F472B6]"} text-white font-bold w-full p-2 rounded-lg mt-5`} disabled={loading} onClick={otpDisabled ? sendOTP : verifyOTP}>{loading ? "Please wait..." : (otpDisabled ? "Send OTP" : "Submit")}</button>
      </div>
    </main>
  )
}