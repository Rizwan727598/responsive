import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const Statistics = () => {
  const [bookingsData, setBookingsData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const { data: bookings } = await axios.get(
          "http://localhost:2000/admin/bookings-statistics"
        );
        const { data: comparison } = await axios.get(
          "http://localhost:2000/admin/booked-vs-delivered"
        );
        setBookingsData(bookings);
        setComparisonData(comparison);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  // Bar Chart Configuration for Bookings by Date
  const bookingsChartConfig = {
    series: [
      {
        name: "Bookings",
        data: bookingsData.map((item) => item.count),
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      xaxis: {
        categories: bookingsData.map((item) => item.date),
      },
      title: {
        text: "Bookings by Date",
        align: "center",
      },
    },
  };

  // Line Chart Configuration for Booked vs Delivered Parcels
  const comparisonChartConfig = {
    series: [
      {
        name: "Booked Parcels",
        data: comparisonData.map((item) => item.booked),
      },
      {
        name: "Delivered Parcels",
        data: comparisonData.map((item) => item.delivered),
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
      },
      xaxis: {
        categories: comparisonData.map((item) => item.date),
      },
      title: {
        text: "Booked vs Delivered Parcels",
        align: "center",
      },
    },
  };

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Statistics</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {/* Bookings by Date (Bar Chart) */}
        <div>
          <Chart
            options={bookingsChartConfig.options}
            series={bookingsChartConfig.series}
            type="bar"
            height={350}
          />
        </div>

        {/* Booked vs Delivered (Line Chart) */}
        <div>
          <Chart
            options={comparisonChartConfig.options}
            series={comparisonChartConfig.series}
            type="line"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
