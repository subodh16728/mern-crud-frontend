import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookie from "js-cookie";
import { SingleProduct } from "../utils/model";
import { BASE_URL } from "../services/helper";

const Product = () => {
  const [productData, setProductData] = useState<SingleProduct>({
    name: "",
    category: "",
    price: "",
    description: "",
    features: [],
  });
  const params = useParams();
  const productID = params.id;
  const token = Cookie.get("token");

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/products/${productID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProductData(response.data);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  return (
    <div
      className="product-container mx-auto"
      style={{
        width: "600px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h4 className="text-center border-bottom border-dark pb-1">
        Product Details
      </h4>
      <div className="my-3">
        <p>
          <strong>Name:</strong>&nbsp;
          <span>{productData.name}</span>
        </p>
        <p>
          <strong>Category:</strong>&nbsp;
          <span>{productData.category}</span>
        </p>
        <p>
          <strong>Price:</strong>&nbsp;
          <span>${productData.price}</span>
        </p>
        <p>
          <strong>Description:</strong>&nbsp;
          <span>{productData.description}</span>
        </p>
        <p>
          <strong>Features:</strong>
        </p>
        <ul>
          {productData.features.map((feature, index) => (
            <>
              <li key={index}>
                <strong>{feature.title}: </strong> {feature.value}
              </li>
            </>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Product;
