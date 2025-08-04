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
    name: '觀看者',
    description: '只能查看系統資料',
    permissions: defaultPermissions.filter(p => p.category === 'view').map(p => p.id),
    defaultHospitalAccess: 'custom',
  },
  {
    id: 'operator',
    name: '操作員',
    description: '可以查看和編輯系統資料',
    permissions: defaultPermissions.filter(p => ['view', 'edit'].includes(p.category)).map(p => p.id),
    defaultHospitalAccess: 'all',
  },
  {
    id: 'admin',
    name: '管理員',
    description: '擁有所有系統權限',
    permissions: defaultPermissions.map(p => p.id),
    defaultHospitalAccess: 'all',
  },
];

// 預設使用者
export const defaultUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@hospital.gov.tw',
    role: 'admin',
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date('2024-01-01').toISOString(),
    allowedHospitals: ['H001', 'H002', 'H003', 'H004', 'H005', 'H006', 'H007', 'H008', 'H009', 'H010', 'H011'],
  },
  {
    id: '2',
    username: 'operator1',
    email: 'operator1@hospital.gov.tw',
    role: 'operator',
    isActive: true,
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-01-15').toISOString(),
    allowedHospitals: ['H001', 'H002', 'H003', 'H004', 'H005', 'H006', 'H007', 'H008', 'H009', 'H010', 'H011'],
  },
  {
    id: '3',
    username: 'viewer1',
    email: 'viewer1@hospital.gov.tw',
    role: 'viewer',
    isActive: true,
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-02-01').toISOString(),
    allowedHospitals: ['H001', 'H002', 'H003'],
  },
];

// 預設設定
export const defaultSettings: SettingsState = {
  edciCalculation: {
    doctorWeights: {
      l1: 3.0,
      l2: 2.0,
      l3: 1.0,
      l4: 0.5,
      l5: 0.2,
    },
    nurseWeights: {
      l1: 1.5,
      l2: 1.0,
      l3: 1.0,
      l4: 0.5,
      l5: 0.3,
    },
    residentDoctorFactor: 0.6,
    finalWeights: {
      pbrWeight: 0.3,
      nbrWeight: 0.3,
      waitingAdmissionWeight: 0.2,
      over24HourWeight: 0.2,
    },
    thresholds: {
      normal: 15.0,
      warning: 25.0,
    },
  },
  notifications: {
    email: {
      enabled: false,
      smtpServer: 'smtp.gmail.com',
      port: 587,
      username: '',
      password: '',
      recipients: [],
    },
    sms: {
      enabled: false,
      mitakeUsername: '',
      mitakePassword: '',
      mitakeApiUrl: 'https://smexpress.mitake.com.tw:9600/SmSendGet.asp',
      recipients: [],
    },
    thresholds: {
      warning: 15.0,
      critical: 25.0,
    },
    notificationInterval: 30,
  },
  api: {
    baseUrl: 'http://192.168.1.100:8080',
    endpoint: '/api/hospital/emergency-data',
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