import { useState, useEffect } from 'react';
import { HospitalData } from '@/types/hospital';
import { StatusOverview } from '@/components/StatusOverview';
import { HospitalCard } from '@/components/HospitalCard';
import { HospitalMap } from '@/components/HospitalMap';
import { TrendsView } from '@/components/TrendsView';
import { DataExport } from '@/components/DataExport';
import { SettingsDialog } from '@/components/SettingsDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Settings, Bell, Activity, Wifi, WifiOff } from 'lucide-react';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedHospital, setSelectedHospital] = useState<HospitalData | undefined>();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { hospitals, loading, error, fetchHospitalData, refetch } = useApiData();
  const { toast } = useToast();

  // 初始載入資料
  useEffect(() => {
    fetchHospitalData();
  }, []);

  // 自動更新（每5分鐘）
  useEffect(() => {
    const interval = setInterval(() => {
      fetchHospitalData();
      setLastUpdated(new Date());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // 顯示錯誤訊息
  useEffect(() => {
    if (error) {
      toast({
        title: '資料載入警告',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleRefresh = () => {
    refetch();
    setLastUpdated(new Date());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  急診壅塞指數儀表板
                </h1>
                <p className="text-sm text-muted-foreground">
                  桃園市責任醫院 EDCI 監控系統
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {error ? (
                  <WifiOff className="w-4 h-4 text-destructive" />
                ) : (
                  <Wifi className="w-4 h-4 text-status-normal" />
                )}
                <Badge variant="outline" className="text-xs">
                  最後更新：{lastUpdated.toLocaleTimeString('zh-TW')}
                </Badge>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                更新
              </Button>
              
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-1" />
                通知
              </Button>
              
              <SettingsDialog />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Status Overview */}
        <StatusOverview hospitals={hospitals} />

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">總覽</TabsTrigger>
            <TabsTrigger value="map">地圖</TabsTrigger>
            <TabsTrigger value="trends">趨勢</TabsTrigger>
            <TabsTrigger value="export">匯出</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hospitals.map((hospital) => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  onClick={() => setSelectedHospital(hospital)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HospitalMap
                hospitals={hospitals}
                selectedHospital={selectedHospital}
                onHospitalSelect={setSelectedHospital}
              />
              
              {selectedHospital && (
                <div className="space-y-4">
                  <HospitalCard hospital={selectedHospital} />
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">詳細資訊</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">醫院代碼：</span>
                        <span className="font-medium">{selectedHospital.hospitalCode}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">病人總數：</span>
                        <span className="font-medium">{selectedHospital.patientTn}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">L1 病人：</span>
                        <span className="font-medium">{selectedHospital.patientLvl1}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">L2 病人：</span>
                        <span className="font-medium">{selectedHospital.patientLvl2}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">L3 病人：</span>
                        <span className="font-medium">{selectedHospital.patientLvl3}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">L4 病人：</span>
                        <span className="font-medium">{selectedHospital.patientLvl4}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">L5 病人：</span>
                        <span className="font-medium">{selectedHospital.patientLvl5}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">主治醫師：</span>
                        <span className="font-medium">{selectedHospital.attphysicianNum}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">住院醫師：</span>
                        <span className="font-medium">{selectedHospital.resiphysicianNum}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">EDCI 指數：</span>
                        <span className="font-bold text-primary">{selectedHospital.edci}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <TrendsView 
              hospitals={hospitals}
              selectedHospital={selectedHospital}
              onHospitalSelect={setSelectedHospital}
            />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <DataExport hospitals={hospitals} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;