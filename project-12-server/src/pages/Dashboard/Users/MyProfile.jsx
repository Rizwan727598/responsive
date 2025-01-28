import { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";

const MyProfile = () => {
  const { user, setUser } = useAuth();
  const [profileDetails, setProfileDetails] = useState({
    name: user?.displayName || "",
    phoneNumber: user?.phoneNumber || "",
    photoURL: user?.photoURL || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileDetails({ ...profileDetails, [name]: value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        name: profileDetails.name,
        phoneNumber: profileDetails.phoneNumber,
        photoURL: profileDetails.photoURL,
      };

      // Update profile in Firebase
      await user.updateProfile({
        displayName: updatedData.name,
        photoURL: updatedData.photoURL,
      });

      // Update profile in the database
      const res = await axios.patch(
        `http://localhost:2000/users/${user.email}`,
        updatedData
      );
      if (res.data.modifiedCount > 0) {
        setUser({ ...user, ...updatedData });
        Swal.fire("Success", "Profile updated successfully!", "success");
      } else {
        Swal.fire(
          "Error",
          "Failed to update profile. Try again later.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire("Error", "Something went wrong. Try again later.", "error");
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto bg-white rounded shadow-md">
      <h1 className="mb-4 text-2xl font-bold">My Profile</h1>
      <form onSubmit={handleUpdateProfile}>
        {/* Profile Picture */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Profile Picture
          </label>
          <div className="flex items-center space-x-4">
            <img
              src={profileDetails.photoURL || "https://via.placeholder.com/100"}
              alt="Profile"
              className="object-cover w-20 h-20 rounded-full"
            />
            <input
              type="text"
              name="photoURL"
              value={profileDetails.photoURL}
              onChange={handleChange}
              placeholder="Enter photo URL"
              className="w-full p-3 border rounded"
            />
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={profileDetails.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full p-3 border rounded"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={profileDetails.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default MyProfile;
