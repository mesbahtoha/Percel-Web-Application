import { useEffect, useState } from "react";
import axios from "axios";
import { authHttpClient } from "../../../api/http";
import useAuth from "../../../hooks/useAuth";
import { Camera, RefreshCw } from "lucide-react";

const fallbackAvatar = "https://i.ibb.co/4pDNDk1/avatar-placeholder.png";

export const AdminProfile = () => {
  const { user, updateUserProfile } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchProfile = async () => {
    try {
      setLoadError("");
      const { data } = await authHttpClient.get(`/users/profile/${user?.email}`);
      setProfile(data);
      setName(data.name || user?.displayName || "");
    } catch {
      setProfile(null);
      setLoadError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchProfile();
  }, [user?.email]);

  const uploadImageToImgbb = async () => {
    const formData = new FormData();
    formData.append("image", selectedImage);
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_img_upload_key}`,
      formData
    );
    return response.data.data.url;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      let finalPhotoURL = profile?.picture || user?.photoURL || "";
      if (selectedImage) {
        setUploading(true);
        finalPhotoURL = await uploadImageToImgbb();
      }

      await updateUserProfile({ displayName: name, photoURL: finalPhotoURL });
      await authHttpClient.patch("/users/profile", {
        email: user?.email,
        name,
        picture: finalPhotoURL,
      });

      setProfile((prev) => ({ ...prev, name, picture: finalPhotoURL }));
      setMessage({ type: "success", text: "Profile updated successfully." });
      setIsEditing(false);
      setSelectedImage(null);
    } catch {
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImage(null);
    setName(profile?.name || user?.displayName || "");
    setMessage({ type: "", text: "" });
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-lime-600" />
      </div>
    );
  }

  const picture =
    (isEditing && selectedImage
      ? URL.createObjectURL(selectedImage)
      : profile?.picture) ||
    user?.photoURL ||
    fallbackAvatar;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#083c46]">My Profile</h2>
          <p className="mt-1 text-sm text-gray-500">
            View and update your admin account information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchProfile}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={15} />
            Refresh
          </button>

          {!isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setMessage({ type: "", text: "" });
              }}
              className="btn border-none bg-lime-400 text-black hover:bg-lime-500"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {loadError && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {loadError}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-lime-100 to-lime-50 px-6 py-10">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <div className="avatar">
              <div className="w-28 rounded-full ring ring-lime-300 ring-offset-2 ring-offset-white">
                <img src={picture} alt="Admin avatar" />
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-800">
                {profile?.name || user?.displayName || "Admin"}
              </h3>
              <p className="mt-1 text-gray-600">{user?.email}</p>
              <span className="mt-2 inline-block rounded-full bg-[#03373D] px-3 py-1 text-xs font-semibold text-lime-300">
                ADMIN
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {!isEditing ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-xl border bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">Full Name</p>
                <p className="mt-1 font-semibold text-gray-800">
                  {profile?.name || user?.displayName || "No Name"}
                </p>
              </div>

              <div className="rounded-xl border bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">Email Address</p>
                <p className="mt-1 break-all font-semibold text-gray-800">{user?.email}</p>
              </div>

              <div className="rounded-xl border bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">Role</p>
                <p className="mt-1 font-semibold text-gray-800 capitalize">
                  {profile?.role || "admin"}
                </p>
              </div>

              <div className="rounded-xl border bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">Member Since</p>
                <p className="mt-1 font-semibold text-gray-800">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("en-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              {message.text && (
                <p
                  className={`rounded-xl px-4 py-3 text-sm ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {message.text}
                </p>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  placeholder="Your full name"
                  className="input input-bordered w-full rounded-xl"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={picture}
                    alt="Preview"
                    className="h-20 w-20 rounded-full border object-cover"
                  />
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Camera size={16} />
                    {uploading ? "Uploading..." : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setSelectedImage(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email (read-only)
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="input input-bordered w-full rounded-xl bg-gray-100 text-gray-500"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="btn border-none bg-lime-400 text-black hover:bg-lime-500 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="btn border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
