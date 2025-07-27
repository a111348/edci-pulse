import { HospitalData } from '@/types/hospital';
import { HOSPITALS } from './hospitals';
import { calculateEDCI } from '@/utils/edci';

// 生成模擬資料
export function generateMockHospitalData(): HospitalData[] {
  const now = new Date();
  
  return HOSPITALS.map((hospital, index) => {
    // 隨機生成病人數據
    const patientLvl1 = Math.floor(Math.random() * 20) + 5;
    const patientLvl2 = Math.floor(Math.random() * 30) + 10;
    const patientLvl3 = Math.floor(Math.random() * 40) + 15;
    const patientLvl4 = Math.floor(Math.random() * 25) + 8;
    const patientLvl5 = Math.floor(Math.random() * 15) + 3;
    
    const attphysicianNum = Math.floor(Math.random() * 8) + 3;
    const resiphysicianNum = Math.floor(Math.random() * 12) + 5;
    
    // 計算EDCI
    const edciResult = calculateEDCI(
      {
        level1: patientLvl1,
        level2: patientLvl2,
        level3: patientLvl3,
        level4: patientLvl4,
        level5: patientLvl5,
      },
      {
        attending: attphysicianNum,
        resident: resiphysicianNum,
      }
    );

    return {
      id: index + 1,
      hospitalCode: hospital.code,
      hospitalName: hospital.name,
      reportDatetime: now.toISOString(),
      patientTn: patientLvl1 + patientLvl2 + patientLvl3 + patientLvl4 + patientLvl5,
      patientLvl1,
      patientLvl2,
      patientLvl3,
      patientLvl4,
      patientLvl5,
      attphysicianNum,
      resiphysicianNum,
      edci: edciResult.edci,
      edciStatus: edciResult.status,
      latitude: hospital.latitude,
      longitude: hospital.longitude,
    };
  });
}

// 歷史趨勢資料（過去24小時，每小時一筆）
export function generateTrendData(hospitalCode: string): Array<{
  time: string;
  edci: number;
  status: 'normal' | 'warning' | 'critical';
}> {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const edci = Math.random() * 30 + 5; // 5-35之間
    
    let status: 'normal' | 'warning' | 'critical';
    if (edci < 15) status = 'normal';
    else if (edci < 25) status = 'warning';
    else status = 'critical';
    
    data.push({
      time: time.toISOString(),
      edci: Math.round(edci * 100) / 100,
      status,
    });
  }
  
  return data;
}