import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, Settings, Activity, Shield } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  department: string;
  role: string;
  created_at: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [editingRole, setEditingRole] = useState('');
  const [editingDepartment, setEditingDepartment] = useState('');

  const departments = ['Operations', 'Engineering', 'Finance', 'HR', 'Legal', 'Executive'];
  const roles = ['Station Controller', 'Engineer', 'HR Officer', 'Finance Manager', 'Legal Officer', 'Executive Director', 'Admin'];

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load user profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string, newDepartment: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: newRole,
          department: newDepartment,
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "User Updated",
        description: "User role and department have been updated successfully.",
      });
      
      fetchProfiles();
      setSelectedProfile(null);
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getDepartmentBadgeColor = (department: string) => {
    const colors: Record<string, string> = {
      Operations: "bg-blue-100 text-blue-800",
      Engineering: "bg-green-100 text-green-800",
      Finance: "bg-yellow-100 text-yellow-800",
      HR: "bg-purple-100 text-purple-800",
      Legal: "bg-red-100 text-red-800",
      Executive: "bg-gray-100 text-gray-800",
    };
    return colors[department] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div>Loading admin panel...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-inter">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage users, departments, and system settings for SmartDocFlow.
          </p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity Log
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              System Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts, roles, and department assignments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">
                            {profile.display_name || 'No Name Set'}
                          </TableCell>
                          <TableCell>
                            <Badge className={getDepartmentBadgeColor(profile.department)}>
                              {profile.department}
                            </Badge>
                          </TableCell>
                          <TableCell>{profile.role}</TableCell>
                          <TableCell>
                            {new Date(profile.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProfile(profile);
                                setEditingRole(profile.role);
                                setEditingDepartment(profile.department);
                              }}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {selectedProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit User: {selectedProfile.display_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select value={editingDepartment} onValueChange={setEditingDepartment}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={editingRole} onValueChange={setEditingRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateUserRole(selectedProfile.user_id, editingRole, editingDepartment)}
                    >
                      Update User
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedProfile(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Configuration</CardTitle>
                <CardDescription>
                  Manage department settings and access permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments.map((dept) => {
                    const deptUsers = profiles.filter(p => p.department === dept);
                    return (
                      <Card key={dept}>
                        <CardHeader>
                          <CardTitle className="text-lg">{dept}</CardTitle>
                          <CardDescription>
                            {deptUsers.length} active users
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Recent Activity: Active
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                              Configure Access
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Activity</CardTitle>
                <CardDescription>
                  Monitor system usage and user activity logs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground mb-2">Recent Activity</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">User registrations today</span>
                        <Badge variant="secondary">{profiles.filter(p => 
                          new Date(p.created_at).toDateString() === new Date().toDateString()
                        ).length}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total active users</span>
                        <Badge variant="secondary">{profiles.length}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  Configure system-wide settings and integrations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email Integration</Label>
                    <Input placeholder="smtp.kmrl.org" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>SharePoint Integration</Label>
                    <Input placeholder="sharepoint.kmrl.org" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>AI Processing</Label>
                    <Select defaultValue="enabled">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Document Retention (days)</Label>
                    <Input type="number" defaultValue="365" />
                  </div>
                </div>
                <Button disabled>
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;