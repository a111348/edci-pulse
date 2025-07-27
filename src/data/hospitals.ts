import { HospitalLocation } from '@/types/hospital';

// 桃園市11家責任醫院基本資料
export const HOSPITALS: HospitalLocation[] = [
  {
    code: 'H001',
    name: '林口長庚紀念醫院',
    latitude: 25.0841,
    longitude: 121.3424
  },
  {
    code: 'H002', 
    name: '桃園長庚紀念醫院',
    latitude: 25.0056,
    longitude: 121.3105
  },
  {
    code: 'H003',
    name: '聖保祿醫院',
    latitude: 25.0141,
    longitude: 121.3023
  },
  {
    code: 'H004',
    name: '敏盛綜合醫院',
    latitude: 24.9857,
    longitude: 121.3068
  },
  {
    code: 'H005',
    name: '壢新醫院',
    latitude: 24.9536,
    longitude: 121.2478
  },
  {
    code: 'H006',
    name: '國軍桃園總醫院',
    latitude: 24.9893,
    longitude: 121.3148
  },
  {
    code: 'H007',
    name: '衛生福利部桃園醫院',
    latitude: 24.9893,
    longitude: 121.3148
  },
  {
    code: 'H008',
    name: '新國民綜合醫院',
    latitude: 24.9535,
    longitude: 121.2278
  },
  {
    code: 'H009',
    name: '中壢天晟醫院',
    latitude: 24.9536,
    longitude: 121.2278
  },
  {
    code: 'H010',
    name: '怡仁綜合醫院',
    latitude: 25.0689,
    longitude: 121.2336
  },
  {
    code: 'H011',
    name: '桃園榮民醫院',
    latitude: 25.0689,
    longitude: 121.2336
  }
];

export const getHospitalByCode = (code: string): HospitalLocation | undefined => {
  return HOSPITALS.find(hospital => hospital.code === code);
};