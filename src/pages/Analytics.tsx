import { useState } from 'react';
import { MetricCard } from '@/components/shared/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { metrics, surgeons, procedures } from '@/lib/mock-data';
import { Clock, Calendar, AlertTriangle, Timer, Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export default function Analytics() {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedTheatre, setSelectedTheatre] = useState('all');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Performance metrics and insights
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTheatre} onValueChange={setSelectedTheatre}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Theatres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Theatres</SelectItem>
              <SelectItem value="t1">Theatre 1</SelectItem>
              <SelectItem value="t2">Theatre 2</SelectItem>
              <SelectItem value="t3">Theatre 3</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Avg Setup Time"
          value={`${metrics.avgSetupTime} min`}
          icon={Clock}
          trend="down"
          trendValue="12% improvement"
        />
        <MetricCard
          title="Cases This Week"
          value={metrics.casesToday * 5}
          icon={Calendar}
        />
        <MetricCard
          title="Setup Errors"
          value={metrics.errorsToday * 3}
          subtitle="This week"
          icon={AlertTriangle}
          trend="down"
          trendValue="25% fewer errors"
        />
        <MetricCard
          title="Time Saved"
          value={`${metrics.timeSaved * 5} min`}
          subtitle="This week"
          icon={Timer}
          trend="up"
          trendValue="vs. previous week"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Setup Time by Surgeon */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Setup Time by Surgeon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.surgeonSetupTimes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="time" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Setup Time Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Setup Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.setupTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="time" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Procedures Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Top Procedures by Time Saved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Procedure</th>
                  <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">Specialty</th>
                  <th className="text-right text-sm font-medium text-muted-foreground px-4 py-3">Avg Setup (min)</th>
                  <th className="text-right text-sm font-medium text-muted-foreground px-4 py-3">Time Saved</th>
                  <th className="text-right text-sm font-medium text-muted-foreground px-4 py-3">Cases</th>
                </tr>
              </thead>
              <tbody>
                {procedures.slice(0, 5).map((proc, idx) => (
                  <tr key={proc.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{proc.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{proc.specialty}</td>
                    <td className="px-4 py-3 text-right">{15 + idx * 2}</td>
                    <td className="px-4 py-3 text-right text-success font-medium">
                      {10 - idx * 2} min
                    </td>
                    <td className="px-4 py-3 text-right">{20 - idx * 3}</td>
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
