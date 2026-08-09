import { useForm } from "react-hook-form";
import deliveryIllustration from "../../../assets/authImage.png";
import logo from "../../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { useState } from "react";
import useAxios from "../../../hooks/useAxios";
import Swal from "sweetalert2";
import { getGoogleAuthErrorMessage } from "../../../hooks/googleAuthErrorMessage";

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, signInwithGoogle, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      await createUser(data.email, data.password);

      const userInfo = {
        name: data.name,
        email: data.email,
        role: "user",
        picture: profilePic || "",
      };

      await axiosInstance.post("/users", userInfo);

      await updateUserProfile({
        displayName: data.name,
        photoURL: profilePic || "",
      });

      navigate("/dashboard/overview", { replace: true });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: "An account already exists with this email. Please login instead.",
        background: "#1f2937",
        color: "#f9fafb",
        confirmButtonColor: "#84cc16",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setSubmitting(true);

      const result = await signInwithGoogle();
      const googleUser = result.user;

      const userInfo = {
        name: googleUser.displayName || "No Name",
        email: googleUser.email,
        role: "user",
        picture: googleUser.photoURL || "",
      };

      try {
        await axiosInstance.post("/users", userInfo);
      } catch {
        // DB sync is non-fatal — Firebase registration already succeeded.
      }

      navigate("/dashboard/overview", { replace: true });
    } catch (error) {
      const message = getGoogleAuthErrorMessage(error);
      Swal.fire({
        icon: "error",
        title: "Google sign-in failed",
        text: message,
        background: "#1f2937",
        color: "#f9fafb",
        confirmButtonColor: "#84cc16",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImgUpload = async (e) => {
    try {
      const img = e.target.files[0];
      if (!img) return;

      setUploading(true);

      const formData = new FormData();
      formData.append("image", img);

      const imgUploadURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_img_upload_key}`;
      const res = await axios.post(imgUploadURL, formData);

      setProfilePic(res.data.data.url);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Image upload failed",
        text: "Could not upload your picture. Try again.",
        background: "#1f2937",
        color: "#f9fafb",
        confirmButtonColor: "#84cc16",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-base-100 text-base-content">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/">
            <div className="flex items-center mb-8 ml-[30%] -mt-5">
              <img src={logo} alt="logo" className="w-11 h-11" />
              <h2 className="text-3xl font-extrabold text-base-content -ml-4.5 mt-4.5">
                Profast
              </h2>
            </div>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-base-content">
            Create an Account
          </h1>
          <p className="text-base-content/70 mt-2 mb-6 text-lg">
            Register with Profast
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1 text-base-content">
                Upload Your Picture
              </label>
              <input
                onChange={handleImgUpload}
                type="file"
                accept="image/*"
                className="w-full border border-base-300 bg-base-100 text-base-content rounded-lg px-4 py-2 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-content focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {uploading && (
                <p className="text-sm text-info mt-1">Uploading image...</p>
              )}
              {profilePic && (
                <img
                  src={profilePic}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover mt-3 border border-base-300"
                />
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-base-content">
                Name
              </label>
              <input
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                type="text"
                placeholder="Name"
                className="w-full border border-base-300 bg-base-100 text-base-content rounded-lg px-4 py-2 placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.name && (
                <p className="text-error text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-base-content">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                type="email"
                placeholder="Email"
                className="w-full border border-base-300 bg-base-100 text-base-content rounded-lg px-4 py-2 placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-base-content">
                Password
              </label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be 6 characters or longer",
                  },
                })}
                type="password"
                placeholder="Password"
                className="w-full border border-base-300 bg-base-100 text-base-content rounded-lg px-4 py-2 placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.password && (
                <p className="text-error text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              disabled={uploading || submitting}
              className="btn btn-primary w-full rounded-lg disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating account...
                </>
              ) : uploading ? (
                "Uploading image..."
              ) : (
                "Register"
              )}
            </button>
          </form>

          <p className="mt-4 text-sm text-base-content/70">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>

          <div className="my-5 text-center text-base-content/50 text-sm">Or</div>

          <button
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-3 bg-base-100 border border-base-300 hover:bg-base-200 py-3 rounded-lg text-base-content font-semibold transition duration-300 shadow-sm"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Register with Google
          </button>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-lime-50 to-lime-100 p-12">
        <img
          src={deliveryIllustration}
          alt="Delivery Illustration"
          className="max-w-md w-full object-contain"
        />
      </div>
    </div>
  );
};
