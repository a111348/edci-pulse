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
    <div className="grid grid-cols-5 gap-6 mb-8">
      <Card className="p-6 bg-command-center-card border-command-center-elevated/20 hover:bg-command-center-elevated transition-colors">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-info-primary/20 rounded-xl">
            <Activity className="w-6 h-6 text-info-primary" />
          </div>
          <div>
            <div className="text-3xl font-bold text-text-primary">{hospitals.length}</div>
            <div className="text-sm text-text-secondary">總醫院數</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-command-center-card border-command-center-elevated/20 hover:bg-command-center-elevated transition-colors">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-status-normal/20 rounded-xl">
            <Shield className="w-6 h-6 text-status-normal" />
          </div>
          <div>
            <div className="text-3xl font-bold text-status-normal">{normalCount}</div>
            <div className="text-sm text-text-secondary">正常狀態</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-command-center-card border-command-center-elevated/20 hover:bg-command-center-elevated transition-colors">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-status-warning/20 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-status-warning" />
          </div>
          <div>
            <div className="text-3xl font-bold text-status-warning">{warningCount}</div>
            <div className="text-sm text-text-secondary">預警狀態</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-command-center-card border-command-center-elevated/20 hover:bg-command-center-elevated transition-colors">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-status-critical/20 rounded-xl">
            <AlertCircle className="w-6 h-6 text-status-critical" />
          </div>
          <div>
            <div className="text-3xl font-bold text-status-critical">{criticalCount}</div>
            <div className="text-sm text-text-secondary">嚴重狀態</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-command-center-card border-command-center-elevated/20 hover:bg-command-center-elevated transition-colors">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-info-secondary/20 rounded-xl">
            <Activity className="w-6 h-6 text-info-secondary" />
          </div>
          <div>
            <div className="text-3xl font-bold text-info-secondary">{averageEDCI}</div>
            <div className="text-sm text-text-secondary">平均EDCI</div>
          </div>
        </div>
      </Card>
    </div>
  );
}