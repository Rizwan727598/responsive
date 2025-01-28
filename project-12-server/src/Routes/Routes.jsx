import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/Home/Home";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";
// import Dashboard from "../Layout/DashboardLayout";

// User Pages
import BookParcel from "../pages/Dashboard/Users/BookParcel";
import MyParcels from "../pages/Dashboard/Users/MyParcels";
import MyProfile from "../pages/Dashboard/Users/MyProfile";

// Admin Pages
import AllParcels from "../pages/Dashboard/Admin/AllParcels";
import AllUsers from "../pages/Dashboard/Admin/AllUsers";
import AllDeliveryMen from "../pages/Dashboard/Admin/AllDeliveryMen";
import Statistics from "../pages/Dashboard/Admin/Statistics";

// Delivery Men Pages
import MyDeliveryList from "../pages/Dashboard/DeliveryMen/MyDeliveryList";
import MyReviews from "../pages/Dashboard/DeliveryMen/MyReviews";

// Payment
import Payment from "../pages/Dashboard/Users/Payment";

// Not Found
import NotFound from "../pages/Shared/NotFound/NotFound";
import Dashboard from "../Layout/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "signup",
        element: <SignUp></SignUp>,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    children: [
      // User Routes
      {
        path: "user/book-parcel",
        element: <BookParcel></BookParcel>,
      },
      {
        path: "user/my-parcels",
        element: <MyParcels></MyParcels>,
      },
      {
        path: "user/my-profile",
        element: <MyProfile></MyProfile>,
      },
      {
        path: "user/payment",
        element: <Payment></Payment>,
      },

      // Admin Routes
      {
        path: "admin/all-parcels",
        element: <AllParcels></AllParcels>,
      },
      {
        path: "admin/all-users",
        element: <AllUsers></AllUsers>,
      },
      {
        path: "admin/all-delivery-men",
        element: <AllDeliveryMen></AllDeliveryMen>,
      },
      {
        path: "admin/statistics",
        element: <Statistics></Statistics>,
      },

      // Delivery Men Routes
      {
        path: "delivery-men/my-delivery-list",
        element: <MyDeliveryList></MyDeliveryList>,
      },
      {
        path: "delivery-men/my-reviews",
        element: <MyReviews></MyReviews>,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound></NotFound>,
  },
]);
