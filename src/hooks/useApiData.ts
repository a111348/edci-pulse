
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

  // 通過 Supabase Edge Function 從API獲取資料
  const fetchFromApi = async (apiSettings: APISettings): Promise<HospitalData[]> => {
    // 使用 Supabase Edge Function 作為 proxy
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase 設定不完整，請檢查環境變數');
    }

    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/hospital-data-proxy`;
    
    // 自動生成今天的日期參數
    const today = new Date().toISOString().split('T')[0];
    
    const requestBody = {
      baseUrl: apiSettings.baseUrl,
      endpoint: apiSettings.endpoint,
      apiKey: apiSettings.apiKey,
      startDate: today,
      timeout: apiSettings.timeout
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), apiSettings.timeout * 1000);

    try {
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`代理服務器請求失敗: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // 處理回應資料
      if (data.error) {
        throw new Error(data.error);
      }

      // 將API回應轉換為系統格式
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
          nurseNum: item.nursE_NUM || 0,
          waitingAdmissionNum: item.waitinG_ADMISSION_NUM || 0,
          over24HourNum: item.oveR_24HOUR_NUM || 0,
          edci: item.edci || 0,
          edciStatus: item.edciStatus?.toLowerCase() === 'normal' ? 'normal' : 
                     item.edciStatus?.toLowerCase() === 'warning' ? 'warning' : 'critical',
          latitude: 0,
          longitude: 0,
        }));
      }

      // 兼容舊格式
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
          nurseNum: item.nurseNum || 0,
          waitingAdmissionNum: item.waitingAdmissionNum || 0,
          over24HourNum: item.over24HourNum || 0,
          edci: item.edci || 0,
          edciStatus: item.edciStatus || 'normal',
          latitude: item.latitude || 0,
          longitude: item.longitude || 0,
        }));
      }

      throw new Error('無效的 API 回應格式');
    } catch (error: any) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // 測試 API 連線
  const testApiConnection = async (apiSettings: APISettings) => {
    try {
      const data = await fetchFromApi(apiSettings);
      return {
        success: true,
        message: `成功連接！獲取到 ${data.length} 筆醫院資料`,
        data: data.slice(0, 3) // 回傳前3筆作為範例
      };
    } catch (error: any) {
      return {
        success: false,
        message: `連接失敗: ${error.message}`,
        data: null
      };
    }
  };

  // 獲取醫院資料
  const fetchHospitalData = async (forceRefresh = false) => {
    if (loading && !forceRefresh) return;

    setLoading(true);
    setError(null);

    const apiSettings = getApiSettings();
    
    // 檢查是否有 Supabase 設定
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey || !apiSettings.baseUrl || !apiSettings.endpoint) {
      console.log('Using mock data - Supabase or API not configured');
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
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
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
    testApiConnection,
  };
}
