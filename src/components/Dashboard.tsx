import React, { useState, useEffect, ChangeEvent } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
// import $ from "jquery";
// import "tablesorter";
import axios from "axios";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DefaultProductStructure,
  JwtHeader,
  RestParameter,
} from "../utils/model";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "../App.css";
import { BASE_URL } from "../services/helper";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productData, setProductData] = useState<DefaultProductStructure[]>([]);
  const token = Cookie.get("token");
  let userID: string;
  if (token) {
    const decodedToken: JwtHeader = jwtDecode(token);
    userID = decodedToken._id;
  }

  useEffect(() => {
    // $("#sort-table").tablesorter();
    fetchProducts();
  }, [searchQuery]);

  // Fetch all product details
  const fetchProducts = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/products?search=${searchQuery}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setProductData(response.data);
  };

  // Function to handle Bookmarks Add/Remove
  const handleBookmark = async (singleProduct: DefaultProductStructure) => {
    const productID = singleProduct._id;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/bookmarks/add`,
        { userID: userID, products: [{ productID: productID }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const bookmarkMessage = response.data.message;
      const bookMarkStatus = response.status;
      if (bookMarkStatus === 201) {
        toast.success(bookmarkMessage);
      } else {
        toast.info(bookmarkMessage);
      }
    } catch (error) {
      toast.error(`Error: Try again!`);
    }
  };

  const handleDelete = async (singleProduct: DefaultProductStructure) => {
    const productID = singleProduct._id;
    if (window.confirm("Do you really want to delete this product?")) {
      try {
        const response = await axios.delete(
          `${BASE_URL}/api/products/delete/${productID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 204) {
          toast.info(`Product deleted successfully`);
          fetchProducts();
        }
      } catch (error) {
        toast.error(`Error: Try again!`);
      }
    }
  };

  // set Search query
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Debouncing the search results
  const debounce = (searchWrapper: Function, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return function (...args: RestParameter[]) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        searchWrapper(...args);
      }, delay);
    };
  };

  const debouncedSearch = debounce(handleChange, 250);

  return (
    <>
      <div className="container mt-5">
        <Container>
          <Form>
            <InputGroup className="my-3">
              <Form.Control
                type="text"
                onChange={debouncedSearch}
                placeholder="Search products..."
                className="me-1"
              />
              <Button variant="secondary">
                <NavLink className="nav-link active" to="/products/add">
                  Add Product
                </NavLink>
              </Button>
            </InputGroup>
          </Form>

          <table id="sort-table" className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            {productData && productData.length > 0 ? (
              <tbody>
                {productData.map((item, index) => (
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
                    <td className="action-width">
                      {/* Bookmark product */}
                      <OverlayTrigger
                        overlay={(props) => (
                          <Tooltip {...props}>Bookmark</Tooltip>
                        )}
                        placement="top"
                      >
                        <a
                          className="text-dark"
                          role="button"
                          onClick={() => handleBookmark(item)}
                        >
                          <i className={`bi-bookmark me-2`}></i>
                        </a>
                      </OverlayTrigger>

                      {/* Edit product */}
                      <OverlayTrigger
                        overlay={(props) => <Tooltip {...props}>Edit</Tooltip>}
                        placement="top"
                      >
                        <NavLink
                          className="text-dark"
                          to={`/products/edit/${item._id}`}
                        >
                          <i className="bi bi-pencil-square me-2"></i>
                        </NavLink>
                      </OverlayTrigger>

                      {/* Delete product */}
                      <OverlayTrigger
                        overlay={(props) => (
                          <Tooltip {...props}>Delete</Tooltip>
                        )}
                        placement="top"
                      >
                        <a
                          className="text-dark"
                          role="button"
                          onClick={() => handleDelete(item)}
                        >
                          <i className={`bi bi-trash3-fill`}></i>
                        </a>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center">
                    No Results
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </Container>
      </div>
      <Outlet />
    </>
  );
};

export default Dashboard;
