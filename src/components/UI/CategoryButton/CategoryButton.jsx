import React from "react";
import foodCategoryImg01 from "../../../assets/images//bag_icon.png";

const CategoryButton = ({ category, allData, changeCategory }) => {
  return (
    <>
      <button
        key={allData.id}
        className={`d-flex align-items-center gap-2 ${
          category === allData.CategoryName?.toLowerCase()
            ? "foodBtnActive"
            : ""
        } `}
        onClick={() => changeCategory(allData.CategoryName)}
      >
        <img src={foodCategoryImg01} alt="something" />
        {allData.CategoryName?.charAt(0).toUpperCase() +
          allData.CategoryName?.slice(1)}
      </button>
    </>
  );
};

export default CategoryButton;
