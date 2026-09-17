export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = Array<JsonValue>;

export interface AdminProfile {
  id: string;
  email: string;
  username: string | null;
  displayName: string | null;
  role: string;
  isEmailVerified: boolean;
  onboardingComplete: boolean;
  bio: string | null;
  location: string | null;
  phone: string | null;
  photoMediaId: string | null;
  badge: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  destinationTypes: string[];
  travelStyles: string[];
}

export interface NotificationPreference {
  type: string;
  inAppEnabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
}

export interface PlatformSetting {
  id: string;
  key: string;
  value: JsonValue;
  description?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformSettingsResponse {
  settings: PlatformSetting[];
}

export interface UpdateSettingsRequest {
  settings: Record<string, JsonValue>;
}
