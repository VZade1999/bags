import React, { useEffect, useState } from "react";
import { GetApi, PostApi } from "../../../api/api";

const Category = () => {
  const [category, setCategory] = useState("");
  const [charges, setCharges] = useState();
  const [deliveryCharges, setdeliverycharges] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const getList = async () => {
      try {
        const getAllCategory = await GetApi("/categorylist");
        const deliveryCharges = await GetApi("/deliverycharges");
        setCategories(getAllCategory);
        setdeliverycharges(deliveryCharges.data[deliveryCharges.data.length-1]);
      } catch (error) {
        alert(error);
      }
    };
    getList();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!category) {
      alert("Please Enter Category Name");
      return;
    }
    try {
      const createCategoryResponse = await PostApi("/createcategory", {
        category: category.toLocaleLowerCase(),
      });
      alert(createCategoryResponse.data.message);
      window.location.reload();
    } catch (error) {
      alert(error);
    }
  };
  const handleDeliveryCharges = async (e) => {
    e.preventDefault();
    if (!charges) {
      alert("Please Enter Delivery Charges");
      return;
    }
    try {
      const deliveryChargeResponse = await PostApi("/setdeliverycharges", {
        deliveryCharges: charges,
      });
      if (deliveryChargeResponse.data.status) {
        alert(`Delivery Charges set Rs ${charges}`);
        window.location.reload();
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <>
      <div className=" d-flex w-100 zindex-tooltip">
        <div className=" d-flex list-group w-50 p-3">
          <button
            type="button"
            className="list-group-item list-group-item-action bg-secondary text-white "
          >
            List of Category
          </button>

          {categories?.data?.map((category, index) => {
            return (
              <button
                key={index}
                type="button"
                className="list-group-item list-group-item-action"
              >
                {category.name}
              </button>
            );
          })}
        </div>
        <form>
          <div className="pt-3">
            <div>
              <div className="input-group input-group-lg">
                <input
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-lg"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter Category Name"
                />
                <div className="pt-1 w-100 ">
                  <button
                    onClick={handleCreateCategory}
                    className="input-group-text bg-secondary text-white"
                  >
                    Create Category
                  </button>
                </div>
              </div>
              <div className="pt-4">
                <input
                  type="number"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-lg"
                  value={charges}
                  onChange={(e) => setCharges(e.target.value)}
                  placeholder="Enter Delivery Charges"
                />
                <div className="pt-1 w-100 d-flex ">
                  <button
                    onClick={handleDeliveryCharges}
                    className="input-group-text bg-secondary text-white"
                  >
                    Set Delivery Charges
                  </button>
                  <div className="ps-4 align-self-center">
                     {deliveryCharges.deliveryCost} Rs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Category;
