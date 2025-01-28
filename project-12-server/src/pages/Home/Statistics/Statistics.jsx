import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import axios from "axios";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";

const Statistics = () => {
  const [stats, setStats] = useState({
    totalParcelsBooked: 0,
    totalParcelsDelivered: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("http://localhost:2000/statistics");
        setStats(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      id: 1,
      title: "Total Parcels Booked",
      value: stats.totalParcelsBooked,
    },
    {
      id: 2,
      title: "Total Parcels Delivered",
      value: stats.totalParcelsDelivered,
    },
    {
      id: 3,
      title: "Total Registered Users",
      value: stats.totalUsers,
    },
  ];

  return (
    <section className="my-20">
      <SectionTitle subHeading="Our Growth" heading="Statistics"></SectionTitle>
      <div className="grid gap-10 px-6 md:grid-cols-3">
        {statsData.map((stat) => (
          <div
            key={stat.id}
            className="p-6 text-center bg-white rounded-lg shadow-lg"
          >
            <h3 className="mb-2 text-5xl font-bold text-orange-500">
              <CountUp end={stat.value} duration={2} />
            </h3>
            <p className="text-xl font-semibold">{stat.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statistics;
