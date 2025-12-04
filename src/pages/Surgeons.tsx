import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { surgeons } from '@/lib/mock-data';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function Surgeons() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredSurgeons = surgeons.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { 
      key: 'name', 
      header: 'Surgeon',
      render: (s: typeof surgeons[0]) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {s.name.split(' ').slice(1).map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{s.name}</p>
            <p className="text-sm text-muted-foreground">{s.specialty}</p>
          </div>
        </div>
      )
    },
    { key: 'procedureCount', header: 'Procedures' },
    { key: 'lastUpdated', header: 'Last Updated' },
    { 
      key: 'wasteScore', 
      header: 'Waste Score',
      render: (s: typeof surgeons[0]) => (
        <StatusBadge status={s.wasteScore} />
      )
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Surgeons</h1>
        <p className="text-muted-foreground mt-1">
          View surgeon profiles and their preference configurations
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search surgeons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <DataTable
        data={filteredSurgeons}
        columns={columns}
        onRowClick={(s) => navigate(`/surgeons/${s.id}`)}
      />
    </div>
  );
}
