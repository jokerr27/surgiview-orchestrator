import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { procedures, rooms, ProcedureItem, surgeons } from '@/lib/mock-data';
import { ArrowLeft, Plus, Trash2, AlertCircle, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '@/contexts/AppContext';

export default function ProcedureEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const { currentRole, surgeonPreferences, setSurgeonPreferences } = useAppContext();
  const existingProcedure = !isNew ? procedures.find((p) => p.id === id) : null;

  // In this mock, treat Dr James Wilson as the logged-in surgeon
  const currentSurgeon =
    surgeons.find((s) => s.name === 'Dr. James Wilson') ?? surgeons[0];

  const surgeonPreference = useMemo(
    () =>
      currentRole === 'surgeon' && existingProcedure
        ? surgeonPreferences.find(
            (pref) =>
              pref.surgeonId === currentSurgeon.id &&
              pref.procedureId === existingProcedure.id,
          )
        : undefined,
    [currentRole, existingProcedure, currentSurgeon.id],
  );

  const [name, setName] = useState(existingProcedure?.name || '');
  const [specialty, setSpecialty] = useState(existingProcedure?.specialty || '');
  const [positioning, setPositioning] = useState(existingProcedure?.positioning || '');
  const [notes, setNotes] = useState(existingProcedure?.notes || '');
  const [linkedRoom, setLinkedRoom] = useState(existingProcedure?.roomLayoutId || '');
  const [items, setItems] = useState<ProcedureItem[]>(
    surgeonPreference?.items || existingProcedure?.items || [],
  );

  const addItem = () => {
    const newItem: ProcedureItem = {
      id: `item-${Date.now()}`,
      name: '',
      category: 'Instrument',
      quantity: 1,
      critical: false,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (index: number, updates: Partial<ProcedureItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // When a surgeon edits a procedure, persist their personal list
    if (currentRole === 'surgeon' && existingProcedure) {
      const updated = [...surgeonPreferences];
      const idx = updated.findIndex(
        (pref) =>
          pref.surgeonId === currentSurgeon.id &&
          pref.procedureId === existingProcedure.id,
      );
      const newPref = {
        surgeonId: currentSurgeon.id,
        procedureId: existingProcedure.id,
        items,
      };
      if (idx >= 0) {
        updated[idx] = newPref;
      } else {
        updated.push(newPref);
      }
      setSurgeonPreferences(updated);
    }

    toast.success('Procedure saved successfully');
    navigate('/procedures');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/procedures')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {currentRole === 'surgeon'
              ? 'Your preference for this procedure'
              : isNew
              ? 'New Procedure'
              : 'Edit Procedure'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentRole === 'surgeon'
              ? 'Adjust the instruments and items you prefer for this surgery'
              : 'Configure procedure details and preference items'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/procedures')}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  {currentRole === 'surgeon'
                    ? 'Your items & instruments'
                    : 'Items & Instruments'}
                </CardTitle>
                <Button size="sm" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No items added yet</p>
                  <p className="text-sm">Click "Add Item" to start building your preference list</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div 
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex-1 grid grid-cols-4 gap-3">
                        <Input
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) => updateItem(index, { name: e.target.value })}
                          className="col-span-2"
                        />
                        <Select
                          value={item.category}
                          onValueChange={(value: ProcedureItem['category']) => updateItem(index, { category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Instrument">Instrument</SelectItem>
                            <SelectItem value="Suture">Suture</SelectItem>
                            <SelectItem value="Device">Device</SelectItem>
                            <SelectItem value="Pack">Pack</SelectItem>
                            <SelectItem value="Misc">Misc</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateItem(index, { quantity: parseInt(e.target.value) || 1 })}
                          className="w-20"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`critical-${index}`}
                            checked={item.critical}
                            onCheckedChange={(checked) => updateItem(index, { critical: !!checked })}
                          />
                          <Label htmlFor={`critical-${index}`} className="text-sm text-muted-foreground">
                            Critical
                          </Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Procedure Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Procedure Name</Label>
                <Input
                  placeholder="e.g. Laparoscopic Cholecystectomy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Specialty</Label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Surgery">General Surgery</SelectItem>
                    <SelectItem value="Orthopaedics">Orthopaedics</SelectItem>
                    <SelectItem value="ENT">ENT</SelectItem>
                    <SelectItem value="Neurosurgery">Neurosurgery</SelectItem>
                    <SelectItem value="Cardiothoracic">Cardiothoracic</SelectItem>
                    <SelectItem value="Urology">Urology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Patient Positioning</Label>
                <Input
                  placeholder="e.g. Supine, reverse Trendelenburg"
                  value={positioning}
                  onChange={(e) => setPositioning(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Notes & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Special Requests</Label>
                <Textarea
                  placeholder="Any special requirements or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Link Room Layout</Label>
                <Select value={linkedRoom} onValueChange={setLinkedRoom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room layout" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map(room => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
