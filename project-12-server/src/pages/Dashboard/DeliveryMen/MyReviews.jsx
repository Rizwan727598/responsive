import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { FaStar } from "react-icons/fa";

const MyReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/reviews/${user?.email}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (user?.email) {
      fetchReviews();
    }
  }, [user?.email]);

  return (
    <div className="my-10">
      <h2 className="mb-6 text-3xl font-bold text-center">My Reviews</h2>
      {reviews.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-4 bg-white border rounded-lg shadow-md"
            >
              <div className="flex items-center mb-2">
                <img
                  src={review.userImage}
                  alt={review.userName}
                  className="w-10 h-10 mr-3 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold">{review.userName}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`${
                      index < review.rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700">{review.feedback}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No reviews found.</p>
      )}
    </div>
  );
};

export default MyReviews;
