import React, { useState } from "react";
import { Input } from "@mui/material";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import baseURL from "../../../shared/baseURL";

const SearchBar = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchClients = async (query) => {
    const url = `${baseURL}client/search?search=${query}`;
    const response = await fetch(url);
    const data = await response.json();
    return data; // Return data to useQuery
  };

  // Use useQuery to fetch data with search query
  const { data, isLoading, isError } = useQuery(
    ["searchClients", query],  // Query key includes query to refetch on query change
    () => fetchClients(query),  // Use fetchClients with query as a parameter
    {
      enabled: query.length > 0,  // Fetch only if the query length is greater than 0
    }
  );

  // Update search results with data from useQuery
  React.useEffect(() => {
    if (data) {
      setSearchResults(data); // Set search results when data changes
    }
  }, [data]);

  const handleSelectUser = (user) => {
    onSelect(user);
    setQuery(""); // Clear the search bar
    navigate(`/admin/client_details/${user._id}`); // Navigate to user details page
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 shadow-md border border-gray-300 rounded-lg w-full"
      />
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error fetching results</div>}
      {searchResults.length > 0 && (
        <div className="absolute left-0 mt-1 w-full bg-white rounded-lg shadow-lg">
          {searchResults.map((user) => (
            <div 
              key={user._id} 
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelectUser(user)} // Use handleSelectUser function
            >
              {user.name} {user.username} ({user.email}) {user.phone}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
