export interface EDCICalculationSettings {
  doctorWeights: {
    l1: number;
    l2: number;
    l3: number;
    l4: number;
    l5: number;
  };
  nurseWeights: {
    l1: number;
    l2: number;
    l3: number;
    l4: number;
    l5: number;
  };
  residentDoctorFactor: number;
  finalWeights: {
    pbrWeight: number;
    nbrWeight: number;
    waitingAdmissionWeight: number;
    over24HourWeight: number;
  };
  thresholds: {
    normal: number;
    warning: number;
  };
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    smtpServer: string;
    port: number;
    username: string;
    password: string;
    recipients: string[];
  };
  sms: {
    enabled: boolean;
    mitakeUsername: string;
    mitakePassword: string;
    mitakeApiUrl: string;
    recipients: string[];
  };
  thresholds: {
    warning: number;
    critical: number;
  };
  notificationInterval: number;
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
  description: string;
  permissions: string[];
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
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export interface WeightLimits {
  min: number;
  max: number;
}

export interface SettingsState {
  edciCalculation: EDCICalculationSettings;
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