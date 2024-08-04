import React from 'react';
import './ModalComponent.css';
import AddBags from './AddBags';
import ViewOrders from './ViewOrders';

const ModalComponent = ({ show, data, handleClose }) => {
  if (!show) return null; // Do not render the modal if `show` is false

  // Determine modal type based on `data`
  console.log(data);
  const modalType = data && data.customerData ? "vieworder" : "addbags";

  // Function to render the appropriate component
  const renderComponent = () => {
    switch (modalType) {
      case "addbags":
        return <AddBags />;
      case "vieworder":
        return <ViewOrders orderdata={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content bg-white" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close pe-2" onClick={handleClose}>
          X
        </button>
        {renderComponent()}
      </div>
    </div>
  );
};

export default ModalComponent;
