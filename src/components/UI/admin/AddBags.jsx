import React, { useEffect, useState } from "react";
import { GetApi, PostApi } from "../../../api/api";

const AddBags = () => {
  const [categories, setCategories] = useState([]);
  const [bagData, setBagData] = useState({
    bagName: "",
    weight: "",
    packingCharges: "",
    category: "",
    images: [],
    colors: [],
    descriptions: {
      shortDescription: "",
      longDescription: "",
      features: "", // Additional description fields can be added here
    },
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [colorPrice, setColorPrice] = useState(499);

  useEffect(() => {
    const getList = async () => {
      try {
        const getAllCategory = await GetApi("/categorylist");
        setCategories(getAllCategory.data);
      } catch (error) {
        alert("Failed to fetch categories: " + error.message);
      }
    };
    getList();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      const fileArray = Array.from(files);

      const invalidFiles = fileArray.filter(
        (file) => !validTypes.includes(file.type)
      );
      if (invalidFiles.length > 0) {
        alert("Only jpg, jpeg, and png files are allowed.");
        return;
      }

      setBagData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...fileArray],
      }));

      const previewArray = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previewArray]);
    } else if (name.startsWith("descriptions.")) {
      const field = name.split(".")[1]; // Extract the field name
      setBagData((prevData) => ({
        ...prevData,
        descriptions: {
          ...prevData.descriptions,
          [field]: value,
        },
      }));
    } else {
      setBagData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddColor = () => {
    if (selectedQuantity <= 0 || colorPrice <= 0) {
      alert("Please specify a valid quantity and price.");
      return;
    }

    const colorEntry = {
      color: selectedColor,
      quantity: selectedQuantity,
      price: colorPrice,
    };

    if (!bagData.colors.some((colorObj) => colorObj.color === selectedColor && colorObj.quantity === selectedQuantity)) {
      setBagData((prevData) => ({
        ...prevData,
        colors: [...prevData.colors, colorEntry],
      }));
    } else {
      alert("Color and quantity combination already selected.");
    }

    setSelectedQuantity(1);
    setColorPrice(0);
  };

  const handleRemoveColor = (indexToRemove) => {
    setBagData((prevData) => ({
      ...prevData,
      colors: prevData.colors.filter((_, index) => index !== indexToRemove),
    }));
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

    if (
      !bagData.bagName ||
      !bagData.weight ||
      !bagData.category ||
      !bagData.images.length ||
      !bagData.packingCharges ||
      !bagData.colors.length ||
      !bagData.descriptions.shortDescription || // Check for short description
      !bagData.descriptions.longDescription // Check for long description
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", bagData.bagName);
      formData.append("weight", bagData.weight);
      formData.append("packingCharges", bagData.packingCharges);
      formData.append("category", bagData.category);
      formData.append("colors", JSON.stringify(bagData.colors));
      formData.append("descriptions", JSON.stringify(bagData.descriptions)); // Include descriptions in the payload

      bagData.images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await PostApi("/createproduct", formData);

      if (res.data.status) {
        alert("Bag added successfully!");
        setBagData({
          bagName: "",
          weight: "",
          packingCharges: "",
          category: "",
          images: [],
          colors: [],
          descriptions: {
            shortDescription: "",
            longDescription: "",
            features: "",
          },
        });
        setImagePreviews([]);
        setSelectedColor("#000000");
        setSelectedQuantity(1);
        setColorPrice(0);
      } else {
        alert(
          "Failed to add bag! " +
            (res.data.message || "Something went wrong on the server.")
        );
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <>
      <h3 className="px-3 py-1 text-primary">Add Bag</h3>
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between w-100 flex-wrap">
          <div className="p-3">
            <label>Bag Name:</label>
            <input
              className="form-control"
              type="text"
              name="bagName"
              placeholder="Enter Bag name"
              value={bagData.bagName}
              onChange={handleChange}
            />
          </div>

          <div className="p-3">
            <label>Short Description:</label>
            <textarea
              className="form-control"
              name="descriptions.shortDescription"
              placeholder="Enter Short Description"
              value={bagData.descriptions.shortDescription}
              onChange={handleChange}
            />
          </div>

          <div className="p-3">
            <label>Long Description:</label>
            <textarea
              className="form-control"
              name="descriptions.longDescription"
              placeholder="Enter Long Description"
              value={bagData.descriptions.longDescription}
              onChange={handleChange}
            />
          </div>

          <div className="p-3">
            <label>Bag Weight:</label>
            <input
              className="form-control"
              type="number"
              name="weight"
              placeholder="Bag Weight in Grams"
              value={bagData.weight}
              onChange={handleChange}
            />
          </div>
          <div className="p-3">
            <label>Packing Charges:</label>
            <input
              className="form-control"
              type="number"
              name="packingCharges"
              placeholder="Packing Charges"
              value={bagData.packingCharges}
              onChange={handleChange}
            />
          </div>

          {/* Color, Quantity, and Price Input Table */}
          <div className="p-3">
            <label>Select Bag Color, Quantity, and Price:</label>
            <div className="d-flex align-items-center mb-2">
              <input
                className="form-control me-2"
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              />
              <input
                className="form-control me-2"
                type="number"
                placeholder="Quantity"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(Number(e.target.value))}
              />
              <input
                className="form-control me-2"
                type="number"
                placeholder="Price"
                value={colorPrice}
                onChange={(e) => setColorPrice(Number(e.target.value))}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddColor}
              >
                Add Color
              </button>
            </div>
            {/* Table to display selected colors, quantities, and prices */}
            <table className="table">
              <thead>
                <tr>
                  <th>Color</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bagData.colors.map((colorObj, index) => (
                  <tr key={index}>
                    <td style={{ backgroundColor: colorObj.color }}>{colorObj.color}</td>
                    <td>{colorObj.quantity}</td>
                    <td>{colorObj.price}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleRemoveColor(index)}
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            {categories?.map((category) => (
              <option key={category?.id} value={category._id}>
                {category?.name}
              </option>
            ))}
          </select>
        </div>

        <div className="p-3">
          <label>Upload Images:</label>
          <input
            className="form-control"
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
          />
          <div className="d-flex flex-wrap mt-2">
            {imagePreviews.map((src, index) => (
              <div key={index} className="me-2 mb-2 position-relative">
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-danger btn-sm position-absolute"
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    fontSize: "12px",
                    padding: "0",
                    lineHeight: "20px",
                    top: "5px",
                    right: "5px",
                  }}
                  onClick={() => handleRemoveImage(index)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-end pe-3">
          <button className="btn btn-primary" type="submit">
            Create
          </button>
        </div>
      </form>
    </>
  );
};

export default AddBags;
