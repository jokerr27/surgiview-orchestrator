import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { MetricCard } from '@/components/shared/MetricCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { todaysLists, metrics } from '@/lib/mock-data';
import { 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Timer,
  Plus,
  DoorOpen,
  CheckSquare,
  BarChart3
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentRole, userName } = useAppContext();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {userName.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening in your theatres today
        </p>
      </div>

      {/* Metrics - Show for Manager role */}
      {currentRole === 'manager' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Avg Setup Time"
            value={`${metrics.avgSetupTime} min`}
            icon={Clock}
            trend="down"
            trendValue="12% from last week"
          />
          <MetricCard
            title="Cases Today"
            value={metrics.casesToday}
            icon={Calendar}
          />
          <MetricCard
            title="Setup Errors"
            value={metrics.errorsToday}
            icon={AlertTriangle}
            trend={metrics.errorsToday > 3 ? 'down' : 'up'}
            trendValue={metrics.errorsToday > 3 ? 'Above target' : 'Below target'}
          />
          <MetricCard
            title="Time Saved"
            value={`${metrics.timeSaved} min`}
            subtitle="Today"
            icon={Timer}
            trend="up"
            trendValue="vs. manual setup"
          />
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/procedures/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Preference
          </Button>
          <Button variant="outline" onClick={() => navigate('/rooms')}>
            <DoorOpen className="mr-2 h-4 w-4" />
            Visual Room Setup
          </Button>
          <Button variant="outline" onClick={() => navigate('/setup-check')}>
            <CheckSquare className="mr-2 h-4 w-4" />
            Run Setup Check
          </Button>
          {currentRole === 'manager' && (
            <Button variant="outline" onClick={() => navigate('/analytics')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Today's Lists */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Today's Lists</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Theatre</th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Surgeon</th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Procedure</th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Start</th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {todaysLists.map((item, idx) => (
                  <tr 
                    key={item.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => navigate(`/rooms/${item.theatreNumber}`)}
                  >
                    <td className="px-4 py-3 font-medium">{item.theatreNumber}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.surgeonName}</td>
                    <td className="px-4 py-3">{item.procedure}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.startTime}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
