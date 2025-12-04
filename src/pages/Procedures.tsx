import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/shared/DataTable';
import { procedures } from '@/lib/mock-data';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

export default function Procedures() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredProcedures = procedures.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { 
      key: 'name', 
      header: 'Procedure Name',
      render: (p: typeof procedures[0]) => (
        <div>
          <p className="font-medium">{p.name}</p>
          <div className="flex gap-1 mt-1">
            {p.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )
    },
    { key: 'specialty', header: 'Specialty' },
    { 
      key: 'items', 
      header: 'Items',
      render: (p: typeof procedures[0]) => p.items.length
    },
    { 
      key: 'surgeonIds', 
      header: 'Surgeons',
      render: (p: typeof procedures[0]) => p.surgeonIds.length
    },
    { key: 'lastUpdated', header: 'Last Updated' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Procedures</h1>
          <p className="text-muted-foreground mt-1">
            Manage procedure templates and preference sets
          </p>
        </div>
        <Button onClick={() => navigate('/procedures/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Procedure
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search procedures..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <DataTable
        data={filteredProcedures}
        columns={columns}
        onRowClick={(p) => navigate(`/procedures/${p.id}`)}
      />
    </div>
  );
}
