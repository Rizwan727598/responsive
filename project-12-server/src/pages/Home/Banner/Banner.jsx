import { useState } from "react";
import axios from "axios";

const Banner = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:2000/search-parcels?query=${searchText}`
      );
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching parcels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative h-screen bg-center bg-cover"
      style={{
        backgroundImage: `url('https://via.placeholder.com/1920x1080')`,
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white bg-black bg-opacity-50">
        <h1 className="mb-4 text-5xl font-bold animate-fadeIn">
          Welcome to Parcel Management
        </h1>
        <p className="mb-6 text-lg animate-slideUp">
          Book your parcels securely and get them delivered fast!
        </p>
        <div className="flex w-full max-w-lg shadow-lg">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by parcel type, receiver name..."
            className="w-full p-3 text-black rounded-l-md focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="p-3 text-white transition-all bg-orange-500 hover:bg-orange-600 rounded-r-md"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
        {searchResults.length > 0 && (
          <div className="w-full max-w-lg p-4 mt-4 text-black bg-white rounded-md shadow-lg">
            <h3 className="mb-2 font-bold">Search Results:</h3>
            <ul>
              {searchResults.map((parcel) => (
                <li key={parcel._id} className="py-2 border-b">
                  {parcel.parcelType} - {parcel.receiverName}
                </li>
              ))}
            </ul>
          </div>
        )}
        {searchResults.length === 0 && !isLoading && searchText && (
          <div className="w-full max-w-lg p-4 mt-4 text-black bg-white rounded-md shadow-lg">
            <h3 className="mb-2 font-bold">No results found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;
