import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HospitalData } from '@/types/hospital';
import { Download, FileText, FileSpreadsheet, Calendar } from 'lucide-react';
import { useState } from 'react';

interface DataExportProps {
  hospitals: HospitalData[];
}

export function DataExport({ hospitals }: DataExportProps) {
  const [selectedHospital, setSelectedHospital] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('csv');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const handleExport = () => {
    // 模擬匯出功能
    const data = hospitals.filter(h => 
      selectedHospital === 'all' || h.hospitalCode === selectedHospital
    );
    
    console.log('匯出資料:', {
      hospitals: data,
      format: selectedFormat,
      dateRange: { from: dateFrom, to: dateTo }
    });
    
    // 這裡會實際調用匯出API
    alert(`正在匯出 ${data.length} 筆資料為 ${selectedFormat.toUpperCase()} 格式`);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">資料匯出</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="hospital-select">選擇醫院</Label>
          <Select value={selectedHospital} onValueChange={setSelectedHospital}>
            <SelectTrigger>
              <SelectValue placeholder="選擇醫院" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部醫院</SelectItem>
              {hospitals.map(hospital => (
                <SelectItem key={hospital.hospitalCode} value={hospital.hospitalCode}>
                  {hospital.hospitalName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="format-select">匯出格式</Label>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger>
              <SelectValue placeholder="選擇格式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV 檔案</SelectItem>
              <SelectItem value="xlsx">Excel 檔案</SelectItem>
              <SelectItem value="pdf">PDF 報告</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date-from">開始日期</Label>
          <div className="relative">
            <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date-to">結束日期</Label>
          <div className="relative">
            <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button onClick={handleExport} className="flex-1" variant="medical">
          <Download className="w-4 h-4 mr-2" />
          匯出資料
        </Button>
        
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          預覽
        </Button>
        
        <Button variant="outline" className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          模板
        </Button>
      </div>
      
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="text-sm text-muted-foreground">
          <p className="mb-1">匯出說明：</p>
          <ul className="text-xs space-y-1 list-disc list-inside">
            <li>CSV格式適合資料分析和處理</li>
            <li>Excel格式包含圖表和格式化</li>
            <li>PDF格式適合列印和分享</li>
            <li>資料包含EDCI指數、病人分級、醫師人力等</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}