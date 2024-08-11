import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Paymentpolicyandreturnpolicy = () => {
  const navigate = useNavigate();

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])

  const handleBackClick = () => {
    navigate(-1); // Goes back to the previous page
  };

  return (
    <>
      <div className="container my-4">
        <button
          onClick={handleBackClick}
          className="btn btn-secondary mb-3"
        >
          Back
        </button>
        <h6>Payment Policy</h6>
        <p>Welcome to Devesh Bags! Our Payment Policy is designed to provide clarity and security for your transactions.</p>

        <h6>1. Payment Methods</h6>
        <p>
          We accept a variety of payment methods including credit/debit cards and other electronic payment methods. 
          All transactions are processed securely using industry-standard encryption technology to protect your payment information.
        </p>

        <h6>2. Pricing</h6>
        <p>
          All prices on our website are listed in Indian Rupees (INR) and are subject to change without prior notice. 
          Taxes and shipping costs, if applicable, are additional and will be calculated at checkout.
        </p>

        <h6>3. Payment Processing</h6>
        <p>
          Payment will be processed at the time of checkout. If you experience any issues with your payment, please contact us 
          immediately for assistance.
        </p>

        <h6>4. Security</h6>
        <p>
          We take your security seriously and use secure encryption technology to safeguard your payment details. 
          For any concerns regarding payment security, please contact us at [Your Email Address].
        </p>

        <h6>5. Refunds</h6>
        <p>
          Refunds are processed based on our Return Policy. Please refer to the Return Policy for more details on how refunds 
          are handled.
        </p>
      </div>
    </>
  );
};

export default Paymentpolicyandreturnpolicy;
