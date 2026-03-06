import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  const phoneNumber = '+918714763920'; // Your WhatsApp number
  const message = 'Hello! I would like to know more about your construction services.'; // Default message

  const handleClick = () => {
    // Format phone number (remove spaces, + sign)
    const formattedNumber = phoneNumber.replace(/[^0-9]/g, '');
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      className="whatsapp-button"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <button onClick={handleClick} aria-label="Chat on WhatsApp">
        <FaWhatsapp />
      </button>
      <span className="whatsapp-tooltip">Chat with us</span>
    </motion.div>
  );
};

export default WhatsAppButton;