// components/Notification.tsx

import React from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineInfoCircle } from "react-icons/ai";

type NotificationProps = {
  type: "success" | "error" | "info";
  message: string;
  onClose: () => void;
};

const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  const typeStyles = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
  };

  const Icon = () => {
    switch (type) {
      case "success":
        return <AiOutlineCheckCircle className="w-5 h-5 mr-2" />;
      case "error":
        return <AiOutlineCloseCircle className="w-5 h-5 mr-2" />;
      default:
        return <AiOutlineInfoCircle className="w-5 h-5 mr-2" />;
    }
  };

  return (
    <div className={`flex items-center p-4 mb-4 border-l-4 rounded shadow ${typeStyles[type]}`}>
      <Icon />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-xl text-gray-500 hover:text-gray-700">
        ×
      </button>
    </div>
  );
};

export default Notification;
