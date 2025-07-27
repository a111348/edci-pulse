import { Card } from '@/components/ui/card';
import { HospitalData } from '@/types/hospital';
import { Shield, AlertTriangle, AlertCircle, Activity } from 'lucide-react';

interface StatusOverviewProps {
  hospitals: HospitalData[];
}

export function StatusOverview({ hospitals }: StatusOverviewProps) {
  const normalCount = hospitals.filter(h => h.edciStatus === 'normal').length;
  const warningCount = hospitals.filter(h => h.edciStatus === 'warning').length;
  const criticalCount = hospitals.filter(h => h.edciStatus === 'critical').length;
  
  const totalPatients = hospitals.reduce((sum, h) => sum + h.patientTn, 0);
  const averageEDCI = hospitals.length > 0 
    ? Math.round((hospitals.reduce((sum, h) => sum + h.edci, 0) / hospitals.length) * 100) / 100
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{hospitals.length}</div>
            <div className="text-sm text-muted-foreground">總醫院數</div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-status-normal/10 to-status-normal/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-status-normal/20 rounded-lg">
            <Shield className="w-5 h-5 text-status-normal" />
          </div>
          <div>
            <div className="text-2xl font-bold text-status-normal">{normalCount}</div>
            <div className="text-sm text-muted-foreground">正常狀態</div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-status-warning/10 to-status-warning/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-status-warning/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-status-warning" />
          </div>
          <div>
            <div className="text-2xl font-bold text-status-warning">{warningCount}</div>
            <div className="text-sm text-muted-foreground">預警狀態</div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-status-critical/10 to-status-critical/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-status-critical/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-status-critical" />
          </div>
          <div>
            <div className="text-2xl font-bold text-status-critical">{criticalCount}</div>
            <div className="text-sm text-muted-foreground">嚴重狀態</div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-medical-accent/10 to-medical-accent/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-medical-accent/20 rounded-lg">
            <Activity className="w-5 h-5 text-medical-accent" />
          </div>
          <div>
            <div className="text-2xl font-bold text-medical-accent">{averageEDCI}</div>
            <div className="text-sm text-muted-foreground">平均EDCI</div>
          </div>
        </div>
      </Card>
    </div>
  );
}