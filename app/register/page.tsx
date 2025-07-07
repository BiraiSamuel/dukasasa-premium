"use client";
import { CustomButton, SectionTitle } from "@/components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoadingSubmit(true);

    const name = e.target[0].value;
    const lastname = e.target[1].value;
    const email = e.target[2].value;
    const password = e.target[3].value;
    const confirmPassword = e.target[4].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      setLoadingSubmit(false);
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      setLoadingSubmit(false);
      return;
    }

    if (confirmPassword !== password) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      setLoadingSubmit(false);
      return;
    }

    try {
      const res = await fetch("/api/proxy/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, lastname, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Email already registered");
        toast.error(data.message || "Email already registered");
        setLoadingSubmit(false);
        return;
      }

      setError("");
      toast.success("Registration successful");
      router.push("/login");
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
      toast.error("Something went wrong");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="bg-white">
      <SectionTitle title="Register" path="Home | Register" />

      {sessionStatus === "loading" && (
        <div className="text-center mt-4 text-gray-600 text-sm">
          <span className="animate-pulse">Loading session...</span>
        </div>
      )}

      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
        <div className="flex justify-center flex-col items-center">
          <h2 className="mt-6 text-center text-2xl leading-9 tracking-tight text-gray-900">
            Sign up on our website
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {["name", "lastname", "email", "password", "confirmpassword"].map((field, idx) => (
                <div key={idx}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium leading-6 text-gray-900 capitalize"
                  >
                    {field === "confirmpassword" ? "Confirm Password" : field}
                  </label>
                  <div className="mt-2">
                    <input
                      id={field}
                      name={field}
                      type={field.toLowerCase().includes("password") ? "password" : "text"}
                      autoComplete={field}
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
                        ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                        focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    Accept our terms and privacy policy
                  </label>
                </div>
              </div>

              <div className="relative">
                <CustomButton
                  buttonType="submit"
                  text={loadingSubmit ? "Signing up..." : "Sign up"}
                  paddingX={3}
                  paddingY={1.5}
                  customWidth="full"
                  textSize="sm"
                  disabled={loadingSubmit}
                />

                {loadingSubmit && (
                  <div className="absolute right-4 top-2.5">
                    <span className="loader border-gray-300 border-t-black"></span>
                  </div>
                )}

                <p className="text-red-600 text-center text-[16px] my-4">
                  {error && error}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .loader {
          border: 2px solid;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          animation: spin 0.7s linear infinite;
          border-top-color: black;
          border-right-color: transparent;
          border-bottom-color: transparent;
          border-left-color: transparent;
        }
        @keyframes spin {
          0% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
