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
                  <td>{product.image}</td>
                  <td>{product.name}</td>
                  <td>{product.category.name}</td>
                  <td>{product.description}</td>
                  <td>{product.stock}</td>
                  <td>{product.price}</td>
                  <td>
                    <div className="d-flex">
                      <div
                        onClick={() => handleDeleteProduct(product)}
                        style={{ cursor: "pointer" }}
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
                    </div>
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
