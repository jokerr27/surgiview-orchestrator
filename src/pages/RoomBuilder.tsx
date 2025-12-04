import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { rooms, equipmentPalette, procedures, surgeons, RoomObject } from '@/lib/mock-data';
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Copy,
  GripVertical,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function RoomBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const room = rooms.find(r => r.id === id) || rooms[0];
  
  const [objects, setObjects] = useState<RoomObject[]>(room?.objects || []);
  const [selectedObject, setSelectedObject] = useState<RoomObject | null>(null);
  const [linkedProcedure, setLinkedProcedure] = useState('');
  const [linkedSurgeon, setLinkedSurgeon] = useState('');

  const handleDrop = useCallback((e: React.DragEvent, canvasRect: DOMRect) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('equipment-type');
    const label = e.dataTransfer.getData('equipment-label');
    
    if (type && label) {
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      
      const newObject: RoomObject = {
        id: `obj-${Date.now()}`,
        type,
        label,
        x: Math.max(0, Math.min(x - 30, canvasRect.width - 60)),
        y: Math.max(0, Math.min(y - 30, canvasRect.height - 60)),
        rotation: 0,
      };
      
      setObjects([...objects, newObject]);
      setSelectedObject(newObject);
    }
  }, [objects]);

  const handleDragStart = (e: React.DragEvent, type: string, label: string) => {
    e.dataTransfer.setData('equipment-type', type);
    e.dataTransfer.setData('equipment-label', label);
  };

  const updateObjectPosition = (objectId: string, x: number, y: number) => {
    setObjects(objects.map(obj => 
      obj.id === objectId ? { ...obj, x, y } : obj
    ));
    if (selectedObject?.id === objectId) {
      setSelectedObject({ ...selectedObject, x, y });
    }
  };

  const deleteSelectedObject = () => {
    if (selectedObject) {
      setObjects(objects.filter(obj => obj.id !== selectedObject.id));
      setSelectedObject(null);
    }
  };

  const handleSave = () => {
    toast.success('Room layout saved successfully');
  };

  const handleReset = () => {
    setObjects([]);
    setSelectedObject(null);
    toast.info('Layout reset to empty');
  };

  const groupedEquipment = equipmentPalette.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof equipmentPalette>);

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/rooms')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{room.name}</h1>
          <p className="text-muted-foreground">Visual room layout builder</p>
        </div>
        <Select value={linkedProcedure} onValueChange={setLinkedProcedure}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Load procedure layout" />
          </SelectTrigger>
          <SelectContent>
            {procedures.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Save As New
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Layout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-[240px_1fr_280px] gap-4 min-h-0">
        {/* Left Palette */}
        <Card className="overflow-y-auto">
          <CardHeader className="pb-2 sticky top-0 bg-card z-10">
            <CardTitle className="text-sm font-medium">Equipment Palette</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(groupedEquipment).map(([category, items]) => (
              <div key={category}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  {category}
                </p>
                <div className="space-y-1">
                  {items.map((item) => (
                    <div
                      key={item.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.type, item.label)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/30 cursor-grab hover:bg-muted/50 hover:border-primary/30 transition-colors"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Center Canvas */}
        <Card className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-muted/20"
            style={{
              backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              handleDrop(e, rect);
            }}
          >
            {/* Room boundary indicators */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-muted rounded text-xs text-muted-foreground">
              Door
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-muted rounded text-xs text-muted-foreground">
              Scrub Area
            </div>

            {/* Placed objects */}
            {objects.map((obj) => (
              <div
                key={obj.id}
                className={cn(
                  'absolute flex items-center justify-center w-16 h-16 rounded-lg border-2 bg-card shadow-sm cursor-move transition-all',
                  selectedObject?.id === obj.id 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-primary/50'
                )}
                style={{
                  left: obj.x,
                  top: obj.y,
                  transform: `rotate(${obj.rotation || 0}deg)`,
                }}
                onClick={() => setSelectedObject(obj)}
                draggable
                onDragEnd={(e) => {
                  const canvas = e.currentTarget.parentElement;
                  if (canvas) {
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left - 30;
                    const y = e.clientY - rect.top - 30;
                    updateObjectPosition(obj.id, Math.max(0, x), Math.max(0, y));
                  }
                }}
              >
                <span className="text-xs text-center font-medium px-1 leading-tight">
                  {obj.label.split(' ')[0]}
                </span>
              </div>
            ))}

            {objects.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="font-medium">Drag equipment here</p>
                  <p className="text-sm">Build your room layout</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Right Properties Panel */}
        <Card className="overflow-y-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {selectedObject ? 'Object Properties' : 'Room Details'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedObject ? (
              <>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={selectedObject.label} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Input value={selectedObject.type} readOnly />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>X Position</Label>
                    <Input value={Math.round(selectedObject.x)} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Y Position</Label>
                    <Input value={Math.round(selectedObject.y)} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea 
                    placeholder="Add notes about placement..."
                    rows={3}
                  />
                </div>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={deleteSelectedObject}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Object
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Linked Procedure</Label>
                  <Select value={linkedProcedure} onValueChange={setLinkedProcedure}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select procedure" />
                    </SelectTrigger>
                    <SelectContent>
                      {procedures.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assigned Surgeon</Label>
                  <Select value={linkedSurgeon} onValueChange={setLinkedSurgeon}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select surgeon" />
                    </SelectTrigger>
                    <SelectContent>
                      {surgeons.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium mb-2">Layout Summary</p>
                  <p className="text-sm text-muted-foreground">
                    {objects.length} objects placed
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
