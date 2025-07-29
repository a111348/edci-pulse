
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EDCISettingsTab } from './settings/EDCISettingsTab';
import { NotificationSettingsTab } from './settings/NotificationSettingsTab';
import { APISettingsTab } from './settings/APISettingsTab';
import { UserManagementTab } from './settings/UserManagementTab';
import { SupabaseSetup } from './SupabaseSetup';

export function SettingsDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-1" />
          設定
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>系統設定</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="proxy" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="proxy">API 代理</TabsTrigger>
            <TabsTrigger value="edci">EDCI 計算</TabsTrigger>
            <TabsTrigger value="notifications">通知設定</TabsTrigger>
            <TabsTrigger value="api">API 設定</TabsTrigger>
            <TabsTrigger value="users">使用者管理</TabsTrigger>
          </TabsList>
          
          <TabsContent value="proxy" className="space-y-4">
            <SupabaseSetup />
          </TabsContent>
          
          <TabsContent value="edci" className="space-y-4">
            <EDCISettingsTab />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettingsTab />
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <APISettingsTab />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <UserManagementTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
