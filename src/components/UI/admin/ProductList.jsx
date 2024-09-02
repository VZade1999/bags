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

  const handleDeleteProduct = async (e) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the product "${e.name}"?`
    );
    if (confirmed) {
      try {
        const deleteProduct = await PostApi("/deleteproduct", {
          id: e._id,
        });
        window.location.reload();
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <>
      <div className="border border-primary">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Image</th>
              <th scope="col">Product Name</th>
              <th scope="col">Category</th>
              <th scope="col">Description</th>
              <th scope="col">Weight</th>
              <th scope="col">Packing Charges</th>
              <th scope="col">Stock</th>
              <th scope="col">Price</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td className="w-25">
                    {" "}
                    <img
                      src={`http://localhost:5000/${product.images[0]}`}
                      alt="Product"
                      style={{width:"50px"}}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category.name}</td>
                  <td>{product.description}</td>
                  <td>{product.weight}</td>
                  <td>{product.packingcharges}</td>
                  <td>{product.stock}</td>
                  <td>{product.price}</td>
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
                            fill-rule="evenodd"
                            d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      {/* <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                          width="20"
                          height="20"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </div> */}
                    </div>
                    <div></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductList;
