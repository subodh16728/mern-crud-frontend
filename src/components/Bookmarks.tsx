import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
// import $ from 'jquery';
import "tablesorter";
import axios from "axios";
import Cookie from "js-cookie";
import { DefaultProductStructure } from "../utils/model";
import { NavLink } from "react-router-dom";
import { BASE_URL } from "../services/helper";

const Bookmarks = () => {
  const [productData, setProductData] = useState<DefaultProductStructure[]>([]);
  const token = Cookie.get("token");
  const userID = Cookie.get("userID");

  useEffect(() => {
    // $("#sort-table").tablesorter();
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/bookmarks?userID=${userID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const bookmarkedProductIds = response.data.products;
      const bookmarkedItems = bookmarkedProductIds.map(
        async (item: { productID: any }) => {
          const bookmarkedProductResponse = await axios.get(
            `${BASE_URL}/api/products/id?productID=${item.productID}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return bookmarkedProductResponse.data;
        }
      );

      const bookmarkedProducts = await Promise.all(bookmarkedItems);
      setProductData(bookmarkedProducts);
    } catch (error) {
      console.error(error);
    }
  };

  // Add or remove bookmark
  const handleBookmark = async (data: DefaultProductStructure) => {
    const productID = data._id;

    try {
      await axios.post(
        `${BASE_URL}/api/bookmarks/add`,
        { userID: userID, products: [{ productID: productID }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookmarks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container mt-5">
        <Container>
          <table id="sort-table" className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Bookmarks</th>
              </tr>
            </thead>
            {productData && productData.length > 0 ? (
              <tbody>
                {productData.map(
                  (item, index) =>
                    item && (
                      <tr key={index}>
                        <td>
                          <NavLink
                            className={`text-muted`}
                            to={`/product/${item._id}`}
                          >
                            {item.name}
                          </NavLink>
                        </td>
                        <td>{item.description}</td>
                        <td>{item.category}</td>
                        <td>{item.price}</td>
                        <td className="text-center">
                          <a
                            className="text-dark"
                            href="javascript:void(0)"
                            onClick={() => handleBookmark(item)}
                          >
                            <i className="bi-bookmark-fill"></i>
                          </a>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center">
                    No Bookmarks
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </Container>
      </div>
    </>
  );
};

export default Bookmarks;
