import { useAppContext } from '@/contexts/AppContext';
import { UserRole } from '@/lib/mock-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';

export function AppHeader() {
  const { currentRole, setCurrentRole, userName } = useAppContext();

  const roleLabels: Record<UserRole, string> = {
    nurse: 'Nurse',
    surgeon: 'Surgeon',
    manager: 'Manager',
  };

  const today = new Date().toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      {/* Date */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
        <span className="text-sm">{today}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Viewing as:</span>
          <Select value={currentRole} onValueChange={(value: UserRole) => setCurrentRole(value)}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nurse">Nurse</SelectItem>
              <SelectItem value="surgeon">Surgeon</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium">{userName}</p>
            <Badge variant="secondary" className="text-xs">
              {roleLabels[currentRole]}
            </Badge>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
