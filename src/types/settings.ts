export interface EDCISettings {
  level1Weight: number;
  level2Weight: number;
  level3Weight: number;
  level4Weight: number;
  level5Weight: number;
  normalThreshold: number;
  warningThreshold: number;
  precision: number; // 小數點位數
}

export interface NotificationSettings {
  enableEmail: boolean;
  enableSMS: boolean;
  emailAddress: string;
  phoneNumber: string;
  normalThreshold: number;
  warningThreshold: number;
  criticalThreshold: number;
}

export interface APISettings {
  baseUrl: string;
  endpoint: string;
  apiKey: string;
  timeout: number; // 秒
  retryCount: number;
  refreshInterval: number; // 分鐘
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'view' | 'edit' | 'admin';
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface WeightLimits {
  min: number;
  max: number;
}

export interface SettingsState {
  edci: EDCISettings;
  notifications: NotificationSettings;
  api: APISettings;
  users: User[];
  roles: UserRole[];
  weightLimits: {
    level1: WeightLimits;
    level2: WeightLimits;
    level3: WeightLimits;
    level4: WeightLimits;
    level5: WeightLimits;
  };
}