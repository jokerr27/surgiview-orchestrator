import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Upload, Users, Settings2, Save } from 'lucide-react';
import { toast } from 'sonner';

const mockUsers = [
  { id: '1', name: 'Alex Morgan', email: 'alex.morgan@hospital.com', role: 'manager' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.chen@hospital.com', role: 'surgeon' },
  { id: '3', name: 'James Wilson', email: 'james.wilson@hospital.com', role: 'surgeon' },
  { id: '4', name: 'Emily Brooks', email: 'emily.brooks@hospital.com', role: 'nurse' },
  { id: '5', name: 'Michael Torres', email: 'michael.torres@hospital.com', role: 'nurse' },
];

export default function Settings() {
  const [orgName, setOrgName] = useState('Metro General Hospital');
  const [defaultRoomSize, setDefaultRoomSize] = useState('medium');
  const [metricUnits, setMetricUnits] = useState('metric');

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your organisation and application preferences
        </p>
      </div>

      <Tabs defaultValue="organisation" className="space-y-6">
        <TabsList>
          <TabsTrigger value="organisation" className="gap-2">
            <Building2 className="h-4 w-4" />
            Organisation
          </TabsTrigger>
          <TabsTrigger value="defaults" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Defaults
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>

        {/* Organisation Tab */}
        <TabsContent value="organisation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organisation Details</CardTitle>
              <CardDescription>
                Basic information about your hospital or facility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Organisation Name</Label>
                <Input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Enter organisation name"
                />
              </div>
              <div className="space-y-2">
                <Label>Hospital Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg border border-dashed border-border bg-muted/30 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                </div>
              </div>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Defaults Tab */}
        <TabsContent value="defaults" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Standard Defaults</CardTitle>
              <CardDescription>
                Default settings for new rooms and procedures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Room Size</Label>
                <Select value={defaultRoomSize} onValueChange={setDefaultRoomSize}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (4m x 4m)</SelectItem>
                    <SelectItem value="medium">Medium (6m x 6m)</SelectItem>
                    <SelectItem value="large">Large (8m x 8m)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Metric Units</Label>
                <Select value={metricUnits} onValueChange={setMetricUnits}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (meters, kg)</SelectItem>
                    <SelectItem value="imperial">Imperial (feet, lbs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Auto-save layouts</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically save room layouts every 5 minutes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Show setup tips</p>
                  <p className="text-sm text-muted-foreground">
                    Display helpful tips in the room builder
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">User Management</CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </div>
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Name</th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Email</th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Role</th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-medium">{user.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="capitalize">
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className="bg-success/15 text-success hover:bg-success/20">
                            Active
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
