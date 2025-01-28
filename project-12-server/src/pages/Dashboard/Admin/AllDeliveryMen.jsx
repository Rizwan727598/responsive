import React, { useEffect, useState } from "react";
import axios from "axios";

const AllDeliveryMen = () => {
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const deliveryMenPerPage = 5;

  useEffect(() => {
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

    fetchDeliveryMen();
  }, []);

  // Pagination
  const indexOfLastDeliveryMan = currentPage * deliveryMenPerPage;
  const indexOfFirstDeliveryMan = indexOfLastDeliveryMan - deliveryMenPerPage;
  const currentDeliveryMen = deliveryMen.slice(
    indexOfFirstDeliveryMan,
    indexOfLastDeliveryMan
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">All Delivery Men</h1>

      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Parcels Delivered</th>
              <th>Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {currentDeliveryMen.map((deliveryMan, index) => (
              <tr key={deliveryMan._id}>
                <td>{indexOfFirstDeliveryMan + index + 1}</td>
                <td>{deliveryMan.name}</td>
                <td>{deliveryMan.phone || "N/A"}</td>
                <td>{deliveryMan.parcelsDelivered || 0}</td>
                <td>{deliveryMan.averageRating?.toFixed(2) || "No Reviews"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(deliveryMen.length / deliveryMenPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`btn btn-sm ${
                currentPage === i + 1 ? "btn-primary" : ""
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default AllDeliveryMen;
