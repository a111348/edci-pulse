import { useState, useEffect } from 'react';
import { SettingsState, EDCISettings, NotificationSettings, APISettings, User, UserRole } from '@/types/settings';
import { defaultSettings, SETTINGS_STORAGE_KEY } from '@/data/settings';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, RotateCcw, Plus, Trash2, Edit2, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsDialogProps {
  trigger?: React.ReactNode;
}

export function SettingsDialog({ trigger }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [apiTesting, setApiTesting] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);
  const { toast } = useToast();

  // 載入設定
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('載入設定失敗:', error);
        toast({
          title: '載入設定失敗',
          description: '將使用預設設定',
          variant: 'destructive',
        });
      }
    }
  }, [toast]);

  // 儲存設定
  const handleSave = () => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      setHasChanges(false);
      toast({
        title: '設定已儲存',
        description: '所有變更已成功儲存',
      });
    } catch (error) {
      console.error('儲存設定失敗:', error);
      toast({
        title: '儲存失敗',
        description: '無法儲存設定，請重試',
        variant: 'destructive',
      });
    }
  };

  // 重設為預設值
  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast({
      title: '已重設為預設值',
      description: '請記得儲存變更',
    });
  };

  // 更新EDCI設定
  const updateEDCISettings = (updates: Partial<EDCISettings>) => {
    setSettings(prev => ({
      ...prev,
      edci: { ...prev.edci, ...updates }
    }));
    setHasChanges(true);
  };

  // 更新通知設定
  const updateNotificationSettings = (updates: Partial<NotificationSettings>) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...updates }
    }));
    setHasChanges(true);
  };

  // 更新API設定
  const updateAPISettings = (updates: Partial<APISettings>) => {
    setSettings(prev => ({
      ...prev,
      api: { ...prev.api, ...updates }
    }));
    setHasChanges(true);
  };

  // API測試功能
  const testApiConnection = async () => {
    setApiTesting(true);
    setApiTestResult(null);

    const { baseUrl, endpoint, apiKey, timeout } = settings.api;

    // 檢查必要參數
    if (!baseUrl || !endpoint) {
      setApiTestResult({
        success: false,
        message: '請先填寫API基礎URL和端點',
      });
      setApiTesting(false);
      return;
    }

    try {
      // 自動生成今天的日期參數
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD格式
      const urlWithDate = `${baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}StartDate=${today}`;
      const url = urlWithDate;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout * 1000);

      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // 檢查返回的資料格式
      if (data.bodyDetails && Array.isArray(data.bodyDetails)) {
        setApiTestResult({
          success: true,
          message: `連線成功！獲取到 ${data.bodyDetails.length} 筆醫院資料`,
          data: data,
        });
      } else if (Array.isArray(data)) {
        setApiTestResult({
          success: true,
          message: `連線成功！獲取到 ${data.length} 筆資料`,
          data: data,
        });
      } else {
        setApiTestResult({
          success: false,
          message: 'API返回的資料格式不正確',
          data: data,
        });
      }
    } catch (error: any) {
      let errorMessage = 'API連線失敗';
      
      if (error.name === 'AbortError') {
        errorMessage = `連線逾時 (超過 ${timeout} 秒)`;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setApiTestResult({
        success: false,
        message: errorMessage,
      });
    }

    setApiTesting(false);
  };

  // 數值輸入組件
  const NumberInput = ({ 
    label, 
    value, 
    onChange, 
    min, 
    max, 
    step = 0.1, 
    precision = 2 
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={value.toFixed(precision)}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val)) {
              const clampedVal = Math.max(min || 0, Math.min(max || 100, val));
              onChange(Number(clampedVal.toFixed(precision)));
            }
          }}
          step={step}
          min={min}
          max={max}
          className="flex-1"
        />
        {min !== undefined && max !== undefined && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            ({min}-{max})
          </span>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            設定
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            系統設定
          </DialogTitle>
          <DialogDescription>
            調整EDCI計算參數、通知設定、使用者權限和API連線設定
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="edci" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="edci">EDCI參數</TabsTrigger>
            <TabsTrigger value="notifications">通知設定</TabsTrigger>
            <TabsTrigger value="users">使用者管理</TabsTrigger>
            <TabsTrigger value="api">API設定</TabsTrigger>
          </TabsList>

          {/* EDCI參數設定 */}
          <TabsContent value="edci" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>醫師權重設定</CardTitle>
                <CardDescription>調整各級病人的醫師權重係數</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <NumberInput
                  label="L1 醫師權重"
                  value={settings.edci.level1Weight}
                  onChange={(value) => updateEDCISettings({ level1Weight: value })}
                  min={settings.weightLimits.level1.min}
                  max={settings.weightLimits.level1.max}
                />
                <NumberInput
                  label="L2 醫師權重"
                  value={settings.edci.level2Weight}
                  onChange={(value) => updateEDCISettings({ level2Weight: value })}
                  min={settings.weightLimits.level2.min}
                  max={settings.weightLimits.level2.max}
                />
                <NumberInput
                  label="L3 醫師權重"
                  value={settings.edci.level3Weight}
                  onChange={(value) => updateEDCISettings({ level3Weight: value })}
                  min={settings.weightLimits.level3.min}
                  max={settings.weightLimits.level3.max}
                />
                <NumberInput
                  label="L4 醫師權重"
                  value={settings.edci.level4Weight}
                  onChange={(value) => updateEDCISettings({ level4Weight: value })}
                  min={settings.weightLimits.level4.min}
                  max={settings.weightLimits.level4.max}
                />
                <NumberInput
                  label="L5 醫師權重"
                  value={settings.edci.level5Weight}
                  onChange={(value) => updateEDCISettings({ level5Weight: value })}
                  min={settings.weightLimits.level5.min}
                  max={settings.weightLimits.level5.max}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>護理權重設定</CardTitle>
                <CardDescription>調整各級病人的護理權重係數</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <NumberInput
                  label="L1 護理權重"
                  value={1.5}
                  onChange={() => {}} // 暫時固定值
                  min={0.1}
                  max={3.0}
                />
                <NumberInput
                  label="L2 護理權重"
                  value={1.0}
                  onChange={() => {}} // 暫時固定值
                  min={0.1}
                  max={3.0}
                />
                <NumberInput
                  label="L3 護理權重"
                  value={1.0}
                  onChange={() => {}} // 暫時固定值
                  min={0.1}
                  max={3.0}
                />
                <NumberInput
                  label="L4 護理權重"
                  value={0.5}
                  onChange={() => {}} // 暫時固定值
                  min={0.1}
                  max={2.0}
                />
                <NumberInput
                  label="L5 護理權重"
                  value={0.3}
                  onChange={() => {}} // 暫時固定值
                  min={0.1}
                  max={1.0}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>FTE與權重係數</CardTitle>
                <CardDescription>設定FTE計算和EDCI最終權重</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <NumberInput
                  label="住院醫師 FTE 係數"
                  value={0.6}
                  onChange={() => {}} // 暫時固定值
                  min={0.1}
                  max={1.0}
                />
                <NumberInput
                  label="Adjusted PBR 權重"
                  value={0.3}
                  onChange={() => {}} // 暫時固定值
                  min={0.0}
                  max={1.0}
                />
                <NumberInput
                  label="NBR 權重"
                  value={0.3}
                  onChange={() => {}} // 暫時固定值
                  min={0.0}
                  max={1.0}
                />
                <NumberInput
                  label="等待住院權重"
                  value={0.2}
                  onChange={() => {}} // 暫時固定值
                  min={0.0}
                  max={1.0}
                />
                <NumberInput
                  label="24h滯留權重"
                  value={0.2}
                  onChange={() => {}} // 暫時固定值
                  min={0.0}
                  max={1.0}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>閾值設定</CardTitle>
                <CardDescription>設定EDCI狀態判定的閾值</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <NumberInput
                  label="正常閾值"
                  value={settings.edci.normalThreshold}
                  onChange={(value) => updateEDCISettings({ normalThreshold: value })}
                  min={0}
                  max={50}
                />
                <NumberInput
                  label="預警閾值"
                  value={settings.edci.warningThreshold}
                  onChange={(value) => updateEDCISettings({ warningThreshold: value })}
                  min={settings.edci.normalThreshold}
                  max={50}
                />
                <NumberInput
                  label="精確度 (小數點)"
                  value={settings.edci.precision}
                  onChange={(value) => updateEDCISettings({ precision: Math.round(value) })}
                  min={0}
                  max={4}
                  step={1}
                  precision={0}
                />
              </CardContent>
            </Card>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">EDCI v2 計算說明</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• 醫師加權病人數 = (L1×3) + (L2×2) + (L3×1) + (L4×0.5) + (L5×0.2)</p>
                <p>• 有效醫師人力 FTE = 主治醫師數 + (住院醫師數×0.6)</p>
                <p>• Adjusted PBR = 醫師加權病人數 / 有效醫師人力 FTE</p>
                <p>• 護理加權病人數 = (L1×1.5) + (L2×1) + (L3×1) + (L4×0.5) + (L5×0.3)</p>
                <p>• NBR = 護理加權病人數 / 護理師數</p>
                <p>• EDCI v2 = (Adjusted PBR×0.3) + (NBR×0.3) + (等待住院×0.2) + (24h滯留×0.2)</p>
              </div>
            </div>
          </TabsContent>

          {/* 通知設定 */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>通知方式</CardTitle>
                <CardDescription>選擇通知發送方式</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email 通知</Label>
                    <p className="text-sm text-muted-foreground">透過電子郵件發送警報</p>
                  </div>
                  <Switch
                    checked={settings.notifications.enableEmail}
                    onCheckedChange={(checked) => updateNotificationSettings({ enableEmail: checked })}
                  />
                </div>
                
                {settings.notifications.enableEmail && (
                  <div className="space-y-2">
                    <Label>Email 地址</Label>
                    <Input
                      type="email"
                      value={settings.notifications.emailAddress}
                      onChange={(e) => updateNotificationSettings({ emailAddress: e.target.value })}
                      placeholder="alert@hospital.gov.tw"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label>簡訊通知</Label>
                    <p className="text-sm text-muted-foreground">透過簡訊發送緊急警報</p>
                  </div>
                  <Switch
                    checked={settings.notifications.enableSMS}
                    onCheckedChange={(checked) => updateNotificationSettings({ enableSMS: checked })}
                  />
                </div>

                {settings.notifications.enableSMS && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>手機號碼</Label>
                      <Input
                        type="tel"
                        value={settings.notifications.phoneNumber}
                        onChange={(e) => updateNotificationSettings({ phoneNumber: e.target.value })}
                        placeholder="+886-912-345-678"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>三竹資訊帳號</Label>
                      <Input
                        type="text"
                        value={settings.notifications.mitake?.username || ''}
                        onChange={(e) => updateNotificationSettings({ 
                          mitake: { ...settings.notifications.mitake, username: e.target.value }
                        })}
                        placeholder="輸入三竹帳號"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>三竹資訊密碼</Label>
                      <Input
                        type="password"
                        value={settings.notifications.mitake?.password || ''}
                        onChange={(e) => updateNotificationSettings({ 
                          mitake: { ...settings.notifications.mitake, password: e.target.value }
                        })}
                        placeholder="輸入三竹密碼"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>API URL</Label>
                      <Input
                        type="url"
                        value={settings.notifications.mitake?.apiUrl || ''}
                        onChange={(e) => updateNotificationSettings({ 
                          mitake: { ...settings.notifications.mitake, apiUrl: e.target.value }
                        })}
                        placeholder="https://smsapi.mitake.com.tw/api/mtk/SmSend"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>通知閾值</CardTitle>
                <CardDescription>設定觸發通知的EDCI閾值</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NumberInput
                  label="正常閾值"
                  value={settings.notifications.normalThreshold}
                  onChange={(value) => updateNotificationSettings({ normalThreshold: value })}
                  min={0}
                  max={50}
                />
                <NumberInput
                  label="預警閾值"
                  value={settings.notifications.warningThreshold}
                  onChange={(value) => updateNotificationSettings({ warningThreshold: value })}
                  min={0}
                  max={50}
                />
                <NumberInput
                  label="嚴重閾值"
                  value={settings.notifications.criticalThreshold}
                  onChange={(value) => updateNotificationSettings({ criticalThreshold: value })}
                  min={0}
                  max={50}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 使用者管理 */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  使用者列表
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    新增使用者
                  </Button>
                </CardTitle>
                <CardDescription>管理系統使用者帳號和權限</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.username}</span>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? "啟用" : "停用"}
                          </Badge>
                          <Badge variant="outline">{user.role.name}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          最後登入: {user.lastLogin?.toLocaleString('zh-TW') || '從未登入'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>角色權限</CardTitle>
                <CardDescription>系統角色和對應權限</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.roles.map((role) => (
                    <div key={role.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{role.name}</h4>
                        <Badge variant="outline">{role.permissions.length} 項權限</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission) => (
                          <Badge 
                            key={permission.id} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {permission.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API設定 */}
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API 連線設定</CardTitle>
                <CardDescription>設定與外部API的連線參數</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API 基礎 URL</Label>
                    <Input
                      value={settings.api.baseUrl}
                      onChange={(e) => updateAPISettings({ baseUrl: e.target.value })}
                      placeholder="http://172.16.99.244:5000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>API 端點</Label>
                    <Input
                      value={settings.api.endpoint}
                      onChange={(e) => updateAPISettings({ endpoint: e.target.value })}
                      placeholder="/api/OverallDashboard/GetEDCIDashBoard?StartDate=2025-07-21"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>API 金鑰</Label>
                  <Input
                    type="password"
                    value={settings.api.apiKey}
                    onChange={(e) => updateAPISettings({ apiKey: e.target.value })}
                    placeholder="輸入API金鑰"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <NumberInput
                    label="連線逾時 (秒)"
                    value={settings.api.timeout}
                    onChange={(value) => updateAPISettings({ timeout: Math.round(value) })}
                    min={5}
                    max={300}
                    step={1}
                    precision={0}
                  />
                  <NumberInput
                    label="重試次數"
                    value={settings.api.retryCount}
                    onChange={(value) => updateAPISettings({ retryCount: Math.round(value) })}
                    min={0}
                    max={10}
                    step={1}
                    precision={0}
                  />
                  <NumberInput
                    label="更新間隔 (分鐘)"
                    value={settings.api.refreshInterval}
                    onChange={(value) => updateAPISettings({ refreshInterval: Math.round(value) })}
                    min={1}
                    max={60}
                    step={1}
                    precision={0}
                  />
                </div>

                {/* API測試區域 */}
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">API 連線測試</Label>
                      <p className="text-sm text-muted-foreground">測試當前API設定是否能正常連線</p>
                    </div>
                    <Button
                      onClick={testApiConnection}
                      disabled={apiTesting}
                      variant="outline"
                      className="shrink-0"
                    >
                      {apiTesting ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                          測試中...
                        </>
                      ) : (
                        <>
                          <TestTube className="w-4 h-4 mr-2" />
                          測試連線
                        </>
                      )}
                    </Button>
                  </div>

                  {/* 測試結果顯示 */}
                  {apiTestResult && (
                    <div className={`p-4 rounded-lg border ${
                      apiTestResult.success 
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' 
                        : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {apiTestResult.success ? (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className={`font-medium ${
                            apiTestResult.success 
                              ? 'text-green-800 dark:text-green-100' 
                              : 'text-red-800 dark:text-red-100'
                          }`}>
                            {apiTestResult.success ? '連線成功' : '連線失敗'}
                          </p>
                          <p className={`text-sm ${
                            apiTestResult.success 
                              ? 'text-green-700 dark:text-green-200' 
                              : 'text-red-700 dark:text-red-200'
                          }`}>
                            {apiTestResult.message}
                          </p>
                          
                          {/* 顯示API返回的簡要資料 */}
                          {apiTestResult.success && apiTestResult.data?.bodyDetails && (
                            <details className="mt-3">
                              <summary className={`cursor-pointer text-sm font-medium ${
                                apiTestResult.success 
                                  ? 'text-green-700 dark:text-green-200' 
                                  : 'text-red-700 dark:text-red-200'
                              }`}>
                                查看返回資料概要
                              </summary>
                              <div className="mt-2 p-3 bg-white dark:bg-gray-900 rounded border text-xs">
                                <p><strong>總計:</strong> {apiTestResult.data.bodyDetails.length} 筆醫院資料</p>
                                <p><strong>範例醫院:</strong></p>
                                <ul className="mt-1 ml-4 space-y-1">
                                  {apiTestResult.data.bodyDetails.slice(0, 3).map((hospital: any, index: number) => (
                                    <li key={index}>
                                      {hospital.hospitalNickName} (EDCI: {hospital.edci})
                                    </li>
                                  ))}
                                  {apiTestResult.data.bodyDetails.length > 3 && (
                                    <li>... 以及其他 {apiTestResult.data.bodyDetails.length - 3} 筆資料</li>
                                  )}
                                </ul>
                              </div>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 操作按鈕 */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            重設預設值
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges}
              className="bg-medical-primary hover:bg-medical-primary/90"
            >
              <Save className="w-4 h-4 mr-1" />
              儲存設定
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}