import { useState, useEffect } from 'react';
import { HospitalData } from '@/types/hospital';
import { generateMockHospitalData } from '@/data/mockData';
import { defaultSettings, SETTINGS_STORAGE_KEY } from '@/data/settings';
import { APISettings } from '@/types/settings';

export function useApiData() {
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 獲取API設定
  const getApiSettings = (): APISettings => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        return settings.api;
      }
    } catch (error) {
      console.error('Failed to load API settings:', error);
    }
    return defaultSettings.api;
  };

  // 從API獲取資料
  const fetchFromApi = async (apiSettings: APISettings): Promise<HospitalData[]> => {
    const url = `${apiSettings.baseUrl}${apiSettings.endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (apiSettings.apiKey) {
      headers['Authorization'] = `Bearer ${apiSettings.apiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), apiSettings.timeout * 1000);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // 將API回應轉換為系統格式
      // 處理新的API格式：包含headData和bodyDetails
      if (data.bodyDetails && Array.isArray(data.bodyDetails)) {
        return data.bodyDetails.map((item: any) => ({
          id: Math.random(),
          hospitalCode: item.hospitaL_CODE || '',
          hospitalName: item.hospitalNickName || '',
          reportDatetime: new Date().toISOString(),
          patientTn: item.patientS_TN || 0,
          patientLvl1: item.patienT_LVL1 || 0,
          patientLvl2: item.patienT_LVL2 || 0,
          patientLvl3: item.patienT_LVL3 || 0,
          patientLvl4: item.patienT_LVL4 || 0,
          patientLvl5: item.patienT_LVL5 || 0,
          attphysicianNum: item.attphysiciaN_NUM || 0,
          resiphysicianNum: item.resiphysiciaN_NUM || 0,
          edci: item.edci || 0,
          edciStatus: item.edciStatus?.toLowerCase() === 'normal' ? 'normal' : 
                     item.edciStatus?.toLowerCase() === 'warning' ? 'warning' : 'critical',
          latitude: 0, // API沒有提供座標，使用預設值
          longitude: 0,
        }));
      }

      // 兼容舊格式（如果是陣列）
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          id: item.id || Math.random(),
          hospitalCode: item.hospitalCode || '',
          hospitalName: item.hospitalName || '',
          reportDatetime: item.reportDatetime || new Date().toISOString(),
          patientTn: item.patientTn || 0,
          patientLvl1: item.patientLvl1 || 0,
          patientLvl2: item.patientLvl2 || 0,
          patientLvl3: item.patientLvl3 || 0,
          patientLvl4: item.patientLvl4 || 0,
          patientLvl5: item.patientLvl5 || 0,
          attphysicianNum: item.attphysicianNum || 0,
          resiphysicianNum: item.resiphysicianNum || 0,
          edci: item.edci || 0,
          edciStatus: item.edciStatus || 'normal',
          latitude: item.latitude || 0,
          longitude: item.longitude || 0,
        }));
      }

      throw new Error('Invalid API response format');
    } catch (error: any) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // 獲取醫院資料
  const fetchHospitalData = async (forceRefresh = false) => {
    if (loading && !forceRefresh) return;

    setLoading(true);
    setError(null);

    const apiSettings = getApiSettings();
    
    // 如果沒有設定API URL，使用模擬資料
    if (!apiSettings.baseUrl || !apiSettings.endpoint) {
      console.log('Using mock data - API not configured');
      setHospitals(generateMockHospitalData());
      setLoading(false);
      return;
    }

    let retryCount = 0;
    const maxRetries = apiSettings.retryCount;

    const tryFetch = async (): Promise<void> => {
      try {
        const data = await fetchFromApi(apiSettings);
        setHospitals(data);
        setError(null);
      } catch (err: any) {
        retryCount++;
        
        if (retryCount <= maxRetries) {
          console.log(`API fetch failed, retrying... (${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // 逐步延遲
          return tryFetch();
        }

        // 重試失敗後使用模擬資料
        console.error('API fetch failed after retries, using mock data:', err.message);
        setError(`API連線失敗: ${err.message}，已切換為模擬資料`);
        setHospitals(generateMockHospitalData());
      }
    };

    await tryFetch();
    setLoading(false);
  };

  return {
    hospitals,
    loading,
    error,
    fetchHospitalData,
    refetch: () => fetchHospitalData(true),
  };
}