import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../store/shopping-cart/cartSlice";
import ReactPaginate from "react-paginate";
import { GetApi } from "../api/api";
import "../styles/product-details.css";
import Image from "../assets/images/product_common.png";
import Image2 from "../assets/images/devesh_bag_logo.png";

const FoodDetails = () => {
  const [tab, setTab] = useState("desc");
  const [enteredName, setEnteredName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [previewImg, setPreviewImg] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.productsData.products);
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Get product from the store or localStorage
  const product = useMemo(() => {
    let foundProduct = products.find((product) => product.id == id);
    console.log(foundProduct);

    if (!foundProduct) {
      const storedProducts = JSON.parse(localStorage.getItem("products"));
      foundProduct = storedProducts
        ? storedProducts.find((p) => p.id === id)
        : null;
    }

    return foundProduct;
  }, [products, id]);

  // Save products to localStorage
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (product) {
      setPreviewImg(Image || Image);
    }
    window.scroll(200, 200);
  }, [product]);

  const addToCart = () => {
    if (product) {
      const cartItem = cartItems.find((item) => item.id === product.id);
      const currentQuantity = cartItem ? cartItem.quantity : 0;

      if (currentQuantity + 1 > product.stock) {
        alert(`Only ${product.stock} ${product.title} available now.`);
        return;
      }

      dispatch(
        cartActions.addItem({
          id: product.id,
          title: product.title,
          price: product.price,
          image01: Image || Image,
          desc: product.desc,
        })
      );
    }
  };

  const handleDecrement = () => {
    dispatch(cartActions.removeItem(id));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log({
      name: enteredName,
      email: enteredEmail,
      message: reviewMsg,
    });
    setEnteredName("");
    setEnteredEmail("");
    setReviewMsg("");
  };

  useEffect(() => {
    if (product && product.category) {
      const fetchRelatedProducts = async () => {
        const response = await GetApi(`/related-products/${product.category}`);
        if (response && response.data) {
          setRelatedProducts(response.data);
          setTotalPages(Math.ceil(response.data.length / 4));
        }
      };
      fetchRelatedProducts();
    }
  }, [product]);

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  const paginatedRelatedProducts = relatedProducts.slice(
    pageNumber * 4,
    (pageNumber + 1) * 4
  );

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Helmet title="Product-details">
      <CommonSection title={product.title} />
      <section>
        <div className="ps-5 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary mb-3"
          >
            Back
          </button>
        </div>

        <Container>
          <Row>
            <Col lg="2" md="2">
              <div className="product__images">
                <div
                  className="img__item mb-3"
                  onClick={() => setPreviewImg(Image || Image)}
                >
                  <img src={Image || Image} alt="Product" className="w-50" />
                </div>
                {product.image02 && (
                  <div
                    className="img__item mb-3"
                    onClick={() => setPreviewImg(product.image02)}
                  >
                    <img src={product.image02} alt="Product" className="w-50" />
                  </div>
                )}
                {Image2 && (
                  <div
                    className="img__item"
                    onClick={() => setPreviewImg(Image2)}
                  >
                    <img src={Image2} alt="Product" className="w-50" />
                  </div>
                )}
              </div>
            </Col>

            <Col lg="4" md="4">
              <div className="product__main-img">
                <img src={previewImg} alt="Product" className="w-100" />
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="single__product-content">
                <h2 className="product__title mb-3">{product.title}</h2>
                <p className="product__price">
                  Price: <span>Rs {product.price}</span>
                </p>
                <p className="category mb-5">
                  Category: <span>{product.category}</span>
                </p>

                {product.stock === 0 ? (
                  <button
                    className="addTOCart__btn py-2 bg-danger"
                    style={{ width: "25%" }}
                  >
                    Out of Stock
                  </button>
                ) : cartItems.find((item) => item.id === product.id) ? (
                  <div
                    className="d-flex addTOCart__btn custom_btn"
                    style={{ width: "25%" }}
                  >
                    <span className="ps-3" onClick={handleDecrement}>
                      <i
                        style={{ cursor: "pointer" }}
                        className="ri-subtract-line"
                      ></i>
                    </span>
                    <span className="ps-3">
                      {
                        cartItems.find((item) => item.id === product.id)
                          .quantity
                      }
                    </span>
                    <span className="ps-3" onClick={addToCart}>
                      <i
                        style={{ cursor: "pointer" }}
                        className="ri-add-line"
                      ></i>
                    </span>
                  </div>
                ) : (
                  <button
                    className="addTOCart__btn py-2"
                    onClick={addToCart}
                    style={{ width: "25%" }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </Col>

            <Col lg="12">
              <div className="tabs d-flex align-items-center gap-5 py-3">
                <h6
                  className={`${tab === "desc" ? "tab__active" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Description
                </h6>
              </div>

              {tab === "desc" ? (
                <div className="tab__content">
                  <p>{product.desc}</p>
                </div>
              ) : (
                <div className="tab__form mb-3">
                  <form className="form" onSubmit={submitHandler}>
                    <div className="form__group">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={enteredName}
                        onChange={(e) => setEnteredName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form__group">
                      <input
                        type="text"
                        placeholder="Enter your email"
                        value={enteredEmail}
                        onChange={(e) => setEnteredEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form__group">
                      <textarea
                        rows={5}
                        placeholder="Write your review"
                        value={reviewMsg}
                        onChange={(e) => setReviewMsg(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="addTOCart__btn">
                      Submit
                    </button>
                  </form>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default FoodDetails;
