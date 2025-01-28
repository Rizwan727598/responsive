import { useEffect, useState } from "react";
// import { useAuth } from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import axios from "axios";
import { Link } from "react-router-dom";

const MyParcels = () => {
  const { user } = useAuth();
  const [parcels, setParcels] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch user parcels
  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:2000/user-parcels/${user.id}`
        );
        setParcels(data);
      } catch (error) {
        console.error("Error fetching parcels:", error);
      }
    };
    fetchParcels();
  }, [user]);

  // Handle Cancel Booking
  const handleCancel = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axios.patch(
            `http://localhost:2000/cancel-parcel/${id}`
          );
          if (data.success) {
            setParcels((prev) =>
              prev.map((parcel) =>
                parcel._id === id ? { ...parcel, status: "canceled" } : parcel
              )
            );
            Swal.fire(
              "Canceled!",
              "Your parcel booking has been canceled.",
              "success"
            );
          }
        } catch (error) {
          Swal.fire(
            "Error!",
            "Failed to cancel the parcel. Try again later.",
            "error"
          );
        }
      }
    });
  };

  // Filter parcels by status
  const filteredParcels = parcels.filter((parcel) =>
    statusFilter ? parcel.status === statusFilter : true
  );

  return (
    <div className="p-6 mx-auto bg-white rounded shadow max-w-7xl">
      <h1 className="mb-4 text-2xl font-bold">My Parcels</h1>

      {/* Filter by Status */}
      <div className="flex justify-end mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="on the way">On The Way</option>
          <option value="delivered">Delivered</option>
          <option value="returned">Returned</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* Parcel Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-collapse border-gray-200 table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Parcel Type</th>
              <th className="px-4 py-2 border">Booking Date</th>
              <th className="px-4 py-2 border">Requested Date</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredParcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{parcel.parcelType}</td>
                <td className="px-4 py-2 border">
                  {new Date(parcel.bookingDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(parcel.requestedDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 capitalize border">{parcel.status}</td>
                <td className="px-4 py-2 border">
                  {/* Update Button */}
                  <button
                    disabled={parcel.status !== "pending"}
                    className={`btn ${
                      parcel.status === "pending"
                        ? "btn-primary"
                        : "btn-disabled"
                    } mr-2`}
                  >
                    <Link to={`/dashboard/update-parcel/${parcel._id}`}>
                      Update
                    </Link>
                  </button>
                  {/* Cancel Button */}
                  <button
                    disabled={parcel.status !== "pending"}
                    className="mr-2 btn btn-danger"
                    onClick={() => handleCancel(parcel._id)}
                  >
                    Cancel
                  </button>
                  {/* Review Button */}
                  {parcel.status === "delivered" && (
                    <button className="btn btn-success">
                      <Link to={`/dashboard/review/${parcel._id}`}>Review</Link>
                    </button>
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

export default MyParcels;
