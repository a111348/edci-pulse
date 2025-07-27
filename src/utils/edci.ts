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

/**
 * 計算EDCI指數
 * @param patientCounts 各級病人數量
 * @param doctorCounts 醫師人力
 * @param config EDCI計算參數
 * @returns EDCI計算結果
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
  // 計算醫師加權病人數
  const weightedPatients = 
    patientCounts.level1 * config.level1Weight +
    patientCounts.level2 * config.level2Weight +
    patientCounts.level3 * config.level3Weight +
    patientCounts.level4 * config.level4Weight +
    patientCounts.level5 * config.level5Weight;

  // 計算有效醫師人力
  const effectiveDoctors = doctorCounts.attending + doctorCounts.resident;

  // 計算EDCI指數
  const edci = effectiveDoctors > 0 ? weightedPatients / effectiveDoctors : 0;

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
    weightedPatients,
    effectiveDoctors,
    edci: Math.round(edci * 100) / 100, // 保留兩位小數
    status,
  };
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