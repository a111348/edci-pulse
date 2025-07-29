import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EDCICalculationSettings } from '@/types/settings';
import { defaultSettings, SETTINGS_STORAGE_KEY } from '@/data/settings';

export function EDCISettingsTab() {
  const [settings, setSettings] = useState<EDCICalculationSettings>(defaultSettings.edciCalculation);
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.edciCalculation) {
          setSettings(parsed.edciCalculation);
        }
      } catch (error) {
        console.error('Failed to load EDCI settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    try {
      const existingSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const allSettings = existingSettings ? JSON.parse(existingSettings) : defaultSettings;
      
      allSettings.edciCalculation = settings;
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
      
      toast({
        title: "設定已儲存",
        description: "EDCI 計算設定已成功更新",
      });
    } catch (error) {
      toast({
        title: "儲存失敗",
        description: "無法儲存 EDCI 設定",
        variant: "destructive",
      });
    }
  };

  const updateSetting = (key: keyof EDCICalculationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>EDCI v2 計算參數設定</CardTitle>
          <CardDescription>
            設定 EDCI 壅塞指數的各項權重參數和分級門檻
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">醫師加權病人數權重</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="doctorL1Weight" className="w-16">L1:</Label>
                  <Input
                    id="doctorL1Weight"
                    type="number"
                    step="0.1"
                    value={settings.doctorWeights.l1}
                    onChange={(e) => updateSetting('doctorWeights', { ...settings.doctorWeights, l1: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="doctorL2Weight" className="w-16">L2:</Label>
                  <Input
                    id="doctorL2Weight"
                    type="number"
                    step="0.1"
                    value={settings.doctorWeights.l2}
                    onChange={(e) => updateSetting('doctorWeights', { ...settings.doctorWeights, l2: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="doctorL3Weight" className="w-16">L3:</Label>
                  <Input
                    id="doctorL3Weight"
                    type="number"
                    step="0.1"
                    value={settings.doctorWeights.l3}
                    onChange={(e) => updateSetting('doctorWeights', { ...settings.doctorWeights, l3: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="doctorL4Weight" className="w-16">L4:</Label>
                  <Input
                    id="doctorL4Weight"
                    type="number"
                    step="0.1"
                    value={settings.doctorWeights.l4}
                    onChange={(e) => updateSetting('doctorWeights', { ...settings.doctorWeights, l4: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="doctorL5Weight" className="w-16">L5:</Label>
                  <Input
                    id="doctorL5Weight"
                    type="number"
                    step="0.1"
                    value={settings.doctorWeights.l5}
                    onChange={(e) => updateSetting('doctorWeights', { ...settings.doctorWeights, l5: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm">護理加權病人數權重</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="nurseL1Weight" className="w-16">L1:</Label>
                  <Input
                    id="nurseL1Weight"
                    type="number"
                    step="0.1"
                    value={settings.nurseWeights.l1}
                    onChange={(e) => updateSetting('nurseWeights', { ...settings.nurseWeights, l1: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="nurseL2Weight" className="w-16">L2:</Label>
                  <Input
                    id="nurseL2Weight"
                    type="number"
                    step="0.1"
                    value={settings.nurseWeights.l2}
                    onChange={(e) => updateSetting('nurseWeights', { ...settings.nurseWeights, l2: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="nurseL3Weight" className="w-16">L3:</Label>
                  <Input
                    id="nurseL3Weight"
                    type="number"
                    step="0.1"
                    value={settings.nurseWeights.l3}
                    onChange={(e) => updateSetting('nurseWeights', { ...settings.nurseWeights, l3: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="nurseL4Weight" className="w-16">L4:</Label>
                  <Input
                    id="nurseL4Weight"
                    type="number"
                    step="0.1"
                    value={settings.nurseWeights.l4}
                    onChange={(e) => updateSetting('nurseWeights', { ...settings.nurseWeights, l4: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="nurseL5Weight" className="w-16">L5:</Label>
                  <Input
                    id="nurseL5Weight"
                    type="number"
                    step="0.1"
                    value={settings.nurseWeights.l5}
                    onChange={(e) => updateSetting('nurseWeights', { ...settings.nurseWeights, l5: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">其他權重設定</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="residentFactor" className="w-32">住院醫師係數:</Label>
                  <Input
                    id="residentFactor"
                    type="number"
                    step="0.1"
                    value={settings.residentDoctorFactor}
                    onChange={(e) => updateSetting('residentDoctorFactor', parseFloat(e.target.value) || 0)}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="pbrWeight" className="w-32">PBR 權重:</Label>
                  <Input
                    id="pbrWeight"
                    type="number"
                    step="0.1"
                    value={settings.finalWeights.pbrWeight}
                    onChange={(e) => updateSetting('finalWeights', { ...settings.finalWeights, pbrWeight: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="nbrWeight" className="w-32">NBR 權重:</Label>
                  <Input
                    id="nbrWeight"
                    type="number"
                    step="0.1"
                    value={settings.finalWeights.nbrWeight}
                    onChange={(e) => updateSetting('finalWeights', { ...settings.finalWeights, nbrWeight: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="waitingWeight" className="w-32">等待住院權重:</Label>
                  <Input
                    id="waitingWeight"
                    type="number"
                    step="0.1"
                    value={settings.finalWeights.waitingAdmissionWeight}
                    onChange={(e) => updateSetting('finalWeights', { ...settings.finalWeights, waitingAdmissionWeight: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="over24Weight" className="w-32">超過24小時權重:</Label>
                  <Input
                    id="over24Weight"
                    type="number"
                    step="0.1"
                    value={settings.finalWeights.over24HourWeight}
                    onChange={(e) => updateSetting('finalWeights', { ...settings.finalWeights, over24HourWeight: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm">分級門檻設定</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="normalThreshold" className="w-32">正常門檻 (&lt;):</Label>
                  <Input
                    id="normalThreshold"
                    type="number"
                    step="0.1"
                    value={settings.thresholds.normal}
                    onChange={(e) => updateSetting('thresholds', { ...settings.thresholds, normal: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">綠色</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="warningThreshold" className="w-32">預警門檻 (&lt;):</Label>
                  <Input
                    id="warningThreshold"
                    type="number"
                    step="0.1"
                    value={settings.thresholds.warning}
                    onChange={(e) => updateSetting('thresholds', { ...settings.thresholds, warning: parseFloat(e.target.value) || 0 })}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">黃色</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  嚴重異常 (≥ {settings.thresholds.warning}): 紅色
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              儲存設定
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}