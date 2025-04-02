// Formatear fecha
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Formatear moneda
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "N/A";

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Formatear porcentaje
export const formatPercentage = (value) => {
  if (value === undefined || value === null) return "N/A";

  return `${value}%`;
};

// Formatear estado de solicitud
export const getStatusBadge = (status) => {
  if (!status) return { text: "Desconocido", className: "bg-gray-100 text-gray-800" };

  switch (status.toLowerCase()) {
    case "pendiente":
      return { text: "Pendiente", className: "bg-yellow-100 text-yellow-800" };
    case "aprobado":
      return { text: "Aprobado", className: "bg-green-100 text-green-800" };
    case "rechazado":
      return { text: "Rechazado", className: "bg-red-100 text-red-800" };
    case "pendiente_info":
      return { text: "Pendiente de Información", className: "bg-blue-100 text-blue-800" };
    default:
      return { text: status, className: "bg-gray-100 text-gray-800" };
  }
};










