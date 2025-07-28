export interface HospitalData {
  id: number;
  hospitalCode: string;
  hospitalName: string;
  reportDatetime: string;
  patientTn: number;
  patientLvl1: number;
  patientLvl2: number;
  patientLvl3: number;
  patientLvl4: number;
  patientLvl5: number;
  attphysicianNum: number;
  resiphysicianNum: number;
  edci: number;
  edciStatus: 'normal' | 'warning' | 'critical';
  latitude?: number;
  longitude?: number;
}

export interface EDCICalculation {
  weightedPatients: number;
  effectiveDoctors: number;
  edci: number;
  status: 'normal' | 'warning' | 'critical';
  // EDCI v2 新增欄位
  adjustedPBR?: number;
  nbr?: number;
  nurseWeightedPatients?: number;
}

export interface EDCIConfig {
  level1Weight: number;
  level2Weight: number;
  level3Weight: number;
  level4Weight: number;
  level5Weight: number;
  normalThreshold: number;
  warningThreshold: number;
}

export interface HospitalLocation {
  code: string;
  name: string;
  latitude: number;
  longitude: number;
}