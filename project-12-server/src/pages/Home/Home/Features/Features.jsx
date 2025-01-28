import React from "react";
// import SectionTitle from "../../../components/";
import { FaLock, FaShippingFast, FaMapMarkerAlt } from "react-icons/fa";

const Features = () => {
  const features = [
    {
      id: 1,
      icon: <FaLock className="text-5xl text-orange-500" />,
      title: "Parcel Safety",
      description:
        "Your parcels are in safe hands! We ensure the highest safety standards.",
    },
    {
      id: 2,
      icon: <FaShippingFast className="text-5xl text-orange-500" />,
      title: "Super Fast Delivery",
      description:
        "We value your time. Our team ensures timely and efficient deliveries.",
    },
    {
      id: 3,
      icon: <FaMapMarkerAlt className="text-5xl text-orange-500" />,
      title: "Real-Time Tracking",
      description:
        "Track your parcels in real-time and stay updated on their status.",
    },
  ];

  return (
    <section className="my-20">
      <SectionTitle
        subHeading="Why Choose Us?"
        heading="Our Features"
      ></SectionTitle>
      <div className="grid gap-10 px-6 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="p-6 text-center bg-white rounded-lg shadow-lg"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
