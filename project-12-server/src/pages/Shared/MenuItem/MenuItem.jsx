import PropTypes from "prop-types";

const MenuItem = ({ item }) => {
  const { name, image, price, recipe } = item;
  return (
    <div className="flex space-x-2">
      <img
        style={{ borderRadius: "0 200px 200px 200px" }}
        className="w-[100px]"
        src={image}
        alt={name}
      />
      <div>
        <h3 className="uppercase">{name}----------</h3>
        <p>{recipe}</p>
      </div>
      <p className="text-yellow-500">${price}</p>
    </div>
  );
};

// Define PropTypes for the component
MenuItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired, // Ensure name is a string and required
    image: PropTypes.string.isRequired, // Ensure image is a string and required
    price: PropTypes.number.isRequired, // Ensure price is a number and required
    recipe: PropTypes.string, // Recipe is a string but optional
  }).isRequired,
};

export default MenuItem;
