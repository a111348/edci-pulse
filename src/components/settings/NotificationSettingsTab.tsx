import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NotificationSettings } from '@/types/settings';
import { defaultSettings, SETTINGS_STORAGE_KEY } from '@/data/settings';

export function NotificationSettingsTab() {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings.notifications);
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.notifications) {
          setSettings(parsed.notifications);
        }
      } catch (error) {
        console.error('Failed to load notification settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    try {
      const existingSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const allSettings = existingSettings ? JSON.parse(existingSettings) : defaultSettings;
      
      allSettings.notifications = settings;
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
      
      toast({
        title: "設定已儲存",
        description: "通知設定已成功更新",
      });
    } catch (error) {
      toast({
        title: "儲存失敗",
        description: "無法儲存通知設定",
        variant: "destructive",
      });
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            電子郵件通知設定
          </CardTitle>
          <CardDescription>
            設定電子郵件通知的相關參數
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.email.enabled}
              onCheckedChange={(checked) => updateSetting('email', { ...settings.email, enabled: checked })}
            />
            <Label>啟用電子郵件通知</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emailServer">SMTP 伺服器</Label>
              <Input
                id="emailServer"
                placeholder="smtp.gmail.com"
                value={settings.email.smtpServer}
                onChange={(e) => updateSetting('email', { ...settings.email, smtpServer: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailPort">連接埠</Label>
              <Input
                id="emailPort"
                type="number"
                placeholder="587"
                value={settings.email.port}
                onChange={(e) => updateSetting('email', { ...settings.email, port: parseInt(e.target.value) || 587 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emailUsername">使用者名稱</Label>
              <Input
                id="emailUsername"
                placeholder="your-email@gmail.com"
                value={settings.email.username}
                onChange={(e) => updateSetting('email', { ...settings.email, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailPassword">密碼</Label>
              <Input
                id="emailPassword"
                type="password"
                placeholder="應用程式密碼"
                value={settings.email.password}
                onChange={(e) => updateSetting('email', { ...settings.email, password: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailRecipients">收件者 (以逗號分隔)</Label>
            <Input
              id="emailRecipients"
              placeholder="admin@hospital.com, manager@hospital.com"
              value={settings.email.recipients.join(', ')}
              onChange={(e) => updateSetting('email', { 
                ...settings.email, 
                recipients: e.target.value.split(',').map(email => email.trim()).filter(email => email)
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            三竹簡訊通知設定
          </CardTitle>
          <CardDescription>
            設定三竹資訊簡訊服務的相關參數
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.sms.enabled}
              onCheckedChange={(checked) => updateSetting('sms', { ...settings.sms, enabled: checked })}
            />
            <Label>啟用簡訊通知</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mitakeUsername">三竹帳號</Label>
              <Input
                id="mitakeUsername"
                placeholder="您的三竹帳號"
                value={settings.sms.mitakeUsername}
                onChange={(e) => updateSetting('sms', { ...settings.sms, mitakeUsername: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mitakePassword">三竹密碼</Label>
              <Input
                id="mitakePassword"
                type="password"
                placeholder="您的三竹密碼"
                value={settings.sms.mitakePassword}
                onChange={(e) => updateSetting('sms', { ...settings.sms, mitakePassword: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mitakeApiUrl">三竹 API 網址</Label>
            <Input
              id="mitakeApiUrl"
              placeholder="https://smexpress.mitake.com.tw:9600/SmSendGet.asp"
              value={settings.sms.mitakeApiUrl}
              onChange={(e) => updateSetting('sms', { ...settings.sms, mitakeApiUrl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smsRecipients">收訊號碼 (以逗號分隔)</Label>
            <Input
              id="smsRecipients"
              placeholder="0912345678, 0987654321"
              value={settings.sms.recipients.join(', ')}
              onChange={(e) => updateSetting('sms', { 
                ...settings.sms, 
                recipients: e.target.value.split(',').map(phone => phone.trim()).filter(phone => phone)
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>通知門檻設定</CardTitle>
          <CardDescription>
            設定觸發通知的 EDCI 門檻值
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="warningThreshold">預警門檻</Label>
              <Input
                id="warningThreshold"
                type="number"
                step="0.1"
                value={settings.thresholds.warning}
                onChange={(e) => updateSetting('thresholds', { 
                  ...settings.thresholds, 
                  warning: parseFloat(e.target.value) || 0 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="criticalThreshold">嚴重門檻</Label>
              <Input
                id="criticalThreshold"
                type="number"
                step="0.1"
                value={settings.thresholds.critical}
                onChange={(e) => updateSetting('thresholds', { 
                  ...settings.thresholds, 
                  critical: parseFloat(e.target.value) || 0 
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationInterval">通知間隔 (分鐘)</Label>
            <Input
              id="notificationInterval"
              type="number"
              placeholder="30"
              value={settings.notificationInterval}
              onChange={(e) => updateSetting('notificationInterval', parseInt(e.target.value) || 30)}
            />
            <p className="text-sm text-muted-foreground">
              避免重複通知，設定最小通知間隔時間
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          儲存設定
        </Button>
      </div>
    </div>
  );
}