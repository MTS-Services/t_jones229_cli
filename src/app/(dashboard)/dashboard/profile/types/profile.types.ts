export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  accountId?: string | null;
  customerId?: string;
  role: string;
  status: string;
  isDeleted: boolean;
  registerType: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  image?: string;
  trip?: any[];
  booking?: any[];
  paymentMethod?: any;
}

export interface ProfileStats {
  totalTrips: number;
  activeBookings: number;
  memberSince: string;
}

export interface StatusConfig {
  bg: string;
  text: string;
  icon: any;
}

export interface UserResponse {
  data: User;
  success: boolean;
}
