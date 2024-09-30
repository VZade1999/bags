import React, { useEffect, useState } from "react";
import { PostApi, GetApi } from "../../../api/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const productListResponse = await GetApi("/productlist");
        setProducts(productListResponse.data);
      } catch (error) {
        alert(error);
      }
    };
    getAllProducts();
  }, []);

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the product "${product.name}"?`
    );
    if (confirmed) {
      try {
        await PostApi("/deleteproduct", {
          id: product._id,
        });
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p._id !== product._id)
        );
      } catch (error) {
        alert(error);
      }
    }
  };

  console.log(products);

  return (
    <>
      <div className="border border-primary">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Image</th>
              <th scope="col">Product Name</th>
              <th scope="col">Category</th>
              <th scope="col">Description</th>
              <th scope="col">Weight</th>
              <th scope="col">Packing Charges</th>
              <th scope="col">Details</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => {
              return (
                <React.Fragment key={product._id}>
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td className="w-25">
                      <img
                        src={`https://bagsbe-production.up.railway.app/${product.images[0]}`}
                        alt="Product"
                        style={{ width: "50px" }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category.name}</td>
                    <td>
                      Short-{product.descriptions.shortDescription} Long-
                      {product.descriptions.longDescription}
                    </td>
                    <td>{product.weight}</td>
                    <td>{product.packingcharges}</td>
                    <td>
                      {product.colors.map((colorObj, colorIndex) => (
                        <div
                          key={colorIndex}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          {colorObj.quantity === 0 ? (
                            <div
                              style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: colorObj.color,
                                border: "1px solid #000",
                                marginRight: "5px",
                                position: "relative",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  color: "white",
                                  backgroundColor: "red",
                                  padding: "4px 8px",
                                  borderRadius: "5px",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // Add shadow for depth
                                  textAlign: "center",
                                  letterSpacing: "0.5px", // Improve letter spacing for readability
                                }}
                              >
                                OOS
                              </span>
                            </div>
                          ) : (
                            <>
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  backgroundColor: colorObj.color,
                                  border: "1px solid #000",
                                  marginRight: "5px",
                                }}
                              ></div>
                              <span>
                                <strong>Color:</strong> {colorObj.color},
                                <strong> Quantity:</strong> {colorObj.quantity},
                                <strong> Price:</strong> ${colorObj.price}
                              </span>
                            </>
                          )}
                        </div>
                      ))}
                    </td>

                    <td>
                      <div className="d-flex">
                        <div
                          onClick={() => handleDeleteProduct(product)}
                          style={{ cursor: "pointer" }}
                          className="pe-3"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductList;
