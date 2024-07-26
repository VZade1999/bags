import React from "react";
import Slider from "react-slick";

import ava01 from "../../../assets/images/ava-1.jpg";
import ava02 from "../../../assets/images/ava-2.jpg";
import ava03 from "../../../assets/images/ava-3.jpg";

import "../../../styles/slider.css";

const TestimonialSlider = () => {
  const settings = {
    dots: true,
    autoplay: true,
    infinite: true,
    speed: 1000,
    autoplaySpeed: 3000,
    swipeToSlide: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings}>
      <div>
        <p className="review__text">
          "I absolutely love my new handbag from BagHaven! It's stylish, durable, and I've received so many compliments on it."
        </p>
        <div className=" slider__content d-flex align-items-center gap-3 ">
          <img src={ava01} alt="avatar" className=" rounded" />
          <h6>Anandrao Mahajan</h6>
        </div>
      </div>
      <div>
        <p className="review__text">
          "The backpack I purchased is perfect for my daily commute. It's roomy, comfortable, and looks great!"
        </p>
        <div className="slider__content d-flex align-items-center gap-3 ">
          <img src={ava02} alt="avatar" className=" rounded" />
          <h6>Sumit Kalyan</h6>
        </div>
      </div>
      <div>
        <p className="review__text">
          "Devesh Bags offers amazing quality at such reasonable prices. I've bought several bags and have been thrilled with each one."
        </p>
        <div className="slider__content d-flex align-items-center gap-3 ">
          <img src={ava03} alt="avatar" className=" rounded" />
          <h6>Mayur Patil</h6>
        </div>
      </div>
    </Slider>
  );
};

export default TestimonialSlider;
