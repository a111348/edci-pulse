import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@/types/settings';
import { defaultUsers } from '@/data/settings';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  canViewHospital: (hospitalCode: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useLocalAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useLocalAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthProvider() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to load user from localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // 從本地設定中查找用戶
    const user = defaultUsers.find(u => u.email === email && u.isActive);
    
    if (!user) {
      return { success: false, error: '用戶不存在或已被停用' };
    }

    // 簡單的密碼驗證（實際應用中應該使用加密）
    const validPassword = user.username; // 暫時使用用戶名作為密碼
    if (password !== validPassword) {
      return { success: false, error: '密碼錯誤' };
    }

    // 更新最後登入時間
    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString()
    };

    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    // 從角色設定中取得權限
    const roles = JSON.parse(localStorage.getItem('settings') || '{}').roles || [];
    const userRole = roles.find((r: any) => r.id === currentUser.role);
    
    return userRole ? userRole.permissions.includes(permission) : false;
  };

  const canViewHospital = (hospitalCode: string): boolean => {
    if (!currentUser) return false;
    
    // 管理員可以看到所有醫院
    if (currentUser.role === 'admin') return true;
    
    // 檢查用戶是否有權限查看該醫院
    return currentUser.allowedHospitals.includes(hospitalCode);
  };

  return {
    currentUser,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    canViewHospital,
  };
}

export { AuthContext };