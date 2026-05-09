export interface CaptainUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  accountId: string | null;
  customerId: string;
  chargeEnable: boolean;
  role: string;
  status: string;
  isDeleted: boolean;
  registerType: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod: any;
}

export interface Boat {
  id: string;
  manufacturer: string;
  boatType: string;
  guests: number;
  boatLength: number;
  modelYear: number;
  approvalStatus: string;
  trips: any[];
}

export interface CaptainDetailsProps {
  userData: {
    user: CaptainUser;
    trip: any[];
    boat: Boat[];
  };
}

export interface StatusConfig {
  icon: any;
  bg: string;
  text: string;
  border: string;
}

// Reused types
export interface AccountStatusCardProps {
  user: CaptainUser;
  boatCount: number;
}
