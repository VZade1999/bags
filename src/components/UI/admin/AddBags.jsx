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
    images: [], // Array to hold multiple images
  });
  const [imagePreviews, setImagePreviews] = useState([]); // Array to hold image previews

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
    if (name === "images") {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      const fileArray = Array.from(files);

      // Check for invalid file types
      const invalidFiles = fileArray.filter(
        (file) => !validTypes.includes(file.type)
      );

      if (invalidFiles.length > 0) {
        alert("Only jpg, jpeg, and png files are allowed.");
        return;
      }

      // Append new files to the existing images array
      setBagData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...fileArray],
      }));

      // Generate image previews and append them to the existing previews array
      const previewArray = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previewArray]);
    } else {
      setBagData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setBagData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, index) => index !== indexToRemove),
    }));
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToRemove)
    );
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

    try {
      const formData = new FormData();
      formData.append("name", bagData.bagName);
      formData.append("price", bagData.price);
      formData.append("stock", bagData.stock);
      formData.append("description", bagData.description);
      formData.append("category", bagData.category);

      // Append each image file to the FormData
      bagData.images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await PostApi("/createproduct", formData);

      if (res.data.status) {
        alert("Bag added successfully!");
        setBagData({
          bagName: "",
          price: "",
          stock: "",
          description: "",
          category: "",
          images: [], // Reset images array after submission
        });
        setImagePreviews([]); // Reset image previews
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
              <label>
                Upload Images: jpg, jpeg, png (You can select multiple)
              </label>
              <input
                className="form-control"
                type="file"
                name="images"
                accept=".jpg, .jpeg, .png"
                multiple
                onChange={handleChange}
              />
            </div>
            <div>
              <ul className="list-unstyled d-flex flex-wrap">
                {imagePreviews.length > 0 &&
                  imagePreviews.map((src, index) => (
                    <li
                      key={index}
                      className="position-relative me-2 mb-2 ms-2"
                      style={{ width: "70px", height: "70px" }}
                    >
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 start-100 translate-middle"
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          fontSize: "12px",
                          padding: "0",
                          lineHeight: "20px",
                        }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
              </ul>
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
