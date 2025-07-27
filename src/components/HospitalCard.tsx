import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HospitalData } from '@/types/hospital';
import { getStatusInfo } from '@/utils/edci';
import { Clock, Users, Stethoscope, Activity } from 'lucide-react';

interface HospitalCardProps {
  hospital: HospitalData;
  onClick?: () => void;
}

export function HospitalCard({ hospital, onClick }: HospitalCardProps) {
  const statusInfo = getStatusInfo(hospital.edciStatus);
  
  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 ${
        hospital.edciStatus === 'critical' ? 'border-l-status-critical' :
        hospital.edciStatus === 'warning' ? 'border-l-status-warning' :
        'border-l-status-normal'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground mb-1">
            {hospital.hospitalName}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(hospital.reportDatetime).toLocaleString('zh-TW')}
          </p>
        </div>
        <Badge 
          className={`${statusInfo.bgColor} ${statusInfo.textColor} font-medium`}
        >
          {statusInfo.icon} {statusInfo.label}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {hospital.edci}
          </div>
          <div className="text-xs text-muted-foreground">EDCI指數</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {hospital.patientTn}
          </div>
          <div className="text-xs text-muted-foreground">總病人數</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-3 h-3" />
            醫師人力
          </span>
          <span className="font-medium">
            {hospital.attphysicianNum + hospital.resiphysicianNum}人
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Stethoscope className="w-3 h-3" />
            主治/住院
          </span>
          <span className="font-medium">
            {hospital.attphysicianNum}/{hospital.resiphysicianNum}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Activity className="w-3 h-3" />
            分級分佈
          </span>
          <span className="font-medium text-xs">
            L1:{hospital.patientLvl1} L2:{hospital.patientLvl2} L3:{hospital.patientLvl3}
          </span>
        </div>
      </div>
    </Card>
  );
}