import React from "react";
import { getStatusBadge } from "../utils/formatters";
import '../tailwind.css';
const StatusBadge = ({ status }) => {
  const { text, className } = getStatusBadge(status);
  
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full z-[999] ${className}`}>
      {text}
    </span>
  );
};

export default StatusBadge;