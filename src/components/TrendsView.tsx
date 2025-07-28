import { useState } from 'react';
import { TrendChart } from '@/components/TrendChart';
import { HospitalData } from '@/types/hospital';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, TrendingUp } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface TrendsViewProps {
  hospitals: HospitalData[];
  selectedHospital?: HospitalData;
  onHospitalSelect: (hospital: HospitalData) => void;
}

export function TrendsView({ hospitals, selectedHospital, onHospitalSelect }: TrendsViewProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subDays(new Date(), 7), // 預設顯示過去7天
    to: new Date(),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-status-normal';
      case 'warning': return 'bg-status-warning';
      case 'critical': return 'bg-status-critical';
      default: return 'bg-gray-400';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'normal': return 'default';
      case 'warning': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* 日期選擇器 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              時間範圍選擇
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange({
                  from: subDays(new Date(), 1),
                  to: new Date()
                })}
              >
                24小時
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange({
                  from: subDays(new Date(), 3),
                  to: new Date()
                })}
              >
                3天
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange({
                  from: subDays(new Date(), 7),
                  to: new Date()
                })}
              >
                7天
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">開始日期</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "yyyy/MM/dd") : "選擇日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium">結束日期</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "yyyy/MM/dd") : "選擇日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 趨勢圖表 */}
      {selectedHospital ? (
        <TrendChart 
          hospitalCode={selectedHospital.hospitalCode} 
          hospitalName={selectedHospital.hospitalName}
          dateRange={dateRange}
        />
      ) : (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <TrendingUp className="w-12 h-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold mb-2">請選擇醫院</h3>
              <p className="text-muted-foreground mb-6">從下方醫院列表中選擇一家醫院以查看趨勢圖表</p>
            </div>
          </div>
        </Card>
      )}

      {/* 醫院選擇列表 */}
      <Card>
        <CardHeader>
          <CardTitle>醫院列表</CardTitle>
          <p className="text-sm text-muted-foreground">點擊醫院卡片查看對應的EDCI趨勢圖表</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {hospitals.map((hospital) => (
              <Card
                key={hospital.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                  selectedHospital?.id === hospital.id 
                    ? "border-primary shadow-md bg-primary/5" 
                    : "border-transparent hover:border-muted"
                )}
                onClick={() => onHospitalSelect(hospital)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* 醫院名稱和狀態 */}
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-sm leading-tight">
                        {hospital.hospitalName}
                      </h4>
                      <div className={cn(
                        "w-3 h-3 rounded-full flex-shrink-0 mt-0.5",
                        getStatusColor(hospital.edciStatus)
                      )} />
                    </div>

                    {/* EDCI 指數 */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">EDCI 指數</span>
                        <Badge variant={getStatusVariant(hospital.edciStatus)} className="text-xs">
                          {hospital.edci}
                        </Badge>
                      </div>
                    </div>

                    {/* 關鍵指標 */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">病人數</span>
                        <div className="font-medium">{hospital.patientTn}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">醫師數</span>
                        <div className="font-medium">
                          {hospital.attphysicianNum + hospital.resiphysicianNum}
                        </div>
                      </div>
                    </div>

                    {/* 分級病人分佈 */}
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">L1-L5:</span>
                      <span className="font-mono">
                        {hospital.patientLvl1}-{hospital.patientLvl2}-{hospital.patientLvl3}-{hospital.patientLvl4}-{hospital.patientLvl5}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}