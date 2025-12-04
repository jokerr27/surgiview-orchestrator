import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { rooms } from '@/lib/mock-data';
import { 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckResult {
  name: string;
  status: 'matched' | 'misplaced' | 'missing';
  note?: string;
}

export default function SetupCheck() {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<CheckResult[] | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        runCheck();
      };
      reader.readAsDataURL(file);
    }
  };

  const runCheck = () => {
    setIsProcessing(true);
    setResults(null);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock results
      setResults([
        { name: 'Operating Table', status: 'matched' },
        { name: 'Anaesthetic Machine', status: 'matched' },
        { name: 'Mayo Stand', status: 'misplaced', note: 'Positioned too far from table' },
        { name: 'Instrument Table', status: 'matched' },
        { name: 'Diathermy', status: 'missing' },
        { name: 'Camera Tower', status: 'matched' },
        { name: 'Suction', status: 'misplaced', note: 'Should be on left side' },
      ]);
      setIsProcessing(false);
    }, 2000);
  };

  const getStatusIcon = (status: CheckResult['status']) => {
    switch (status) {
      case 'matched':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'misplaced':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'missing':
        return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const summary = results ? {
    matched: results.filter(r => r.status === 'matched').length,
    misplaced: results.filter(r => r.status === 'misplaced').length,
    missing: results.filter(r => r.status === 'missing').length,
  } : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Setup Verification</h1>
        <p className="text-muted-foreground mt-1">
          Compare actual room setup against the expected layout
        </p>
      </div>

      {/* Room Selection */}
      <div className="flex gap-4">
        <Select value={selectedRoom} onValueChange={setSelectedRoom}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select room to verify" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map(room => (
              <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expected Layout */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Expected Layout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] rounded-lg border border-border bg-muted/30 flex items-center justify-center">
              {selectedRoom ? (
                <div className="relative w-full h-full p-4">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  >
                    {/* Show room objects preview */}
                    {rooms.find(r => r.id === selectedRoom)?.objects.map(obj => (
                      <div
                        key={obj.id}
                        className="absolute w-12 h-12 rounded border border-primary/30 bg-primary/10 flex items-center justify-center"
                        style={{
                          left: `${(obj.x / 600) * 100}%`,
                          top: `${(obj.y / 400) * 100}%`,
                        }}
                      >
                        <span className="text-[10px] text-primary font-medium text-center">
                          {obj.label.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Select a room to view expected layout</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Actual Setup Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center relative overflow-hidden">
              {uploadedImage ? (
                <>
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded setup" 
                    className="w-full h-full object-cover"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">Analyzing setup...</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <label className="cursor-pointer text-center p-8">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Upload setup photo</p>
                      <p className="text-sm text-muted-foreground">
                        Click or drag and drop
                      </p>
                    </div>
                  </div>
                </label>
              )}
            </div>
            {uploadedImage && !isProcessing && (
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={runCheck}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Re-run Check
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {results && (
        <Card className="animate-slide-in-right">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Verification Results</CardTitle>
              {summary && (
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {summary.matched} matched
                  </span>
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    {summary.misplaced} misplaced
                  </span>
                  <span className="flex items-center gap-1.5">
                    <XCircle className="h-4 w-4 text-destructive" />
                    {summary.missing} missing
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border',
                    result.status === 'matched' && 'border-success/30 bg-success/5',
                    result.status === 'misplaced' && 'border-warning/30 bg-warning/5',
                    result.status === 'missing' && 'border-destructive/30 bg-destructive/5'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.name}</span>
                  </div>
                  {result.note && (
                    <span className="text-sm text-muted-foreground">{result.note}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
