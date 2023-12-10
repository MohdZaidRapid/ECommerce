import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";

const Search = () => {
  const [values] = useSearch();

  // Check if values.results is an array and not empty
  const hasResults =
    Array.isArray(values?.results) && values.results.length > 0;

  return (
    <Layout title="Search results">
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {!hasResults
              ? "No Products Found"
              : `Found ${values.results.length}`}
          </h6>

          {hasResults && (
            <div className="d-flex flex-wrap mt-4">
              {values.results.map((p) => (
                <div
                  key={p._id}
                  className="card m-2"
                  style={{ width: "18rem" }}
                >
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description.substring(0, 3)}...
                    </p>
                    <p className="card-text"> $ {p.price}</p>
                    <a href="#" className="btn btn-primary ms-1">
                      More details
                    </a>
                    <button href="#" className="btn btn-secondary ms-1">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
