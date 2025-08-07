import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Hospital } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useLocalAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast({
          title: "登入成功",
          description: "歡迎回到 EDCI 監控系統",
        });
        navigate('/');
      } else {
        toast({
          title: "登入失敗",
          description: result.error || "請檢查您的登入資訊",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "登入錯誤",
        description: "系統發生錯誤，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoUsers = [
    { email: 'admin@hospital.com', password: 'admin', role: '系統管理員' },
    { email: 'operator@hospital.com', password: 'operator', role: '操作員' },
    { email: 'viewer@hospital.com', password: 'viewer', role: '檢視者' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Hospital className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              EDCI 監控系統
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              請登入以存取急診壅塞指標監控面板
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">電子郵件</Label>
              <Input
                id="email"
                type="email"
                placeholder="請輸入您的電子郵件"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-colors focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">密碼</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="請輸入您的密碼"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 transition-colors focus:border-primary"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? '登入中...' : '登入'}
            </Button>
          </form>

          <div className="border-t border-border/50 pt-4">
            <p className="text-sm text-muted-foreground mb-3 text-center">
              測試帳號（密碼為用戶名）：
            </p>
            <div className="space-y-2">
              {demoUsers.map((user, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-2 rounded bg-muted/50 text-sm cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => {
                    setEmail(user.email);
                    setPassword(user.password);
                  }}
                >
                  <span className="text-foreground">{user.email}</span>
                  <span className="text-muted-foreground text-xs">{user.role}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}