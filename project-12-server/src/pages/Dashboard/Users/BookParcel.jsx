import { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";

const BookParcel = () => {
  const { user } = useAuth();
  const [parcelDetails, setParcelDetails] = useState({
    phoneNumber: "",
    parcelType: "",
    parcelWeight: 0,
    receiverName: "",
    receiverPhone: "",
    deliveryAddress: "",
    deliveryDate: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParcelDetails({ ...parcelDetails, [name]: value });
  };

  const calculatePrice = () => {
    const weight = parcelDetails.parcelWeight;
    if (weight <= 1) return 50;
    if (weight <= 2) return 100;
    return 150;
  };

  const handleBookParcel = async (e) => {
    e.preventDefault();

    const price = calculatePrice();
    const bookingData = {
      ...parcelDetails,
      senderName: user?.displayName,
      senderEmail: user?.email,
      price,
      status: "pending",
      bookingDate: new Date(),
    };

    try {
      const { data } = await axios.post(
        "http://localhost:2000/book-parcel",
        bookingData
      );
      if (data.insertedId) {
        Swal.fire("Success", "Parcel booked successfully!", "success");
        setParcelDetails({
          phoneNumber: "",
          parcelType: "",
          parcelWeight: 0,
          receiverName: "",
          receiverPhone: "",
          deliveryAddress: "",
          deliveryDate: "",
          latitude: "",
          longitude: "",
        });
      } else {
        Swal.fire(
          "Error",
          "Failed to book the parcel. Try again later.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error booking parcel:", error);
      Swal.fire("Error", "Something went wrong. Try again later.", "error");
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto bg-white rounded shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Book a Parcel</h1>
      <form onSubmit={handleBookParcel}>
        {/* Sender Info */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Sender Name
          </label>
          <input
            type="text"
            value={user?.displayName}
            disabled
            className="w-full p-3 bg-gray-100 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Sender Email
          </label>
          <input
            type="email"
            value={user?.email}
            disabled
            className="w-full p-3 bg-gray-100 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={parcelDetails.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full p-3 border rounded"
            required
          />
        </div>

        {/* Parcel Info */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Parcel Type
          </label>
          <input
            type="text"
            name="parcelType"
            value={parcelDetails.parcelType}
            onChange={handleChange}
            placeholder="Enter parcel type"
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Parcel Weight (kg)
          </label>
          <input
            type="number"
            name="parcelWeight"
            value={parcelDetails.parcelWeight}
            onChange={handleChange}
            placeholder="Enter parcel weight"
            className="w-full p-3 border rounded"
            required
          />
        </div>

        {/* Receiver Info */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Receiver's Name
          </label>
          <input
            type="text"
            name="receiverName"
            value={parcelDetails.receiverName}
            onChange={handleChange}
            placeholder="Enter receiver's name"
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Receiver's Phone
          </label>
          <input
            type="text"
            name="receiverPhone"
            value={parcelDetails.receiverPhone}
            onChange={handleChange}
            placeholder="Enter receiver's phone"
            className="w-full p-3 border rounded"
            required
          />
        </div>

        {/* Delivery Info */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Delivery Address
          </label>
          <textarea
            name="deliveryAddress"
            value={parcelDetails.deliveryAddress}
            onChange={handleChange}
            placeholder="Enter delivery address"
            className="w-full p-3 border rounded"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Requested Delivery Date
          </label>
          <input
            type="date"
            name="deliveryDate"
            value={parcelDetails.deliveryDate}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Delivery Address Latitude
          </label>
          <input
            type="text"
            name="latitude"
            value={parcelDetails.latitude}
            onChange={handleChange}
            placeholder="Enter latitude"
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Delivery Address Longitude
          </label>
          <input
            type="text"
            name="longitude"
            value={parcelDetails.longitude}
            onChange={handleChange}
            placeholder="Enter longitude"
            className="w-full p-3 border rounded"
            required
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="font-medium text-gray-700">
            <span className="font-bold">Price:</span> {calculatePrice()} Tk
          </p>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary">
          Book Parcel
        </button>
      </form>
    </div>
  );
};

export default BookParcel;
