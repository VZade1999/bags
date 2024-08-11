import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
        <h5>Privacy Policy</h5>
        <p>At Devesh Bags, your privacy is important to us.</p>
        <p>
          This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you visit our website or make a
          purchase.
        </p>
        <h6>1. Information We Collect</h6>
        <p>
          <strong>Personal Information:</strong> We collect personal information
          such as your name, email address, phone number, and shipping address
          when you place an order or create an account.
        </p>
        <p>
          <strong>Payment Information:</strong> Payment details, including
          credit/debit card information, are processed by third-party payment
          processors and are not stored on our servers.
        </p>
        <p>
          <strong>Usage Data:</strong> We may collect information about your
          interaction with our website, including IP addresses, browser type,
          and pages visited.
        </p>
        <h6>2. How We Use Your Information</h6>
        <p>
          <strong>To Process Orders:</strong> We use your personal information
          to process and fulfill your orders, including shipping and billing.
        </p>
        <p>
          <strong>To Improve Our Services:</strong> We may use usage data to
          analyze and improve our website and product offerings.
        </p>
        <p>
          <strong>To Communicate with You:</strong> We may send you promotional
          emails or newsletters if you have opted-in to receive them. You can
          opt-out at any time.
        </p>
        <h6>3. How We Share Your Information</h6>
        <p>
          <strong>Service Providers:</strong> We may share your information with
          third-party service providers who assist us in processing payments,
          shipping orders, or providing customer support.
        </p>
        <p>
          <strong>Legal Requirements:</strong> We may disclose your information
          if required to do so by law or in response to legal requests.
        </p>
        <h6>4. Data Security</h6>
        <p>
          We implement appropriate security measures to protect your personal
          information from unauthorized access, alteration, disclosure, or
          destruction. However, no method of transmission over the internet is
          100% secure.
        </p>
        <h6>5. Your Rights</h6>
        <p>
          <strong>Access and Correction:</strong> You have the right to access
          and correct your personal information. You can request this by
          contacting us at [Your Email Address].
        </p>
        <p>
          <strong>Opt-Out:</strong> You may opt-out of receiving marketing
          communications from us at any time by following the instructions in
          the email or contacting us directly.
        </p>
        <h6>6. Changes to Privacy Policy</h6>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page, and your continued use of the website
          constitutes acceptance of the revised policy.
        </p>
        <h6>7. Contact Us</h6>
        <p>
          If you have any questions or concerns about this Privacy Policy,
          please contact us at:
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

export default PrivacyPolicy;
