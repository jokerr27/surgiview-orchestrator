import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { rooms } from '@/lib/mock-data';
import { DoorOpen, Layout } from 'lucide-react';

export default function Rooms() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Operating Rooms</h1>
        <p className="text-muted-foreground mt-1">
          View and configure theatre room layouts
        </p>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <Card 
            key={room.id}
            className="cursor-pointer hover:shadow-card-hover transition-all duration-200 hover:border-primary/30"
            onClick={() => navigate(`/rooms/${room.id}`)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <DoorOpen className="h-6 w-6 text-primary" />
                </div>
                <StatusBadge status={room.status} />
              </div>
              <h3 className="font-semibold text-lg">{room.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {room.objects.length} objects configured
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/rooms/${room.id}`);
                }}
              >
                <Layout className="mr-2 h-4 w-4" />
                Open Layout
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
