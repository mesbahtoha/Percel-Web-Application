import { useForm } from "react-hook-form";
import deliveryIllustration from "../../../assets/authImage.png";
import logo from "../../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { useState } from "react";
import useAxios from "../../../hooks/useAxios";

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, signInwithGoogle, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const [uploading, setUploading] = useState(false);

  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
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
    } catch (error) {
      console.error("Register error:", error);
      alert("Already Registered with this Email");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInwithGoogle();
      const user = result.user;

      const userInfo = {
        name: user.displayName || "No Name",
        email: user.email,
        role: "user",
        picture: user.photoURL || "",
      };

      await axiosInstance.post("/users", userInfo);

      navigate("/dashboard/overview", { replace: true });
    } catch (error) {
      console.error("Google sign-in error:", error);
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
    } catch (error) {
      console.error("Image upload error:", error);
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
                {...register("name", { required: true })}
                type="text"
                placeholder="Name"
                className="w-full border border-base-300 bg-base-100 text-base-content rounded-lg px-4 py-2 placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-base-content">
                Email
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="Email"
                className="w-full border border-base-300 bg-base-100 text-base-content rounded-lg px-4 py-2 placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-base-content">
                Password
              </label>
              <input
                {...register("password", {
                  required: true,
                  minLength: 6,
                })}
                type="password"
                placeholder="Password"
                className="w-full border border-base-300 bg-base-100 text-base-content rounded-lg px-4 py-2 placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.password?.type === "required" && (
                <p className="text-error text-sm">Password is required</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-error text-sm">
                  Password must be 6 characters or longer
                </p>
              )}
            </div>

            <button
              disabled={uploading}
              className="btn btn-primary w-full rounded-lg disabled:opacity-50"
            >
              {uploading ? "Uploading image..." : "Register"}
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