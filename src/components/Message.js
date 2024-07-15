import React from 'react';
import './Message.css';

function Message({ type, message }) {
  if (!message) return null;

  return (
    <div className={`message ${type}`}>
      {message}
    </div>
  );
}

export default Message;
