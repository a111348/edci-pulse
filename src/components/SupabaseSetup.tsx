
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ExternalLink, Server, Shield, Wifi, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SupabaseSetup() {
  const [connectionMode, setConnectionMode] = useState<'supabase' | 'direct'>('supabase');
  const [supabaseConfig, setSupabaseConfig] = useState({
    url: '',
    anonKey: '',
    functionName: 'hospital-data-proxy'
  });
  const { toast } = useToast();
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const isConfigured = supabaseUrl && supabaseAnonKey;

  useEffect(() => {
    const saved = localStorage.getItem('api_connection_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConnectionMode(parsed.mode || 'supabase');
        setSupabaseConfig(parsed.supabase || supabaseConfig);
      } catch (error) {
        console.error('Failed to load connection settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    const settings = {
      mode: connectionMode,
      supabase: supabaseConfig
    };
    localStorage.setItem('api_connection_settings', JSON.stringify(settings));
    
    toast({
      title: "設定已儲存",
      description: "API 連線設定已成功更新",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            API 連線模式設定
          </CardTitle>
          <CardDescription>
            選擇API連線方式：透過Supabase代理或直接連線
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">連線模式</Label>
            <RadioGroup 
              value={connectionMode} 
              onValueChange={(value: 'supabase' | 'direct') => setConnectionMode(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="supabase" id="supabase" />
                <Label htmlFor="supabase" className="flex items-center gap-2 cursor-pointer">
                  <Database className="w-4 h-4" />
                  透過本機 Supabase 代理 (推薦)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="direct" id="direct" />
                <Label htmlFor="direct" className="flex items-center gap-2 cursor-pointer">
                  <Wifi className="w-4 h-4" />
                  直接連線到 API
                </Label>
              </div>
            </RadioGroup>
          </div>

          {connectionMode === 'supabase' && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium">Supabase 設定</h4>
              
              <div className="space-y-2">
                <Label htmlFor="supabaseUrl">Supabase URL</Label>
                <Input
                  id="supabaseUrl"
                  placeholder="http://192.168.1.100:54321"
                  value={supabaseConfig.url}
                  onChange={(e) => setSupabaseConfig(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anonKey">Anon Key</Label>
                <Input
                  id="anonKey"
                  type="password"
                  placeholder="您的 Supabase anon key"
                  value={supabaseConfig.anonKey}
                  onChange={(e) => setSupabaseConfig(prev => ({ ...prev, anonKey: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="functionName">Edge Function 名稱</Label>
                <Input
                  id="functionName"
                  placeholder="hospital-data-proxy"
                  value={supabaseConfig.functionName}
                  onChange={(e) => setSupabaseConfig(prev => ({ ...prev, functionName: e.target.value }))}
                />
              </div>

              {isConfigured ? (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    環境變數已配置，Supabase 代理功能可用
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertDescription>
                    請在 Lovable 專案設定中配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 環境變數
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {connectionMode === 'direct' && (
            <div className="space-y-2 p-4 border rounded-lg bg-yellow-50">
              <h4 className="font-medium text-yellow-800">直接連線模式</h4>
              <p className="text-sm text-yellow-700">
                直接連線可能會遇到 CORS 跨網域問題，建議在伺服器端設定允許跨網域請求。
              </p>
              <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>API 憑證會直接暴露在前端</li>
                <li>需要 API 伺服器支援 CORS</li>
                <li>安全性較低，不建議在生產環境使用</li>
              </ul>
            </div>
          )}

          <Button onClick={handleSave} className="w-full">
            儲存連線設定
          </Button>
        </CardContent>
      </Card>

      {connectionMode === 'supabase' && (
        <Card>
          <CardHeader>
            <CardTitle>本機 Supabase 設定步驟</CardTitle>
            <CardDescription>
              在內網環境部署 Supabase 的詳細步驟
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">安裝步驟：</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>在內網伺服器安裝 Supabase CLI</li>
                <li>執行 <code className="bg-muted px-1 rounded">supabase init</code> 初始化專案</li>
                <li>執行 <code className="bg-muted px-1 rounded">supabase start</code> 啟動本機服務</li>
                <li>創建 "hospital-data-proxy" Edge Function</li>
                <li>部署 Edge Function 到本機 Supabase</li>
              </ol>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" asChild>
                <a href="https://supabase.com/docs/guides/cli" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Supabase CLI 文檔
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://supabase.com/docs/guides/functions" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Edge Functions 文檔
                </a>
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p><strong>本機部署優點：</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>API 憑證安全存儲在內網伺服器</li>
                <li>外部用戶只需連接網頁端口</li>
                <li>完全控制數據處理流程</li>
                <li>自動處理 CORS 和請求代理</li>
                <li>減少外部網路依賴</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
