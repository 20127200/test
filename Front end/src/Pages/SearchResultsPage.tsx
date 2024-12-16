import React from "react";
import { useLocation } from "react-router-dom";

function SearchResultsPage() {
  const location = useLocation();
  const { results } = location.state || {};

  return (
    <div className="container">
      <h1>Search Results</h1>
      {results && results.length > 0 ? (
        results.map(
          (item: {
            _id: React.Key | null | undefined;
            name:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            description:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
            price:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | null
              | undefined;
          }) => (
            <div key={item._id} className="search-result-item">
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <p>Price: {item.price}đ</p>
            </div>
          )
        )
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default SearchResultsPage;
