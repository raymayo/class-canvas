import React from 'react';

const Modal = ({ isOpen, onClose, title, children, modalStyle }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className={`bg-white rounded-lg p-8 z-50 relative ${modalStyle}`}>
        <h2 className="text-2xl font-medium font-clash mb-4">{title}</h2>
        <div className='h-5/6'>{children}</div>
        <button className="mt-4 px-4 py-2 bg-neutral-900 text-neutral-50 text-sm rounded-md absolute bottom-4 right-4" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
