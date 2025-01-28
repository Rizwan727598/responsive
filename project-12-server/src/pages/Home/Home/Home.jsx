import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Banner from "../Banner/Banner";
import Testimonials from "../Testimonials/Testimonials";
import Statistics from "../Statistics/Statistics";
import Features from "./Features/Features";

const Home = () => {
  const [deliveryMen, setDeliveryMen] = useState([]);

  useEffect(() => {
    const fetchDeliveryMen = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:2000/delivery-men/top"
        );
        setDeliveryMen(data);
      } catch (error) {
        console.error("Error fetching top delivery men:", error);
      }
    };
    fetchDeliveryMen();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Parcel Management | Home</title>
      </Helmet>
      <Banner />
      <Features />
      <Statistics />
      <Testimonials />
    </div>
  );
};

export default Home;
