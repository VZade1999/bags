import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../store/shopping-cart/cartSlice";
import "../styles/product-details.css";
import Image from "../assets/images/product_common.png";

const FoodDetails = () => {
  const [tab, setTab] = useState("desc");
  const [previewImg, setPreviewImg] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null); // Track the selected color

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((state) => state.productsData.products);
  const cartItems = useSelector((state) => state.cart.cartItems); // Get cart items from Redux store

  // Find the product based on id
  const product = useMemo(() => {
    let foundProduct = products.find((product) => product.id === id);
    if (!foundProduct) {
      const storedProducts = JSON.parse(localStorage.getItem("products"));
      foundProduct = storedProducts
        ? storedProducts.find((p) => p.id === id)
        : null;
    }
    return foundProduct;
  }, [products, id]);

  // Set default color and image when the product changes
  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]); // Default to the first color
      setPreviewImg(product.image01); // Default to the first image
    }
    window.scroll(0, 0); // Scroll to top when the product changes
  }, [product]);

  // Save products to localStorage
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  // Add to cart functionality with color handling
  const addToCart = () => {
    if (!selectedColor) return;

    // Dispatch product details to Redux store
    dispatch(
      cartActions.addItem({
        id: product.id,
        title: product.title,
        price: selectedColor.price, // Price based on the selected color
        image01: product.image01 || Image,
        desc: product.desc,
        color: selectedColor.color, // Adding color to the cart
        weight: product.weight,
        quantity: 1,
        AvlQuantity: selectedColor.quantity, // Product quantity based on selected color
      })
    );
  };

  const handleColorChange = (colorOption) => {
    setSelectedColor(colorOption); // Update selected color when a color is clicked
  };

  // Check if the selected color of the product is already in the cart
  const isProductInCart = useMemo(() => {
    return cartItems.some(
      (item) => item.id === product?.id && item.color === selectedColor?.color
    );
  }, [cartItems, product, selectedColor]);

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
            {/* Product Images */}
            <Col lg="2" md="2">
              <div className="product__images">
                {product.image01 ? (
                  <div
                    className="img__item mb-3"
                    onClick={() => setPreviewImg(product.image01)}
                  >
                    <img
                      src={`https://bagsbe-production.up.railway.app/${product.image01}`}
                      alt="Product"
                      className="w-50"
                    />
                  </div>
                ) : (
                  <div className="img__item mb-3">
                    <img src={Image} alt="Product" className="w-50" />
                  </div>
                )}
              </div>
            </Col>

            {/* Main Image */}
            <Col lg="4" md="4">
              <div className="product__main-img">
                <img
                  src={`https://bagsbe-production.up.railway.app/${previewImg}`}
                  alt="Product"
                  className="w-100"
                />
              </div>
            </Col>

            {/* Product Details */}
            <Col lg="6" md="6">
              <div className="single__product-content">
                <h2 className="product__title mb-3">{product.title}</h2>
                <p className="product__price">
                  Price: <span>Rs {selectedColor?.price}</span>
                </p>
                <p className="category mb-5">
                  Category: <span>{product.category}</span>
                </p>

                {/* Color Options */}
                <div className="d-flex gap-2 pb-4">
                  {product.colors.map((colorOption) => (
                    <button
                      key={colorOption._id}
                      className={`color__btn ${
                        selectedColor && selectedColor._id === colorOption._id
                          ? "selected"
                          : ""
                      }`}
                      style={{
                        backgroundColor: colorOption.color,
                        border: "1px solid #000",
                        width: "30px",
                        height: "30px",
                      }}
                      onClick={() => handleColorChange(colorOption)}
                    ></button>
                  ))}
                </div>

                <div className="pb-2">
                  Selected Colour:{" "}
                  <span
                    style={{
                      backgroundColor: selectedColor?.color,
                      width: "30px",
                      height: "30px",
                      display: "inline-block",
                      marginLeft: "10px",
                    }}
                  ></span>
                </div>

                {/* Add to Cart or View Cart Button */}
                {isProductInCart ? (
                  <div>
                    <button
                      className="addTOCart__btn py-2 bg-success"
                      onClick={() => navigate("/cart")} // Navigate to cart page
                    >
                      View Cart
                    </button>
                    <p>Product already in cart</p>
                  </div>
                ) : selectedColor?.quantity === 0 ? (
                  <button className="addTOCart__btn py-2 bg-danger" disabled>
                    Out of Stock
                  </button>
                ) : (
                  <button className="addTOCart__btn py-2" onClick={addToCart}>
                    Add to Cart
                  </button>
                )}
              </div>
            </Col>

            {/* Description Tab */}
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
                  <div>
                    <p>{product.ShortDesc}</p>
                  </div>
                  <div>
                    <p>{product.LongDesc}</p>
                  </div>
                </div>
              ) : null}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default FoodDetails;
