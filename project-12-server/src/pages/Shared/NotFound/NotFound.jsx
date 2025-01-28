import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 bg-gray-100">
      <h1 className="text-6xl font-bold text-orange-500">404</h1>
      <p className="mt-4 text-2xl font-semibold">Page Not Found</p>
      <p className="mt-2 text-lg text-gray-600">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-2 mt-6 text-white bg-orange-500 rounded-md hover:bg-orange-600"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
