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
import { useHospitalFilter } from '@/hooks/useHospitalFilter';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [selectedHospital, setSelectedHospital] = useState<HospitalData | undefined>();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { hospitals, loading, error, fetchHospitalData, refetch } = useApiData();
  const { toast } = useToast();
  const { currentUser, hasPermission } = useAuth();
  const filteredHospitals = useHospitalFilter(hospitals);

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
    <div className="min-h-screen dashboard-bg">
      {/* Header */}
      <header className="dashboard-header text-white">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Activity className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl xl:text-4xl font-bold text-white">
                  急診壅塞指數儀表板
                </h1>
                <p className="text-lg xl:text-xl text-white/90 mt-1">
                  桃園市責任醫院 EDCI 監控系統
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                {error ? (
                  <WifiOff className="w-5 h-5 text-red-300" />
                ) : (
                  <Wifi className="w-5 h-5 text-green-300" />
                )}
                <Badge variant="outline" className="text-sm bg-white/20 text-white border-white/30">
                  最後更新：{lastUpdated.toLocaleTimeString('zh-TW')}
                </Badge>
              </div>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleRefresh}
                disabled={loading}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-6 py-3"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                更新資料
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-6 py-3"
              >
                <Bell className="w-5 h-5 mr-2" />
                通知設定
              </Button>
              
              <SettingsDialog />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Status Overview */}
        <div className="mb-8">
          <StatusOverview hospitals={filteredHospitals} />
        </div>

        {/* User Info */}
        <div className="mb-6 p-4 bg-white/80 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                目前使用者：<span className="font-medium text-foreground">{currentUser?.username}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                權限等級：<span className="font-medium text-foreground">{currentUser?.role}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                可查看醫院：<span className="font-medium text-foreground">{filteredHospitals.length} 家</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 h-14 p-1 bg-white/90 shadow-lg">
            <TabsTrigger value="overview" className="text-lg font-medium h-12">總覽</TabsTrigger>
            <TabsTrigger value="map" className="text-lg font-medium h-12">地圖</TabsTrigger>
            <TabsTrigger value="trends" className="text-lg font-medium h-12">趨勢</TabsTrigger>
            <TabsTrigger value="export" className="text-lg font-medium h-12">匯出</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredHospitals.map((hospital) => (
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
                hospitals={filteredHospitals}
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
              hospitals={filteredHospitals}
              selectedHospital={selectedHospital}
              onHospitalSelect={setSelectedHospital}
            />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            {hasPermission('export_data') ? (
              <DataExport hospitals={filteredHospitals} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                您沒有權限匯出資料
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;