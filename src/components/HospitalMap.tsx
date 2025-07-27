import { Card } from '@/components/ui/card';
import { HospitalData } from '@/types/hospital';
import { getStatusInfo } from '@/utils/edci';
import { MapPin, Navigation } from 'lucide-react';

interface HospitalMapProps {
  hospitals: HospitalData[];
  selectedHospital?: HospitalData;
  onHospitalSelect?: (hospital: HospitalData) => void;
}

export function HospitalMap({ hospitals, selectedHospital, onHospitalSelect }: HospitalMapProps) {
  // 計算桃園市中心座標作為地圖中心
  const centerLat = 24.9936;
  const centerLng = 121.3010;
  
  // 簡化的地圖視覺化（由於無法使用真實地圖API，使用模擬展示）
  return (
    <Card className="p-6 h-96 relative bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-blue-200 via-green-100 to-blue-200"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Navigation className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">桃園市醫院分佈圖</h3>
        </div>
        
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {hospitals.map((hospital) => {
            const statusInfo = getStatusInfo(hospital.edciStatus);
            const isSelected = selectedHospital?.id === hospital.id;
            
            return (
              <div
                key={hospital.id}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary/20 border-2 border-primary' 
                    : 'bg-white/70 hover:bg-white/90'
                }`}
                onClick={() => onHospitalSelect?.(hospital)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${statusInfo.bgColor} flex-shrink-0`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{hospital.hospitalName}</div>
                    <div className="text-xs text-muted-foreground">
                      EDCI: {hospital.edci} | {statusInfo.label}
                    </div>
                  </div>
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-white/80 rounded-lg">
          <div className="text-sm font-medium mb-2">圖例</div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-status-normal"></div>
              <span>正常</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-status-warning"></div>
              <span>預警</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-status-critical"></div>
              <span>嚴重</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}