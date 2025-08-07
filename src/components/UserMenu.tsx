import { useLocalAuth } from '@/hooks/useLocalAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserMenuProps {
  onSettingsClick?: () => void;
}

export function UserMenu({ onSettingsClick }: UserMenuProps) {
  const { currentUser, logout } = useLocalAuth();
  const { toast } = useToast();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    toast({
      title: "已登出",
      description: "您已成功登出系統",
    });
  };

  const getUserInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  const getRoleName = (roleId: string) => {
    const roleNames: Record<string, string> = {
      'admin': '系統管理員',
      'operator': '操作員',
      'viewer': '檢視者'
    };
    return roleNames[roleId] || roleId;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {getUserInitials(currentUser.username)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {getRoleName(currentUser.role)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>個人資料</span>
        </DropdownMenuItem>
        {onSettingsClick && (
          <DropdownMenuItem className="cursor-pointer" onClick={onSettingsClick}>
            <Settings className="mr-2 h-4 w-4" />
            <span>系統設定</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>登出</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}