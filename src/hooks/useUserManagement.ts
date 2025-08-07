import { useState, useEffect } from 'react';
import { User, UserRole, Permission } from '@/types/settings';
import { defaultUsers, defaultRoles, defaultPermissions, SETTINGS_STORAGE_KEY } from '@/data/settings';

export interface UserManagementState {
  users: User[];
  roles: UserRole[];
  permissions: Permission[];
}

export function useUserManagement() {
  const [state, setState] = useState<UserManagementState>({
    users: defaultUsers,
    roles: defaultRoles,
    permissions: defaultPermissions,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setState({
          users: parsed.users || defaultUsers,
          roles: parsed.roles || defaultRoles,
          permissions: parsed.permissions || defaultPermissions,
        });
      } catch (error) {
        console.error('Failed to load user management data:', error);
      }
    }
  }, []);

  const saveToStorage = (newState: UserManagementState) => {
    try {
      const existingSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const allSettings = existingSettings ? JSON.parse(existingSettings) : {};
      
      allSettings.users = newState.users;
      allSettings.roles = newState.roles;
      allSettings.permissions = newState.permissions;
      
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
      setState(newState);
    } catch (error) {
      console.error('Failed to save user management data:', error);
    }
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const newState = {
      ...state,
      users: [...state.users, newUser],
    };
    
    saveToStorage(newState);
  };

  const updateUser = (userId: string, userData: Partial<User>) => {
    const newState = {
      ...state,
      users: state.users.map(user => 
        user.id === userId ? { ...user, ...userData } : user
      ),
    };
    
    saveToStorage(newState);
  };

  const deleteUser = (userId: string) => {
    const newState = {
      ...state,
      users: state.users.filter(user => user.id !== userId),
    };
    
    saveToStorage(newState);
  };

  const addRole = (roleData: Omit<UserRole, 'id'>) => {
    const newRole: UserRole = {
      ...roleData,
      id: Date.now().toString(),
    };
    
    const newState = {
      ...state,
      roles: [...state.roles, newRole],
    };
    
    saveToStorage(newState);
  };

  const updateRole = (roleId: string, roleData: Partial<UserRole>) => {
    const newState = {
      ...state,
      roles: state.roles.map(role => 
        role.id === roleId ? { ...role, ...roleData } : role
      ),
    };
    
    saveToStorage(newState);
  };

  const deleteRole = (roleId: string) => {
    // 檢查是否有使用者使用此角色
    const usersWithRole = state.users.filter(user => user.role === roleId);
    if (usersWithRole.length > 0) {
      throw new Error(`無法刪除角色：仍有 ${usersWithRole.length} 位使用者使用此角色`);
    }
    
    const newState = {
      ...state,
      roles: state.roles.filter(role => role.id !== roleId),
    };
    
    saveToStorage(newState);
  };

  const getUserPermissions = (userId: string): string[] => {
    const user = state.users.find(u => u.id === userId);
    if (!user) return [];
    
    const role = state.roles.find(r => r.id === user.role);
    return role ? role.permissions : [];
  };

  const hasPermission = (userId: string, permission: string): boolean => {
    const userPermissions = getUserPermissions(userId);
    return userPermissions.includes(permission);
  };

  const getUsersByRole = (roleId: string): User[] => {
    return state.users.filter(user => user.role === roleId);
  };

  const getActiveUsers = (): User[] => {
    return state.users.filter(user => user.isActive);
  };

  return {
    users: state.users,
    roles: state.roles,
    permissions: state.permissions,
    addUser,
    updateUser,
    deleteUser,
    addRole,
    updateRole,
    deleteRole,
    getUserPermissions,
    hasPermission,
    getUsersByRole,
    getActiveUsers,
  };
}