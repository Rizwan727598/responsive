import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Cover from "../../Shared/Cover/Cover";
import MenuItem from "../../Shared/MenuItem/MenuItem";

const MenuCategory = ({ items, title, img }) => {
  return (
    <div className="pt-8">
      {title && <Cover img={img} title={title}></Cover>}
      <div className="grid gap-10 my-16 md:grid-cols-2">
        {items.map((item) => (
          <MenuItem key={item._id} item={item}></MenuItem>
        ))}
      </div>
      <Link to={`/order/${title}`}>
        <button className="mt-4 border-0 border-b-4 btn btn-outline">
          Order Now
        </button>
      </Link>
    </div>
  );
};

// Define PropTypes for the component
MenuCategory.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired, // Ensure each item has an _id
      name: PropTypes.string, // Add other properties expected in each item if applicable
      price: PropTypes.number,
      image: PropTypes.string,
    })
  ).isRequired, // Ensure items is required and properly structured
  title: PropTypes.string, // Title can be null/optional, so it's not required
  img: PropTypes.string, // Image can be null/optional, so it's not required
};

export default MenuCategory;
