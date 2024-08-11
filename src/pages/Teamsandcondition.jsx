import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Teamsandcondition = () => {
  const navigate = useNavigate();

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])

  const handleBackClick = () => {
    navigate(-1); // Goes back to the previous page
  };

  return (
    <>
      <div className="container mt-5">
        <button
          onClick={handleBackClick}
          className="btn btn-secondary mb-3"
        >
          Back
        </button>
        <h1>Terms and Conditions</h1>
        <p>Welcome to Devesh Bags!</p>
        <p>
          These Terms and Conditions outline the rules and regulations for using the Devesh Bags website, operated by [Your Company Name]. By accessing or using our website, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully.
        </p>
        <h6>1. Introduction</h6>
        <p>
          Welcome to Devesh Bags. Our website is designed to help you browse and purchase a range of bags. By using our site, you agree to be bound by these Terms and Conditions, as well as our Privacy Policy.
        </p>
        <h6>2. User Accounts</h6>
        <p>
          To place an order, you may need to create an account on our website. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
        </p>
        <h6>3. Products and Orders</h6>
        <p>
          <strong>Product Information:</strong> We strive to ensure that all product descriptions, images, and prices on our website are accurate. However, there may be errors or inaccuracies, and we reserve the right to correct them.
        </p>
        <p>
          <strong>Order Acceptance:</strong> Your order is not considered accepted until we have processed it and sent you a confirmation email. We reserve the right to refuse or cancel any order for reasons including product availability or pricing errors.
        </p>
        <h6>4. Payment and Pricing</h6>
        <p>
          <strong>Payment Methods:</strong> We accept various payment methods, including credit/debit cards and other electronic payments.
        </p>
        <p>
          <strong>Pricing:</strong> All prices are listed in Indian Rupees (INR) and are subject to change without notice. Taxes and shipping fees are additional where applicable.
        </p>
        <h6>5. Shipping and Delivery</h6>
        <p>
          <strong>Shipping Costs:</strong> Shipping costs will be calculated based on the delivery address and order size.
        </p>
        <p>
          <strong>Delivery Times:</strong> Delivery times may vary based on your location and the availability of the product. We strive to deliver your order within the estimated time frame, but delays may occur.
        </p>
        <h6>6. Returns and Refunds</h6>
        <p>
          <strong>Return Policy:</strong> We accept returns within [X] days of delivery for eligible items. The returned items must be in their original condition and packaging.
        </p>
        <p>
          <strong>Refunds:</strong> Refunds will be processed to the original payment method once we receive and inspect the returned items. Shipping fees are non-refundable.
        </p>
        <h6>7. Intellectual Property</h6>
        <p>
          All content on Devesh Bags, including text, graphics, logos, and images, is the property of [Your Company Name] and is protected by copyright and trademark laws. You may not use or reproduce any content without our prior written consent.
        </p>
        <h6>8. Limitation of Liability</h6>
        <p>
          Devesh Bags is not liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability is limited to the amount paid for the products in question.
        </p>
        <h6>9. Governing Law</h6>
        <p>
          These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in [Your City], India.
        </p>
        <h6>10. Changes to Terms</h6>
        <p>
          We reserve the right to modify these Terms and Conditions at any time. Any changes will be posted on this page, and your continued use of the website constitutes acceptance of the revised terms.
        </p>
        <h6>11. Contact Us</h6>
        <p>
          If you have any questions or concerns about these Terms and Conditions, please contact us at:
        </p>
        <p>Email: [Your Email Address]</p>
        <p>Phone: 090968 50150</p>
        <p>
          Address: Plot No.5484/2C, Gopalkrishna Chinmay Part 2nd, Opp. Renuka
          Temple, Abhay Nagar, Sangli Maharashtra.
        </p>
      </div>
    </>
  );
};

export default Teamsandcondition;
