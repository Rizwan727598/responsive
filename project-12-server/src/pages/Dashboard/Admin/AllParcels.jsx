import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AllParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [filterDates, setFilterDates] = useState({ from: "", to: "" });
  const [searchStatus, setSearchStatus] = useState("");

  useEffect(() => {
    // Fetch all parcels
    const fetchParcels = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:2000/admin/all-parcels"
        );
        setParcels(data);
      } catch (error) {
        console.error("Error fetching parcels:", error);
      }
    };

    // Fetch delivery men
    const fetchDeliveryMen = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:2000/admin/all-delivery-men"
        );
        setDeliveryMen(data);
      } catch (error) {
        console.error("Error fetching delivery men:", error);
      }
    };

    fetchParcels();
    fetchDeliveryMen();
  }, []);

  const handleFilter = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:2000/admin/all-parcels?from=${filterDates.from}&to=${filterDates.to}`
      );
      setParcels(data);
    } catch (error) {
      console.error("Error filtering parcels:", error);
    }
  };

  const handleSearch = () => {
    const filtered = parcels.filter((parcel) =>
      parcel.status.toLowerCase().includes(searchStatus.toLowerCase())
    );
    setParcels(filtered);
  };

  const handleAssign = async (
    parcelId,
    deliveryManId,
    approximateDeliveryDate
  ) => {
    try {
      const res = await axios.patch(
        `http://localhost:2000/admin/assign-delivery`,
        {
          parcelId,
          deliveryManId,
          approximateDeliveryDate,
        }
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire(
          "Assigned!",
          "Delivery person has been assigned successfully.",
          "success"
        );
        setParcels((prev) =>
          prev.map((parcel) =>
            parcel._id === parcelId
              ? { ...parcel, status: "On The Way", deliveryManId }
              : parcel
          )
        );
      }
    } catch (error) {
      console.error("Error assigning delivery person:", error);
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">All Parcels</h1>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="date"
          value={filterDates.from}
          onChange={(e) =>
            setFilterDates({ ...filterDates, from: e.target.value })
          }
          className="input input-bordered"
        />
        <input
          type="date"
          value={filterDates.to}
          onChange={(e) =>
            setFilterDates({ ...filterDates, to: e.target.value })
          }
          className="input input-bordered"
        />
        <button onClick={handleFilter} className="btn btn-primary">
          Filter by Date
        </button>
        <input
          type="text"
          placeholder="Search by status"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="input input-bordered"
        />
        <button onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
      </div>

      {/* Parcels Table */}
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Phone</th>
              <th>Booking Date</th>
              <th>Requested Delivery Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td>{parcel.userName}</td>
                <td>{parcel.userPhone}</td>
                <td>{new Date(parcel.bookingDate).toLocaleDateString()}</td>
                <td>
                  {new Date(parcel.requestedDeliveryDate).toLocaleDateString()}
                </td>
                <td>{parcel.status}</td>
                <td>
                  <button
                    onClick={() =>
                      Swal.fire({
                        title: "Assign Delivery Person",
                        html: `
                          <select id="deliveryMan" class="swal2-select">
                            ${deliveryMen
                              .map(
                                (man) =>
                                  `<option value="${man._id}">${man.name}</option>`
                              )
                              .join("")}
                          </select>
                          <input type="date" id="approxDeliveryDate" class="swal2-input">
                        `,
                        preConfirm: () => {
                          const deliveryManId =
                            document.getElementById("deliveryMan").value;
                          const approximateDeliveryDate =
                            document.getElementById("approxDeliveryDate").value;
                          return { deliveryManId, approximateDeliveryDate };
                        },
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handleAssign(
                            parcel._id,
                            result.value.deliveryManId,
                            result.value.approximateDeliveryDate
                          );
                        }
                      })
                    }
                    className="btn btn-sm btn-primary"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllParcels;
