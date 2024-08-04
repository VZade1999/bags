import React, { useState, useEffect, useMemo } from "react";
import Helmet from "../components/Helmet/Helmet";
import { useSelector, useDispatch } from "react-redux";
import {setProducts} from '../store/Products/productsSlice'
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import ProductCard from "../components/UI/product-card/ProductCard";
import ReactPaginate from "react-paginate";
import CategoryButton from "../components/UI/CategoryButton/CategoryButton";
import { GetApi, PostApi } from "../api/api";

import "../styles/all-foods.css";
import "../styles/pagination.css";

const AllBags = () => {
  const products = useSelector((state) => state.productsData.products);
  const cartProducts = useSelector((state) => state.cart.cartItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [category, setCategory] = useState("ALL");
  const dispatch =useDispatch();

  const transformProducts = (products) => {
    return products?.map((product) => ({
      id: product._id,
      title: product.name,
      price: product.price,
      image01: product.image ? product.image : "default_image.png", // Default image if none provided
      category: product.category.name,
      desc: product.description,
    }));
  };

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const allProducst = await GetApi("/productlist");
        dispatch(setProducts(transformProducts(allProducst.data)))
      } catch (error) {
        alert(error);
      }
    };

    getAllProducts();
  }, []);

  const cartMap = useMemo(() => {
    return cartProducts.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {});
  }, [cartProducts]);

  const updatedData = useMemo(() => {
    return products?.map((item) => ({
      ...item,
      quantity: cartMap[item.id] || 0,
    }));
  }, [products, cartMap]);

  const Categories = useMemo(() => {
    const categories = updatedData.map((item) => {
      return {
        id: item.id,
        CategoryName: item.category,
      };
    });
    return categories.reduce((acc, current) => {
      if (!acc.some((item) => item.CategoryName === current.CategoryName)) {
        acc.push(current);
      }
      return acc;
    }, []);
  }, [updatedData]);

  const [allProducts, setAllProducts] = useState(updatedData);

  useEffect(() => {
    if (category === "ALL") {
      setAllProducts(updatedData);
    } else {
      const filteredProducts = updatedData.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
      setAllProducts(filteredProducts);
    }
  }, [category, updatedData]);

  const searchedProduct = allProducts.filter((item) => {
    if (searchTerm === "") {
      return item;
    }
    if (item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return item;
    } else {
      return null;
    }
  });

  const productPerPage = 24;
  const visitedPage = pageNumber * productPerPage;
  const displayPage = searchedProduct.slice(
    visitedPage,
    visitedPage + productPerPage
  );

  const pageCount = Math.ceil(searchedProduct.length / productPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const changeCategory = (selectedCategory) => {
    console.log(selectedCategory.toLowerCase());
    setCategory(selectedCategory.toLowerCase());
  };

  return (
    <Helmet title="All-Foods">
      <CommonSection title="All Bags" />
      <section className="pt-3">
        <div>
          <Col lg="12">
            <div className=" mt-0 food__category d-flex align-items-center justify-content-center gap-4 ">
              <button
                className={`all__btn  ${
                  category === "ALL" ? "foodBtnActive" : ""
                } `}
                onClick={() => setCategory("ALL")}
              >
                All
              </button>

              {Categories.map((item) => (
                <CategoryButton
                  key={item.id}
                  allData={item}
                  setCategory={setCategory}
                  changeCategory={changeCategory}
                  category={category}
                />
              ))}
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
                <select className="w-50">
                  <option>Default</option>
                  <option value="ascending">Alphabetically, A-Z</option>
                  <option value="descending">Alphabetically, Z-A</option>
                  <option value="high-price">High Price</option>
                  <option value="low-price">Low Price</option>
                </select>
              </div>
            </Col>
            {/* <Col lg="3" md="4" sm="6" xs="6" key={item.id} className="mb-4"> */}
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
