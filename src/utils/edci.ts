import { EDCICalculation, EDCIConfig } from '@/types/hospital';

// 預設EDCI計算參數
export const DEFAULT_EDCI_CONFIG: EDCIConfig = {
  level1Weight: 3,
  level2Weight: 2,
  level3Weight: 1,
  level4Weight: 0.5,
  level5Weight: 0.2,
  normalThreshold: 15,
  warningThreshold: 25,
};

// 新的EDCI v2計算參數
export const EDCI_V2_CONFIG = {
  // 醫師加權參數
  doctor: {
    level1Weight: 3,
    level2Weight: 2,
    level3Weight: 1,
    level4Weight: 0.5,
    level5Weight: 0.2,
  },
  // 護理加權參數
  nurse: {
    level1Weight: 1.5,
    level2Weight: 1,
    level3Weight: 1,
    level4Weight: 0.5,
    level5Weight: 0.3,
  },
  // FTE計算參數
  residentFTE: 0.6, // 住院醫師FTE係數
  // EDCI最終權重
  weights: {
    adjustedPBR: 0.3,
    nbr: 0.3,
    waitHospitalized: 0.2,
    wait24h: 0.2,
  },
};

/**
 * 計算EDCI v2指數（新版公式）
 * @param patientCounts 各級病人數量
 * @param doctorCounts 醫師人力
 * @param nurseCount 護理師人數
 * @param waitHospitalized 等待住院人數
 * @param wait24h 超過24小時滯留人數
 * @param config EDCI計算參數
 * @returns EDCI計算結果
 */
export function calculateEDCIv2(
  patientCounts: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
  },
  doctorCounts: {
    attending: number;
    resident: number;
  },
  nurseCount: number,
  waitHospitalized: number,
  wait24h: number,
  config: EDCIConfig = DEFAULT_EDCI_CONFIG
): EDCICalculation {
  // 1. 計算醫師加權病人數
  const doctorWeightedPatients = 
    patientCounts.level1 * EDCI_V2_CONFIG.doctor.level1Weight +
    patientCounts.level2 * EDCI_V2_CONFIG.doctor.level2Weight +
    patientCounts.level3 * EDCI_V2_CONFIG.doctor.level3Weight +
    patientCounts.level4 * EDCI_V2_CONFIG.doctor.level4Weight +
    patientCounts.level5 * EDCI_V2_CONFIG.doctor.level5Weight;

  // 2. 計算有效醫師人力 FTE
  const effectiveDoctorsFTE = doctorCounts.attending + (doctorCounts.resident * EDCI_V2_CONFIG.residentFTE);

  // 3. 計算 Adjusted PBR（醫師壓力比）
  const adjustedPBR = effectiveDoctorsFTE > 0 ? doctorWeightedPatients / effectiveDoctorsFTE : 0;

  // 4. 計算護理加權病人數
  const nurseWeightedPatients = 
    patientCounts.level1 * EDCI_V2_CONFIG.nurse.level1Weight +
    patientCounts.level2 * EDCI_V2_CONFIG.nurse.level2Weight +
    patientCounts.level3 * EDCI_V2_CONFIG.nurse.level3Weight +
    patientCounts.level4 * EDCI_V2_CONFIG.nurse.level4Weight +
    patientCounts.level5 * EDCI_V2_CONFIG.nurse.level5Weight;

  // 5. 計算 NBR（護理壓力比）
  const nbr = nurseCount > 0 ? nurseWeightedPatients / nurseCount : 0;

  // 6. 計算最終 EDCI v2
  const edci = 
    (adjustedPBR * EDCI_V2_CONFIG.weights.adjustedPBR) +
    (nbr * EDCI_V2_CONFIG.weights.nbr) +
    (waitHospitalized * EDCI_V2_CONFIG.weights.waitHospitalized) +
    (wait24h * EDCI_V2_CONFIG.weights.wait24h);

  // 判定狀態
  let status: 'normal' | 'warning' | 'critical';
  if (edci < config.normalThreshold) {
    status = 'normal';
  } else if (edci < config.warningThreshold) {
    status = 'warning';
  } else {
    status = 'critical';
  }

  return {
    weightedPatients: doctorWeightedPatients,
    effectiveDoctors: effectiveDoctorsFTE,
    edci: Math.round(edci * 100) / 100, // 保留兩位小數
    status,
    // 新增詳細資訊
    adjustedPBR: Math.round(adjustedPBR * 100) / 100,
    nbr: Math.round(nbr * 100) / 100,
    nurseWeightedPatients: Math.round(nurseWeightedPatients * 100) / 100,
  };
}

/**
 * 計算EDCI指數（舊版公式，向後兼容）
 */
export function calculateEDCI(
  patientCounts: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
  },
  doctorCounts: {
    attending: number;
    resident: number;
  },
  config: EDCIConfig = DEFAULT_EDCI_CONFIG
): EDCICalculation {
  // 使用新版公式，但護理師數設為1，等待住院和24h滯留設為0以模擬舊版
  return calculateEDCIv2(
    patientCounts,
    doctorCounts,
    1, // 假設護理師數為1
    0, // 等待住院人數為0
    0, // 24h滯留人數為0
    config
  );
}

/**
 * 取得狀態顯示資訊
 */
export function getStatusInfo(status: 'normal' | 'warning' | 'critical') {
  const statusConfig = {
    normal: {
      label: '正常',
      color: 'status-normal',
      bgColor: 'bg-status-normal',
      textColor: 'text-status-normal-foreground',
      icon: '✓',
    },
    warning: {
      label: '預警',
      color: 'status-warning',
      bgColor: 'bg-status-warning',
      textColor: 'text-status-warning-foreground',
      icon: '⚠',
    },
    critical: {
      label: '嚴重',
      color: 'status-critical',
      bgColor: 'bg-status-critical',
      textColor: 'text-status-critical-foreground',
      icon: '⚠',
    },
  };

  return statusConfig[status];
}