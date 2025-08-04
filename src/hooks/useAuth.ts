import { useState, useEffect } from 'react';
import { User } from '@/types/settings';
import { defaultSettings, SETTINGS_STORAGE_KEY } from '@/data/settings';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  canViewHospital: (hospitalCode: string) => boolean;
}

export function useAuth(): AuthState {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // 模擬從本地存儲載入當前用戶
    // 在實際實作中，這會從認證系統或 API 獲取
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    let users = defaultSettings.users;
    
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.users) users = parsed.users;
      } catch (error) {
        console.error('Failed to load auth settings:', error);
      }
    }

    // 模擬登入第一個用戶（實際應用中會有完整的認證流程）
    const mockCurrentUser = users[0]; // 模擬 admin 用戶登入
    setCurrentUser(mockCurrentUser);
  }, []);

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    // 從角色獲取權限
    const rolePermissions = defaultSettings.roles.find(
      role => role.id === currentUser.role
    )?.permissions || [];
    
    return rolePermissions.includes(permission);
  };

  const canViewHospital = (hospitalCode: string): boolean => {
    if (!currentUser) return false;
    
    // 檢查用戶是否有權限查看特定醫院
    return currentUser.allowedHospitals.includes(hospitalCode);
  };

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    hasPermission,
    canViewHospital,
  };
}

// 用於模擬用戶切換的函數（實際應用中會有完整的登入/登出機制）
export function useUserSwitcher() {
  const switchUser = (userId: string) => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    let users = defaultSettings.users;
    
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.users) users = parsed.users;
      } catch (error) {
        console.error('Failed to load settings for user switch:', error);
      }
    }

    const user = users.find(u => u.id === userId);
    if (user) {
      // 在實際應用中，這會觸發認證狀態更新
      console.log('Switched to user:', user.username);
      // 觸發重新載入或狀態更新
      window.location.reload();
    }
  };

  return { switchUser };
}