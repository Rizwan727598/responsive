import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const MyDeliveryList = () => {
  const [deliveryList, setDeliveryList] = useState([]);

  useEffect(() => {
    const fetchDeliveryList = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:2000/delivery-men/my-delivery-list"
        );
        setDeliveryList(data);
      } catch (error) {
        console.error("Error fetching delivery list:", error);
      }
    };

    fetchDeliveryList();
  }, []);

  // Mark parcel as Delivered
  const handleMarkAsDelivered = async (parcelId) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:2000/parcels/${parcelId}/status`,
        {
          status: "delivered",
        }
      );
      if (data.modifiedCount > 0) {
        setDeliveryList((prev) =>
          prev.map((parcel) =>
            parcel._id === parcelId
              ? { ...parcel, status: "delivered" }
              : parcel
          )
        );
        Swal.fire("Success!", "Parcel marked as Delivered.", "success");
      }
    } catch (error) {
      console.error("Error updating parcel status:", error);
      Swal.fire("Error!", "Could not mark parcel as Delivered.", "error");
    }
  };

  // Cancel Parcel
  const handleCancelParcel = async (parcelId) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:2000/parcels/${parcelId}/status`,
        {
          status: "canceled",
        }
      );
      if (data.modifiedCount > 0) {
        setDeliveryList((prev) =>
          prev.map((parcel) =>
            parcel._id === parcelId ? { ...parcel, status: "canceled" } : parcel
          )
        );
        Swal.fire("Success!", "Parcel status updated to Canceled.", "success");
      }
    } catch (error) {
      console.error("Error canceling parcel:", error);
      Swal.fire("Error!", "Could not cancel the parcel.", "error");
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">My Delivery List</h1>

      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Booked By</th>
              <th>Receiver Name</th>
              <th>Receiver Phone</th>
              <th>Delivery Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryList.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td>{parcel.bookedByName}</td>
                <td>{parcel.receiverName}</td>
                <td>{parcel.receiverPhone}</td>
                <td>{parcel.deliveryAddress}</td>
                <td>{parcel.status}</td>
                <td>
                  {parcel.status === "on the way" && (
                    <>
                      <button
                        onClick={() => handleMarkAsDelivered(parcel._id)}
                        className="mr-2 btn btn-sm btn-success"
                      >
                        Mark as Delivered
                      </button>
                      <button
                        onClick={() => handleCancelParcel(parcel._id)}
                        className="btn btn-sm btn-error"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyDeliveryList;
