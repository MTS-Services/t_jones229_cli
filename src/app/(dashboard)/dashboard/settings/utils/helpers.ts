export const formatLastActive = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

export const getDeviceIcon = (device: string): string => {
  if (device.toLowerCase().includes("mobile")) return "📱";
  if (device.toLowerCase().includes("tablet")) return "📱";
  return "💻";
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const getPasswordStrength = (
  password: string,
): "weak" | "medium" | "strong" => {
  if (password.length < 8) return "weak";
  if (password.length < 12) return "medium";
  return "strong";
};
