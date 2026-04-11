export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  role: string;
  status: string;
  isEmailVerified: boolean;
  registerType: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  bookingUpdates: boolean;
  promotionalEmails: boolean;
  tripReminders: boolean;
}

export interface PrivacySettings {
  profileVisibility: "public" | "private" | "friends";
  showEmail: boolean;
  showPhone: boolean;
  dataSharing: boolean;
}

export interface DisplaySettings {
  language: string;
  timezone: string;
  currency: string;
  dateFormat: string;
}

export interface SecuritySession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}
