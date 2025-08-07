import { Navigate } from 'react-router-dom';
import { useLocalAuth } from '@/hooks/useLocalAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission } = useLocalAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">權限不足</h2>
          <p className="text-muted-foreground">您沒有權限存取此功能</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}