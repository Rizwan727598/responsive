const Featured = ({ deliveryMen }) => {
  return (
    <div className="pt-8 my-20 text-white bg-fixed featured-item">
      <h2 className="mb-10 text-4xl font-bold text-center">Top Delivery Men</h2>
      <div className="grid gap-8 px-8 md:grid-cols-3">
        {deliveryMen.map((man) => (
          <div
            key={man._id}
            className="flex flex-col items-center p-4 text-black bg-white rounded shadow-md"
          >
            <img
              src={man.image}
              alt={man.name}
              className="w-32 h-32 mb-4 rounded-full"
            />
            <h3 className="mb-2 text-2xl font-bold">{man.name}</h3>
            <p>Parcels Delivered: {man.parcelsDelivered}</p>
            <p>Average Rating: {man.averageRating.toFixed(1)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Featured;
