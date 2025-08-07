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
import { RefreshCw, Settings, Bell, Activity, Wifi, WifiOff, Shield, Users, Building2 } from 'lucide-react';
import { useApiData } from '@/hooks/useApiData';
import { useToast } from '@/hooks/use-toast';
import { useHospitalFilter } from '@/hooks/useHospitalFilter';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { UserMenu } from '@/components/UserMenu';
import { format } from 'date-fns';

const Index = () => {
  const [selectedHospital, setSelectedHospital] = useState<HospitalData | undefined>();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { hospitals, loading, error, fetchHospitalData, refetch } = useApiData();
  const { toast } = useToast();
  const { currentUser, hasPermission } = useLocalAuth();
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
    toast({
      title: '資料更新中',
      description: '正在重新載入最新的醫院資料...',
    });
  };

  // 獲取連線狀態
  const connectionStatus = error ? 'error' : loading ? 'connecting' : 'connected';

  return (
    <div className="min-h-screen command-center-theme">
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="command-card-elevated px-8 py-6 flex items-center justify-between border-b border-border shadow-header">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-primary/20 rounded-2xl backdrop-blur-sm border border-primary/30">
                <Activity className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h1 className="text-command-xl text-primary">醫院急診擁擠指數監控中心</h1>
                <div className="flex items-center gap-4 text-command-base mt-2">
                  <div className={`w-3 h-3 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-status-normal shadow-lg shadow-green-500/30' : 
                    connectionStatus === 'connecting' ? 'bg-status-warning shadow-lg shadow-yellow-500/30 animate-pulse' : 
                    'bg-status-critical shadow-lg shadow-red-500/30'
                  }`}></div>
                  <span className="font-medium text-text-primary">
                    {connectionStatus === 'connected' ? '系統正常運行' : 
                     connectionStatus === 'connecting' ? '正在連線中...' : '連線異常'}
                  </span>
                  {lastUpdated && (
                    <>
                      <span className="mx-3 text-text-disabled">•</span>
                      <span className="text-text-secondary">
                        最後更新: {format(lastUpdated, 'HH:mm:ss')}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleRefresh} 
                disabled={loading}
                className={`command-btn command-btn-secondary gap-3 ${loading ? 'opacity-50' : ''}`}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                重新整理
              </button>
              <button className="command-btn command-btn-secondary gap-3">
                <Bell className="w-5 h-5" />
                通知設定
              </button>
              {hasPermission('settings:manage') && <SettingsDialog />}
              <UserMenu onSettingsClick={() => {}} />
            </div>
          </header>

          {/* User Info */}
          {currentUser && (
            <div className="command-card px-8 py-4 border-b border-border">
              <div className="text-command-base flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-info-primary" />
                  <span className="text-text-secondary">操作員:</span>
                  <span className="text-primary font-semibold">{currentUser.username}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-info-secondary" />
                  <span className="text-text-secondary">權限等級:</span>
                  <span className={`font-semibold px-3 py-1 rounded-lg ${
                    currentUser.role === 'admin' ? 'bg-status-critical/20 text-status-critical' :
                    currentUser.role === 'operator' ? 'bg-status-warning/20 text-status-warning' : 
                    'bg-status-normal/20 text-status-normal'
                  }`}>
                    {currentUser.role === 'admin' ? '系統管理員' : 
                     currentUser.role === 'operator' ? '操作人員' : '觀察人員'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-info-primary" />
                  <span className="text-text-secondary">監控範圍:</span>
                  <span className="text-info-primary font-semibold">{filteredHospitals.length} 家醫療機構</span>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="command-grid command-grid-lg">
              <StatusOverview hospitals={filteredHospitals} />
              
              <Tabs defaultValue="overview" className="mt-8">
                <TabsList className="grid w-full grid-cols-4 bg-command-center-elevated p-2 rounded-xl shadow-card">
                  <TabsTrigger 
                    value="overview" 
                    className="text-command-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-card"
                  >
                    總覽儀表板
                  </TabsTrigger>
                  <TabsTrigger 
                    value="map" 
                    className="text-command-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-card"
                  >
                    地理位置檢視
                  </TabsTrigger>
                  <TabsTrigger 
                    value="trends" 
                    className="text-command-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-card"
                  >
                    趨勢分析
                  </TabsTrigger>
                  <TabsTrigger 
                    value="export" 
                    className="text-command-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-card"
                  >
                    資料匯出
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-8 mt-8">
                  <div className="command-grid command-grid-lg">
                    {filteredHospitals.map((hospital) => (
                      <HospitalCard
                        key={hospital.hospitalCode}
                        hospital={hospital}
                        onClick={() => setSelectedHospital(hospital)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="map" className="space-y-8 mt-8">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2">
                      <HospitalMap
                        hospitals={filteredHospitals}
                        selectedHospital={selectedHospital}
                        onHospitalSelect={setSelectedHospital}
                      />
                    </div>
                    {selectedHospital && (
                      <div className="space-y-6">
                        <HospitalCard hospital={selectedHospital} onClick={() => setSelectedHospital(selectedHospital)} />
                        <Card className="command-card p-6">
                          <h3 className="text-command-lg mb-4 text-primary">詳細資訊</h3>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="data-metric">
                              <span className="data-label">醫院代碼</span>
                              <span className="data-value text-command-md">{selectedHospital.hospitalCode}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="data-metric">
                                <span className="data-label">病人總數</span>
                                <span className="data-value text-command-lg">{selectedHospital.patientTn}</span>
                              </div>
                              <div className="data-metric">
                                <span className="data-label">EDCI 指數</span>
                                <span className="data-value text-command-lg text-primary">{selectedHospital.edci}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="trends" className="space-y-8 mt-8">
                  <TrendsView 
                    hospitals={filteredHospitals}
                    selectedHospital={selectedHospital}
                    onHospitalSelect={setSelectedHospital}
                  />
                </TabsContent>

                <TabsContent value="export" className="space-y-8 mt-8">
                  {hasPermission('export_data') ? (
                    <DataExport hospitals={filteredHospitals} />
                  ) : (
                    <div className="command-card p-12 text-center">
                      <div className="text-command-lg text-text-secondary">您沒有權限匯出資料</div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;