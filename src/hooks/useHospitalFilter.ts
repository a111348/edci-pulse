import { useMemo } from 'react';
import { HospitalData } from '@/types/hospital';
import { useAuth } from './useAuth';

export function useHospitalFilter(hospitals: HospitalData[]): HospitalData[] {
  const { canViewHospital, currentUser } = useAuth();

  const filteredHospitals = useMemo(() => {
    if (!currentUser) {
      return []; // 未登入則不顯示任何醫院
    }

    // 管理員可以看到所有醫院
    if (currentUser.role === 'admin') {
      return hospitals;
    }

    // 其他用戶只能看到有權限的醫院
    return hospitals.filter(hospital => 
      canViewHospital(hospital.hospitalCode)
    );
  }, [hospitals, canViewHospital, currentUser]);

  return filteredHospitals;
}