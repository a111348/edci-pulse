
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Server, Shield } from 'lucide-react';

export function SupabaseSetup() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const isConfigured = supabaseUrl && supabaseAnonKey;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5" />
          API 代理設定
        </CardTitle>
        <CardDescription>
          使用本機 Supabase Edge Function 作為 API 代理，內網部署更安全
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConfigured ? (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Supabase 已正確配置，API 代理功能已啟用
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertDescription>
              需要配置 Supabase 環境變數以啟用 API 代理功能
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <h4 className="font-medium">本機 Supabase 設定步驟：</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>在內網伺服器安裝 Supabase</li>
            <li>創建 "hospital-data-proxy" Edge Function</li>
            <li>設定 Lovable 環境變數:</li>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>VITE_SUPABASE_URL: http://您的內網IP:54321</li>
              <li>VITE_SUPABASE_ANON_KEY: 您的 anon key</li>
            </ul>
          </ol>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" />
              打開 Supabase 控制台
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="https://docs.lovable.dev/features/supabase" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" />
              查看設定文檔
            </a>
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p><strong>本機部署優點：</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>外部用戶只需要連接 80 port</li>
            <li>API 憑證安全存儲在內網</li>
            <li>完全控制數據流向</li>
            <li>支援 CORS 和請求代理</li>
            <li>減少外部依賴</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
