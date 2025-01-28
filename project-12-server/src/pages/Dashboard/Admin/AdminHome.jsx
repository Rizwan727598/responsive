import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaBox, FaDollarSign, FaUsers, FaTruck } from "react-icons/fa";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
} from "recharts";

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch statistics
  const { data: stats = {} } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data;
    },
  });

  // Fetch chart data
  const { data: chartData = [] } = useQuery({
    queryKey: ["parcel-category-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcel-category-stats");
      return res.data;
    },
  });

  // Pie chart data processing
  const pieChartData = chartData.map((data) => ({
    name: data.category,
    value: data.revenue,
  }));

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold">
        Welcome Back, {user?.displayName || "Admin"}!
      </h2>

      {/* Statistics Section */}
      <div className="grid grid-cols-2 gap-6 mb-8 shadow stats lg:grid-cols-4">
        <div className="stat">
          <div className="stat-figure text-primary">
            <FaDollarSign className="text-3xl" />
          </div>
          <div className="stat-title">Revenue</div>
          <div className="stat-value">${stats.revenue || 0}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <FaUsers className="text-3xl" />
          </div>
          <div className="stat-title">Users</div>
          <div className="stat-value">{stats.users || 0}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <FaBox className="text-3xl" />
          </div>
          <div className="stat-title">Parcels</div>
          <div className="stat-value">{stats.totalParcels || 0}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-warning">
            <FaTruck className="text-3xl" />
          </div>
          <div className="stat-title">Delivered Parcels</div>
          <div className="stat-value">{stats.deliveredParcels || 0}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Bar Chart */}
        <div className="w-full lg:w-1/2">
          <h3 className="mb-4 text-lg font-semibold">Parcels by Category</h3>
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Bar dataKey="quantity" fill="#8884d8" label={{ position: "top" }}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </div>

        {/* Pie Chart */}
        <div className="w-full lg:w-1/2">
          <h3 className="mb-4 text-lg font-semibold">Revenue by Category</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
