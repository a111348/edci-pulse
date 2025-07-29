import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserPlus, Edit, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User, UserRole } from '@/types/settings';
import { defaultSettings, SETTINGS_STORAGE_KEY } from '@/data/settings';

export function UserManagementTab() {
  const [users, setUsers] = useState<User[]>(defaultSettings.users);
  const [roles, setRoles] = useState<UserRole[]>(defaultSettings.roles);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.roles) setRoles(parsed.roles);
      } catch (error) {
        console.error('Failed to load user settings:', error);
      }
    }
  }, []);

  const saveSettings = () => {
    try {
      const existingSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const allSettings = existingSettings ? JSON.parse(existingSettings) : defaultSettings;
      
      allSettings.users = users;
      allSettings.roles = roles;
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
      
      toast({
        title: "設定已儲存",
        description: "使用者設定已成功更新",
      });
    } catch (error) {
      toast({
        title: "儲存失敗",
        description: "無法儲存使用者設定",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username || '',
      email: userData.email || '',
      role: userData.role || 'viewer',
      isActive: true,
      lastLogin: null,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setShowAddDialog(false);
    saveSettings();
  };

  const handleUpdateUser = (userData: Partial<User>) => {
    if (!editingUser) return;
    
    setUsers(prev => prev.map(user => 
      user.id === editingUser.id 
        ? { ...user, ...userData }
        : user
    ));
    setEditingUser(null);
    saveSettings();
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    saveSettings();
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ));
    saveSettings();
  };

  const getRoleColor = (roleId: string) => {
    switch (roleId) {
      case 'admin': return 'destructive';
      case 'operator': return 'default';
      case 'viewer': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            使用者管理
          </CardTitle>
          <CardDescription>
            管理系統使用者和權限設定
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              目前共有 {users.length} 位使用者，其中 {users.filter(u => u.isActive).length} 位為啟用狀態
            </p>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  新增使用者
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增使用者</DialogTitle>
                </DialogHeader>
                <UserForm
                  onSubmit={handleAddUser}
                  onCancel={() => setShowAddDialog(false)}
                  roles={roles}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>使用者名稱</TableHead>
                <TableHead>電子郵件</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead>最後登入</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                <Badge variant={getRoleColor(user.role)}>
                  {roles.find(r => r.id === user.role)?.name || user.role}
                </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={() => toggleUserStatus(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString('zh-TW')
                      : '從未登入'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => {
                        if (!open) setEditingUser(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingUser(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>編輯使用者</DialogTitle>
                          </DialogHeader>
                          <UserForm
                            user={user}
                            onSubmit={handleUpdateUser}
                            onCancel={() => setEditingUser(null)}
                            roles={roles}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>角色權限總覽</CardTitle>
          <CardDescription>
            檢視各角色的權限設定
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {roles.map((role) => (
              <div key={role.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{role.name}</h4>
                  <Badge variant={getRoleColor(role.id)}>
                    {role.permissions.length} 項權限
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface UserFormProps {
  user?: User;
  onSubmit: (userData: Partial<User>) => void;
  onCancel: () => void;
  roles: UserRole[];
}

function UserForm({ user, onSubmit, onCancel, roles }: UserFormProps) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    role: user?.role || 'viewer',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">使用者名稱</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">電子郵件</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">角色</Label>
        <Select 
          value={formData.role} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {user ? '更新' : '新增'}
        </Button>
      </div>
    </form>
  );
}