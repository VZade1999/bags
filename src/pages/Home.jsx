import React from "react";
import Slider from 'react-slick';

import Helmet from "../components/Helmet/Helmet.js";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";

import heroImg from "../assets/images/hero_1.png";
// Your image imports

import heroImg2 from '../assets/images/ava-1.jpg';
import heroImg3 from '../assets/images/hero_img.png';
import heroImg4 from '../assets/images/service-01.png';
import "../styles/hero-section.css";

import { Link } from "react-router-dom";

import "../styles/home.css";


import whyImg from "../assets/images/hero_2.png";

import networkImg from "../assets/images/hero_5.png";

import TestimonialSlider from "../components/UI/slider/TestimonialSlider.jsx";
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};


const Home = () => {
  return (
    <Helmet title="Home">
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero__content  ">
                <h5 className="mb-3">Easy way to make an order</h5>
                <h1 className="mb-4 hero__title">
                  <span>Welcome to BagHaven</span>
                  <p>Your Ultimate Destination for Bags!</p>
                </h1>

                <p>
                  At BagHaven, we believe that the perfect bag is more than just
                  an accessory; it's an expression of your unique style and
                  personality.
                </p>

                <div className="hero__btns d-flex align-items-center gap-5 mt-4">
                  <button className="order__btn d-flex align-items-center justify-content-between">
                    <Link to="/bags">
                      Order now <i class="ri-arrow-right-s-line"></i>
                    </Link>
                  </button>

                  <button className="all__foods-btn">
                    <Link to="/bags">Check All Bags</Link>
                  </button>
                </div>

                <div className=" hero__service  d-flex align-items-center gap-5 mt-5 ">
                  <p className=" d-flex align-items-center gap-2 ">
                    <span className="shipping__icon">
                      <i class="ri-car-line"></i>
                    </span>{" "}
                    Low shipping charge
                  </p>

                  <p className=" d-flex align-items-center gap-2 ">
                    <span className="shipping__icon">
                      <i class="ri-shield-check-line"></i>
                    </span>{" "}
                    100% secure checkout
                  </p>
                </div>
              </div>
            </Col>

            <Col lg="6" md="6">
          <div className="hero__img w-75">
            <Slider {...settings}>
              <div>
                <img src={heroImg} alt="hero-img-1" className="w-100" />
              </div>
              <div>
                <img src={heroImg2} alt="hero-img-2" className="w-100" />
              </div>
              <div>
                <img src={heroImg3} alt="hero-img-3" className="w-100" />
              </div>
              <div>
                <img src={heroImg4} alt="hero-img-4" className="w-100" />
              </div>
            </Slider>
          </div>
        </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h5 className="feature__subtitle mb-4">
                Why Choose Devesh Bags?
              </h5>
              <h2 className="feature__title">Quality Craftsmanship,</h2>
              <h2 className="feature__title">
                Customer Satisfaction, <span> & Variety</span>
              </h2>
              <p className="mb-1 mt-4 feature__text">
                At Devesh Bags, we're passionate about bags and dedicated to
                providing our customers with the best shopping experience.
              </p>
              <p className="feature__text">
                Founded with the mission to offer stylish, high-quality bags at
                affordable prices, we take pride in our diverse collection that
                caters to every style and need.{" "}
              </p>
            </Col>
            {/* 
            {featureData.map((item, index) => (
              <Col lg="4" md="6" sm="6" key={index} className="mt-5">
                <div className="feature__item text-center px-5 py-3">
                  <img
                    src={item.imgUrl}
                    alt="feature-img"
                    className="w-25 mb-3"
                  />
                  <h5 className=" fw-bold mb-3">{item.title}</h5>
                  <p>{item.desc}</p>
                </div>
              </Col>
            ))} */}
          </Row>
        </Container>
      </section>

      <section className="why__choose-us">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <img src={whyImg} alt="why-tasty-treat" className="w-75" />
            </Col>

            <Col lg="6" md="6">
              <div className="why__tasty-treat">
                <h2 className="tasty__treat-title mb-4">
                  <span>Featured Categories</span>
                </h2>
                <p className="tasty__treat-desc">
                  Explore our latest arrivals and find your new favorite bag.
                  From timeless classics to the latest trends, our collection is
                  designed to meet your needs and exceed your expectations. Each
                  bag is made with high-quality materials, ensuring durability
                  and style that lasts.
                </p>

                <ListGroup className="mt-4">
                  <ListGroupItem className="border-0 ps-0">
                    <p className=" choose__us-title d-flex align-items-center gap-2 ">
                      <i class="ri-checkbox-circle-line"></i> Handbags:
                    </p>
                    <p className="choose__us-desc">
                      Elegant and versatile, our handbags are perfect for any
                      outfit, from casual to formal.
                    </p>
                  </ListGroupItem>

                  <ListGroupItem className="border-0 ps-0">
                    <p className="choose__us-title d-flex align-items-center gap-2 ">
                      <i class="ri-checkbox-circle-line"></i> Backpacks:
                    </p>
                    <p className="choose__us-desc">
                      Stylish and practical, our backpacks are ideal for school,
                      work, or travel.
                    </p>
                  </ListGroupItem>

                  <ListGroupItem className="border-0 ps-0">
                    <p className="choose__us-title d-flex align-items-center gap-2 ">
                      <i class="ri-checkbox-circle-line"></i>Clutches:
                    </p>
                    <p className="choose__us-desc">
                      Add a touch of glamour to your evening look with our chic
                      clutches.
                    </p>
                  </ListGroupItem>
                </ListGroup>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" >
              <div className="testimonial ">
                <h5 className="testimonial__subtitle mb-4">Testimonial</h5>
                <h2 className="testimonial__title mb-4">
                  What our <span>customers</span> are saying
                </h2>
                <p className="testimonial__desc">
                  Explore our latest arrivals and find your new favorite bag.
                  From timeless classics to the latest trends, our collection is
                  designed to meet your needs and exceed your expectations. Each
                  bag is made with high-quality materials, ensuring durability
                  and style that lasts.
                </p>

                <TestimonialSlider />
              </div>
            </Col>

            <Col lg="6" md="6">
              <img src={networkImg} alt="testimonial-img" className="w-75" />
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Home;
