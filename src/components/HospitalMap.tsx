import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HospitalData } from '@/types/hospital';

interface HospitalMapProps {
  hospitals: HospitalData[];
  selectedHospital?: HospitalData;
  onHospitalSelect?: (hospital: HospitalData) => void;
}

export function HospitalMap({ hospitals, selectedHospital, onHospitalSelect }: HospitalMapProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-status-normal';
      case 'warning': return 'bg-status-warning';
      case 'critical': return 'bg-status-critical';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          桃園市醫院分佈地圖
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 桃園市地圖背景 */}
        <div className="relative bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 rounded-lg p-4 h-96 overflow-hidden border-2 border-dashed border-muted">
          {/* 桃園市區域標示 */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* 簡化的桃園市輪廓 */}
              <path 
                d="M50 80 L150 60 L250 70 L320 90 L350 150 L320 220 L250 240 L150 230 L80 210 L50 150 Z" 
                fill="hsl(var(--primary))" 
                opacity="0.1"
                stroke="hsl(var(--primary))" 
                strokeWidth="1"
              />
              {/* 主要道路標示 */}
              <line x1="50" y1="150" x2="350" y2="150" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.3"/>
              <line x1="200" y1="60" x2="200" y2="240" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.3"/>
            </svg>
          </div>

          {/* 區域標籤 */}
          <div className="absolute top-4 left-4 text-xs text-muted-foreground font-medium">桃園市</div>
          <div className="absolute top-6 right-4 text-xs text-muted-foreground">中壢區</div>
          <div className="absolute bottom-6 left-6 text-xs text-muted-foreground">大溪區</div>
          
          {/* 醫院標記 - 使用實際桃園醫院分佈概念 */}
          <div className="relative h-full">
            {hospitals.map((hospital, index) => {
              const isSelected = selectedHospital?.id === hospital.id;
              
              // 根據醫院代碼分配大致位置（模擬桃園市內分佈）
              const positions = [
                { x: 25, y: 30 }, // 林口長庚
                { x: 40, y: 45 }, // 桃園醫院
                { x: 55, y: 40 }, // 聖保祿
                { x: 70, y: 55 }, // 中壢天晟
                { x: 45, y: 65 }, // 怡仁
                { x: 30, y: 75 }, // 聯新國際
                { x: 65, y: 35 }, // 敏盛
                { x: 80, y: 70 }, // 壢新
                { x: 35, y: 25 }, // 台北榮總桃園分院
                { x: 75, y: 45 }, // 中壢長榮
                { x: 85, y: 60 }, // 其他醫院
              ];
              
              const position = positions[index] || { x: 50, y: 50 };
              
              return (
                <div
                  key={hospital.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                    isSelected ? 'scale-125 z-10' : 'hover:scale-110 z-0'
                  }`}
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                  onClick={() => onHospitalSelect?.(hospital)}
                >
                  {/* 醫院標記點 */}
                  <div className={`
                    w-5 h-5 rounded-full border-2 border-white shadow-lg transition-all
                    ${getStatusColor(hospital.edciStatus)}
                    ${isSelected ? 'ring-2 ring-primary ring-offset-1' : ''}
                  `}>
                    {/* 中心點 */}
                    <div className="w-1 h-1 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                  
                  {/* 醫院資訊卡片 */}
                  <div className={`
                    absolute top-7 left-1/2 transform -translate-x-1/2
                    bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap border
                    transition-opacity duration-200
                    ${isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'}
                  `}>
                    <div className="font-medium text-foreground">{hospital.hospitalName}</div>
                    <div className="text-muted-foreground">EDCI: {hospital.edci}</div>
                    <div className="text-muted-foreground">
                      病人數: {hospital.patientTn} | 醫師: {hospital.attphysicianNum + hospital.resiphysicianNum}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 地圖說明 */}
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded">
            點擊醫院圖標查看詳情
          </div>
        </div>

        {/* 圖例 */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-status-normal rounded-full border border-white shadow-sm"></div>
            <span>正常 (&lt;15)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-status-warning rounded-full border border-white shadow-sm"></div>
            <span>預警 (15-25)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-status-critical rounded-full border border-white shadow-sm"></div>
            <span>嚴重 (≥25)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}