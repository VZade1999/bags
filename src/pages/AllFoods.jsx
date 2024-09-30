import React, { useState, useEffect, useMemo } from "react";
import Helmet from "../components/Helmet/Helmet";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../store/Products/productsSlice";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import ProductCard from "../components/UI/product-card/ProductCard";
import ReactPaginate from "react-paginate";
import CategoryButton from "../components/UI/CategoryButton/CategoryButton";
import { GetApi } from "../api/api";

import "../styles/all-foods.css";
import "../styles/pagination.css";

const AllBags = () => {
  const productList = useSelector((state) => state.productsData.products);
  const cartProducts = useSelector((state) => state.cart.cartItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [category, setCategory] = useState("ALL");
  const [sortOption, setSortOption] = useState("Default");
  const dispatch = useDispatch();

  // Transform products to match the expected format
  const transformProducts = (products) => {
    return products?.map((product) => ({
      id: product._id,
      title: product.name,
      image01: product.images[0] || "", // Get the first image
      category: product.category.name,
      desc:
        product.descriptions?.shortDescription || "No description available", // Safely access shortDescription
      ShortDesc:
        product.descriptions?.shortDescription ||
        "No short description available",
      LongDesc:
        product.descriptions?.longDescription ||
        "No long description available",
      weight: product.weight,
      packingCharges: product.packingcharges,
      colors: product.colors.map((color) => ({
        color: color.color,
        quantity: color.quantity,
        price: color.price,
        _id: color._id, // Include color _id if needed
      })),
    }));
  };

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const allProducts = await GetApi("/productlist");
        const updatedProducts = transformProducts(allProducts.data);
        dispatch(setProducts(updatedProducts));
      } catch (error) {
        alert(error);
      }
    };

    getAllProducts();
  }, [dispatch]);

  // Create cartMap based on both product ID and color _id
  const cartMap = useMemo(() => {
    return cartProducts.reduce((acc, item) => {
      if (item.colors) {
        // Map the quantity by color _id if the product has colors
        item.colors.forEach((color) => {
          acc[color._id] = color.quantity;
        });
      } else {
        acc[item.id] = item.quantity;
      }
      return acc;
    }, {});
  }, [cartProducts]);

  // Updated data with quantities merged into the colors
  const updatedData = useMemo(() => {
    return productList?.map((item) => ({
      ...item,
      colors: item.colors.map((color) => ({
        ...color,
        quantity: cartMap[color._id] || color.quantity, // Use cartMap quantity if available
      })),
    }));
  }, [productList, cartMap]);

  // Filtered products based on the selected category
  const filteredProducts = useMemo(() => {
    if (category === "ALL") {
      return updatedData;
    }
    return updatedData.filter(
      (item) => item.category?.toLowerCase() === category?.toLowerCase()
    );
  }, [category, updatedData]);

  // Searched products based on search term
  const searchedProduct = useMemo(() => {
    return filteredProducts.filter((item) =>
      item.title?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
  }, [searchTerm, filteredProducts]);

  // Sorting function
  const sortProducts = (products) => {
    switch (sortOption) {
      case "ascending":
        return products.sort((a, b) => a.title.localeCompare(b.title));
      case "descending":
        return products.sort((a, b) => b.title.localeCompare(a.title));
      case "high-price":
        return products.sort((a, b) => b.colors[0].price - a.colors[0].price);
      case "low-price":
        return products.sort((a, b) => a.colors[0].price - b.colors[0].price);
      case "in-stock":
        return products.sort(
          (a, b) => b.colors[0].quantity - a.colors[0].quantity
        );
      default:
        return products;
    }
  };

  const sortedProducts = useMemo(
    () => sortProducts([...searchedProduct]),
    [searchedProduct, sortOption]
  );

  const productPerPage = 24;
  const visitedPage = pageNumber * productPerPage;
  const displayPage = sortedProducts.slice(
    visitedPage,
    visitedPage + productPerPage
  );

  const pageCount = Math.ceil(sortedProducts.length / productPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <Helmet title="All Bags">
      <CommonSection title="All Bags" />
      <section className="pt-3">
        <div>
          <Col lg="12">
            <div className="mt-0 food__category d-flex align-items-center justify-content-center gap-4">
              <button
                className={`all__btn ${
                  category === "ALL" ? "foodBtnActive" : ""
                }`}
                onClick={() => setCategory("ALL")}
              >
                All
              </button>

              {updatedData.length > 0 &&
                [...new Set(updatedData.map((item) => item.category))].map(
                  (cat) => (
                    <CategoryButton
                      key={cat}
                      allData={cat}
                      setCategory={setCategory}
                      category={category}
                    />
                  )
                )}
            </div>
          </Col>
        </div>
        <Container>
          <Row className="pt-3">
            <Col lg="6" md="6" sm="6" xs="12">
              <div className="search__widget d-flex align-items-center justify-content-between">
                <input
                  type="text"
                  placeholder="I'm looking for...."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>
            <Col lg="6" md="6" sm="6" xs="12" className="mb-5">
              <div className="sorting__widget text-end">
                <select
                  className="w-50"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="Default">Default</option>
                  <option value="low-price">Low Price</option>
                  <option value="high-price">High Price</option>
                  <option value="in-stock">In Stock</option>
                  <option value="ascending">Alphabetically, A-Z</option>
                  <option value="descending">Alphabetically, Z-A</option>
                </select>
              </div>
            </Col>
            {displayPage.map((item) => (
              <Col
                lg="3"
                md="3"
                sm="3"
                xs="12"
                key={item.id}
                className="mb-4 px-3 px-sm-2"
              >
                <ProductCard item={item} />
              </Col>
            ))}
            <div>
              <ReactPaginate
                pageCount={pageCount}
                onPageChange={changePage}
                previousLabel={"Prev"}
                nextLabel={"Next"}
                containerClassName="paginationBttns"
              />
            </div>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default AllBags;
