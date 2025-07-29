import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, TestTube, CheckCircle, XCircle, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { APISettings } from '@/types/settings';
import { defaultSettings, SETTINGS_STORAGE_KEY } from '@/data/settings';
import { useApiData } from '@/hooks/useApiData';

export function APISettingsTab() {
  const [settings, setSettings] = useState<APISettings>(defaultSettings.api);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();
  const { testApiConnection } = useApiData();

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.api) {
          setSettings(parsed.api);
        }
      } catch (error) {
        console.error('Failed to load API settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    try {
      const existingSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const allSettings = existingSettings ? JSON.parse(existingSettings) : defaultSettings;
      
      allSettings.api = settings;
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
      
      toast({
        title: "設定已儲存",
        description: "API 設定已成功更新",
      });
    } catch (error) {
      toast({
        title: "儲存失敗",
        description: "無法儲存 API 設定",
        variant: "destructive",
      });
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const result = await testApiConnection(settings);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `測試失敗: ${error}`,
        data: null
      });
    } finally {
      setTesting(false);
    }
  };

  const updateSetting = (key: keyof APISettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            醫院資料 API 設定
          </CardTitle>
          <CardDescription>
            設定從醫院 API 獲取資料的相關參數（透過本機 Supabase 代理）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baseUrl">API 基礎網址</Label>
            <Input
              id="baseUrl"
              placeholder="http://192.168.1.100:8080"
              value={settings.baseUrl}
              onChange={(e) => updateSetting('baseUrl', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              內網醫院 API 伺服器的基礎網址
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endpoint">API 端點</Label>
            <Input
              id="endpoint"
              placeholder="/api/hospital/emergency-data"
              value={settings.endpoint}
              onChange={(e) => updateSetting('endpoint', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              獲取急診資料的 API 端點路徑
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API 金鑰 (選填)</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="如果 API 需要驗證，請輸入金鑰"
              value={settings.apiKey}
              onChange={(e) => updateSetting('apiKey', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeout">請求超時 (秒)</Label>
              <Input
                id="timeout"
                type="number"
                value={settings.timeout}
                onChange={(e) => updateSetting('timeout', parseInt(e.target.value) || 30)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retryCount">重試次數</Label>
              <Input
                id="retryCount"
                type="number"
                value={settings.retryCount}
                onChange={(e) => updateSetting('retryCount', parseInt(e.target.value) || 3)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="refreshInterval">自動更新間隔 (分鐘)</Label>
            <Input
              id="refreshInterval"
              type="number"
              value={settings.refreshInterval}
              onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value) || 5)}
            />
            <p className="text-sm text-muted-foreground">
              系統自動更新資料的間隔時間，0 表示停用自動更新
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              儲存設定
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTest} 
              disabled={testing || !settings.baseUrl || !settings.endpoint}
              className="flex items-center gap-2"
            >
              <TestTube className="w-4 h-4" />
              {testing ? '測試中...' : '測試連線'}
            </Button>
          </div>

          {testResult && (
            <div className={`p-4 rounded-lg border ${
              testResult.success 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {testResult.success ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <span className="font-medium">
                  {testResult.success ? '連線成功' : '連線失敗'}
                </span>
              </div>
              <p className="text-sm">{testResult.message}</p>
              {testResult.data && testResult.data.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">範例資料:</p>
                  <pre className="text-xs mt-1 p-2 bg-white/50 rounded overflow-auto max-h-40">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>本機 Supabase 設定</CardTitle>
          <CardDescription>
            連接到內網本機 Supabase 服務的相關設定
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>設定步驟:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>在本機安裝並設定 Supabase</li>
              <li>建立 Edge Function: hospital-data-proxy</li>
              <li>在 Lovable 環境變數中設定:</li>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>VITE_SUPABASE_URL: http://您的內網IP:54321</li>
                <li>VITE_SUPABASE_ANON_KEY: 您的 Supabase anon key</li>
              </ul>
            </ol>
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>注意:</strong> 使用本機 Supabase 時，請確保 Edge Function 可以訪問您的內網 API 伺服器。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}