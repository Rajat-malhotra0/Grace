//A resuable button component 
import React from 'react';
import './Button.css';

function Button({ text, onClick, className = '' }) {
  return (
    <button className={`grace-button ${className}`} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;