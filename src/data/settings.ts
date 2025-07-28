import { SettingsState, Permission, UserRole, User } from '@/types/settings';

// 預設權限
export const defaultPermissions: Permission[] = [
  // 檢視權限
  { id: 'view_dashboard', name: '檢視儀表板', description: '查看醫院狀態和EDCI指數', category: 'view' },
  { id: 'view_trends', name: '檢視趨勢', description: '查看歷史趨勢圖表', category: 'view' },
  { id: 'view_reports', name: '檢視報表', description: '查看統計報表', category: 'view' },
  
  // 編輯權限
  { id: 'export_data', name: '匯出資料', description: '匯出醫院資料和報表', category: 'edit' },
  { id: 'manage_notifications', name: '管理通知', description: '設定通知規則和接收者', category: 'edit' },
  
  // 管理權限
  { id: 'manage_settings', name: '管理設定', description: '修改EDCI計算參數和系統設定', category: 'admin' },
  { id: 'manage_users', name: '管理使用者', description: '新增、編輯、刪除使用者帳號', category: 'admin' },
  { id: 'manage_api', name: 'API管理', description: '設定API連線和參數', category: 'admin' },
  { id: 'view_logs', name: '檢視日誌', description: '查看系統操作記錄', category: 'admin' },
];

// 預設角色
export const defaultRoles: UserRole[] = [
  {
    id: 'viewer',
    name: '檢視者',
    permissions: defaultPermissions.filter(p => p.category === 'view'),
  },
  {
    id: 'operator',
    name: '操作員',
    permissions: defaultPermissions.filter(p => p.category === 'view' || p.category === 'edit'),
  },
  {
    id: 'admin',
    name: '系統管理員',
    permissions: defaultPermissions,
  },
];

// 預設使用者
export const defaultUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@hospital.gov.tw',
    role: defaultRoles[2], // admin
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    username: 'operator1',
    email: 'operator1@hospital.gov.tw',
    role: defaultRoles[1], // operator
    isActive: true,
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小時前
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    username: 'viewer1',
    email: 'viewer1@hospital.gov.tw',
    role: defaultRoles[0], // viewer
    isActive: true,
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
    createdAt: new Date('2024-02-01'),
  },
];

// 預設設定
export const defaultSettings: SettingsState = {
  edci: {
    level1Weight: 3.0,
    level2Weight: 2.0,
    level3Weight: 1.0,
    level4Weight: 0.5,
    level5Weight: 0.2,
    normalThreshold: 15.0,
    warningThreshold: 25.0,
    precision: 2,
  },
  notifications: {
    enableEmail: true,
    enableSMS: false,
    emailAddress: 'alert@hospital.gov.tw',
    phoneNumber: '+886-912-345-678',
    normalThreshold: 15.0,
    warningThreshold: 25.0,
    criticalThreshold: 30.0,
  },
  api: {
    baseUrl: 'http://172.16.99.244:5000',
    endpoint: '/api/OverallDashboard/GetEDCIDashBoard?StartDate=2025-07-21',
    apiKey: '',
    timeout: 30,
    retryCount: 3,
    refreshInterval: 5,
  },
  users: defaultUsers,
  roles: defaultRoles,
  weightLimits: {
    level1: { min: 1.0, max: 5.0 },
    level2: { min: 0.5, max: 4.0 },
    level3: { min: 0.1, max: 3.0 },
    level4: { min: 0.1, max: 2.0 },
    level5: { min: 0.1, max: 1.0 },
  },
};

// 本地存儲鍵
export const SETTINGS_STORAGE_KEY = 'edci_settings';