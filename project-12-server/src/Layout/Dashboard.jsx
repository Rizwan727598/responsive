import {
  FaBox,
  FaHome,
  FaList,
  FaUsers,
  FaTruck,
  FaChartLine,
  FaUserCircle,
  FaShoppingCart,
  FaEnvelope,
} from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";

const Dashboard = () => {
  const { user } = useAuth();

  // Check roles (Admin, Delivery Men, or User)
  const [isAdmin] = useAdmin();
  const isDeliveryMen = user?.role === "delivery-men";

  return (
    <div className="flex">
      {/* Dashboard Sidebar */}
      <div className="w-64 min-h-screen text-white bg-orange-400">
        <ul className="p-4 menu">
          {/* Role-based Navigation */}
          {isAdmin ? (
            <>
              <li>
                <NavLink
                  to="/dashboard/admin/statistics"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-black bg-white p-2 rounded" : ""
                  }
                >
                  <FaChartLine />
                  Statistics
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/admin/all-parcels"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-black bg-white p-2 rounded" : ""
                  }
                >
                  <FaBox />
                  All Parcels
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/admin/all-users"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-black bg-white p-2 rounded" : ""
                  }
                >
                  <FaUsers />
                  All Users
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/admin/all-delivery-men"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-black bg-white p-2 rounded" : ""
                  }
                >
                  <FaTruck />
                  All Delivery Men
                </NavLink>
              </li>
            </>
          ) : isDeliveryMen ? (
            <>
              <li>
                <NavLink
                  to="/dashboard/delivery-men/my-delivery-list"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-black bg-white p-2 rounded" : ""
                  }
                >
                  <FaBox />
                  My Delivery List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/delivery-men/my-reviews"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-black bg-white p-2 rounded" : ""
                  }
                >
                  <FaUserCircle />
                  My Reviews
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/dashboard/user/book-parcel"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-black bg-white p-2 rounded" : ""
                  }
                >
                  <FaBox />
                  Book a Parcel
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/user/my-parcels"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-black bg-white p-2 rounded" : ""
                  }
                >
                  <FaList />
                  My Parcels
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/user/my-profile"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-black bg-white p-2 rounded" : ""
                  }
                >
                  <FaUserCircle />
                  My Profile
                </NavLink>
              </li>
            </>
          )}

          {/* Shared Links */}
          <div className="my-4 divider"></div>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "font-bold text-black bg-white p-2 rounded" : ""
              }
            >
              <FaHome />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/order/salad"
              className={({ isActive }) =>
                isActive ? "font-bold text-black bg-white p-2 rounded" : ""
              }
            >
              <FaShoppingCart />
              Book Parcel
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "font-bold text-black bg-white p-2 rounded" : ""
              }
            >
              <FaEnvelope />
              Contact
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 p-8 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
