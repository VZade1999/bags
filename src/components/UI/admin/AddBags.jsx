import React, { useEffect, useState } from "react";
import { GetApi, PostApi } from "../../../api/api";

const AddBags = () => {
  const [categories, setCategories] = useState([]);
  const [bagData, setBagData] = useState({
    bagName: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    image: null,
  });
  console.log(bagData);
  useEffect(() => {
    const getList = async () => {
      try {
        const getAllCategory = await GetApi("/categorylist");
        setCategories(getAllCategory);
      } catch (error) {
        alert(error);
      }
    };
    getList();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setBagData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bagData.bagName) {
      alert("Bag Name is required");
      return;
    }
    if (!bagData.price) {
      alert("Bag Price is required");
      return;
    }
    if (!bagData.stock) {
      alert("Bag Stock is required");
      return;
    }
    if (!bagData.description) {
      alert("Bag Description is required");
      return;
    }
    if (!bagData.category) {
      alert("Category is required");
      return;
    }
    //   if (!bagData.image) {
    //     alert("Image is required");
    //     return;
    //   }

    try {
      const res = await PostApi("/createproduct", {
        name: bagData.bagName,
        price: bagData.price,
        stock: bagData.stock,
        description: bagData.description,
        category: bagData.category,
      });

      if (res.data.status) {
        alert("Bag added successfully!");
        setBagData({
          bagName: "",
          price: "",
          description: "",
          category: "",
        });
      } else {
        alert("Failed to add bag! Something issue in server");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <h3 className="px-3 py-1 text-primary">Add Bag</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="d-flex justify-content-between w-100 flex-wrap">
            <div className="p-3">
              <label>Bag Name:</label>
              <input
                className="form-control"
                type="text"
                name="bagName"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                placeholder="Enter Bag name"
                value={bagData.bagName}
                onChange={handleChange}
              />
            </div>
            <div className="p-3">
              <label>Bag Price:</label>
              <input
                className="form-control"
                type="number"
                name="price"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                placeholder="Enter Bag Price"
                value={bagData.price}
                onChange={handleChange}
              />
            </div>
            <div className="p-3">
              <label>Stock</label>
              <input
                className="form-control"
                type="number"
                name="stock"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                placeholder="Enter Bag Stock"
                value={bagData.stock}
                onChange={handleChange}
              />
            </div>
            <div className="p-3">
              <label>Bag Description:</label>
              <textarea
                className="form-control"
                name="description"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
                placeholder="Enter Bag Description"
                value={bagData.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="p-3">
            <label>Select Category:</label>
            <select
              className="form-select"
              name="category"
              value={bagData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.data?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="p-3">
              <label>Upload Image: jpg, jpeg, png</label>
              <input
                className="form-control"
                type="file"
                name="image"
                accept=".jpg, .jpeg, .png"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end pe-3">
            <button className="btn btn-primary" type="submit">
              Create
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddBags;
