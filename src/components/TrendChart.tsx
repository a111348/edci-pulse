import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { generateTrendData } from '@/data/mockData';
import { TrendingUp } from 'lucide-react';

interface TrendChartProps {
  hospitalCode: string;
  hospitalName: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export function TrendChart({ hospitalCode, hospitalName, dateRange }: TrendChartProps) {
  const trendData = generateTrendData(hospitalCode);
  
  // 轉換資料格式供圖表使用
  const chartData = trendData.map(item => ({
    time: new Date(item.time).toLocaleTimeString('zh-TW', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    edci: item.edci,
    status: item.status
  }));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">{hospitalName} - EDCI趨勢</h3>
        </div>
        {dateRange && (
          <div className="text-sm text-muted-foreground">
            {dateRange.from.toLocaleDateString('zh-TW')} - {dateRange.to.toLocaleDateString('zh-TW')}
          </div>
        )}
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={[0, 'dataMax + 5']}
            />
            <Tooltip 
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value: any) => [typeof value === 'number' ? value.toFixed(2) : value, 'EDCI指數']}
            />
            
            {/* 參考線：正常/預警/嚴重分界 */}
            <ReferenceLine y={15} stroke="#10b981" strokeDasharray="5 5" opacity={0.7} />
            <ReferenceLine y={25} stroke="#f59e0b" strokeDasharray="5 5" opacity={0.7} />
            
            <Line 
              type="monotone" 
              dataKey="edci" 
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-1 bg-status-normal"></div>
          <span>正常 (&lt;15)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-1 bg-status-warning"></div>
          <span>預警 (15-25)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-1 bg-status-critical"></div>
          <span>嚴重 (≥25)</span>
        </div>
      </div>
    </Card>
  );
}