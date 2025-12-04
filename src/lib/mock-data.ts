export type UserRole = 'nurse' | 'surgeon' | 'manager';

export interface Surgeon {
  id: string;
  name: string;
  specialty: string;
  wasteScore: 'low' | 'medium' | 'high';
  avatar?: string;
  procedureCount: number;
  lastUpdated: string;
}

export interface ProcedureItem {
  id: string;
  name: string;
  category: 'Instrument' | 'Suture' | 'Device' | 'Pack' | 'Misc';
  quantity: number;
  critical: boolean;
  oftenUnused?: boolean;
}

export interface ProcedureTemplate {
  id: string;
  name: string;
  specialty: string;
  roomLayoutId?: string;
  items: ProcedureItem[];
  positioning?: string;
  notes?: string;
  surgeonIds: string[];
  lastUpdated: string;
  tags: string[];
}

// Surgeon-specific preferences for a given procedure.
// In a real app this would live in a backend; here it's mock data so nurses
// can see how equipment changes when a particular surgeon is assigned.
export interface SurgeonPreference {
  surgeonId: string;
  procedureId: string;
  items: ProcedureItem[];
}

export interface RoomObject {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  rotation?: number;
  notes?: string;
}

export interface RoomLayout {
  id: string;
  name: string;
  theatreNumber: string;
  procedureTemplateId?: string;
  surgeonId?: string;
  objects: RoomObject[];
  status: 'available' | 'in-use' | 'cleaning';
}

export interface TodaysList {
  id: string;
  theatreNumber: string;
  surgeonName: string;
  procedure: string;
  startTime: string;
  status: 'not-started' | 'setting-up' | 'ready' | 'in-progress';
}

// Mock Data
export const surgeons: Surgeon[] = [
  { id: '1', name: 'Dr. Sarah Chen', specialty: 'General Surgery', wasteScore: 'low', procedureCount: 12, lastUpdated: '2024-12-01' },
  { id: '2', name: 'Dr. James Wilson', specialty: 'Orthopaedics', wasteScore: 'medium', procedureCount: 8, lastUpdated: '2024-12-03' },
  { id: '3', name: 'Dr. Emily Brooks', specialty: 'ENT', wasteScore: 'low', procedureCount: 15, lastUpdated: '2024-11-28' },
  { id: '4', name: 'Dr. Michael Torres', specialty: 'Neurosurgery', wasteScore: 'high', procedureCount: 6, lastUpdated: '2024-12-02' },
  { id: '5', name: 'Dr. Lisa Patel', specialty: 'Cardiothoracic', wasteScore: 'low', procedureCount: 10, lastUpdated: '2024-12-04' },
];

export const procedures: ProcedureTemplate[] = [
  {
    id: '1',
    name: 'Laparoscopic Cholecystectomy',
    specialty: 'General Surgery',
    items: [
      { id: 'i1', name: 'Laparoscope 10mm', category: 'Instrument', quantity: 1, critical: true },
      { id: 'i2', name: 'Trocar Set', category: 'Instrument', quantity: 1, critical: true },
      { id: 'i3', name: 'Grasper Maryland', category: 'Instrument', quantity: 2, critical: false },
      { id: 'i4', name: 'Harmonic Scalpel', category: 'Device', quantity: 1, critical: true },
      { id: 'i5', name: 'Clip Applier', category: 'Device', quantity: 1, critical: true },
      { id: 'i6', name: 'Specimen Bag', category: 'Misc', quantity: 2, critical: false, oftenUnused: true },
    ],
    positioning: 'Supine, reverse Trendelenburg',
    notes: 'Ensure camera tower on patient right side',
    surgeonIds: ['1', '3'],
    lastUpdated: '2024-12-01',
    tags: ['Laparoscopic', 'Day case'],
  },
  {
    id: '2',
    name: 'Total Hip Replacement',
    specialty: 'Orthopaedics',
    items: [
      { id: 'i7', name: 'Hip Prosthesis Set', category: 'Device', quantity: 1, critical: true },
      { id: 'i8', name: 'Bone Cement', category: 'Misc', quantity: 2, critical: true },
      { id: 'i9', name: 'Reamer Set', category: 'Instrument', quantity: 1, critical: true },
      { id: 'i10', name: 'Retractor Set', category: 'Instrument', quantity: 1, critical: false },
    ],
    positioning: 'Lateral',
    notes: 'C-arm required, template sizing on screen',
    surgeonIds: ['2'],
    lastUpdated: '2024-12-03',
    tags: ['Ortho', 'Major'],
  },
  {
    id: '3',
    name: 'Tonsillectomy',
    specialty: 'ENT',
    items: [
      { id: 'i11', name: 'McIvor Mouth Gag', category: 'Instrument', quantity: 1, critical: true },
      { id: 'i12', name: 'Coblation Wand', category: 'Device', quantity: 1, critical: true },
      { id: 'i13', name: 'Suction Yankauer', category: 'Instrument', quantity: 2, critical: false },
    ],
    positioning: 'Supine, shoulder roll',
    surgeonIds: ['3'],
    lastUpdated: '2024-11-28',
    tags: ['ENT', 'Day case'],
  },
];

// Example surgeon-specific equipment preferences for procedures.
// These override or extend the base procedure template when that surgeon is assigned.
export const surgeonPreferences: SurgeonPreference[] = [
  {
    surgeonId: '1', // Dr. Sarah Chen
    procedureId: '1', // Laparoscopic Cholecystectomy
    items: [
      { id: 'i1', name: 'Laparoscope 10mm', category: 'Instrument', quantity: 1, critical: true },
      { id: 'i2', name: 'Trocar Set', category: 'Instrument', quantity: 1, critical: true },
      // Prefers an extra grasper
      { id: 'i3', name: 'Grasper Maryland', category: 'Instrument', quantity: 3, critical: false },
      // Drops the specimen bag that is often unused
    ],
  },
  {
    surgeonId: '2', // Dr. James Wilson
    procedureId: '2', // Total Hip Replacement
    items: [
      { id: 'i7', name: 'Hip Prosthesis Set', category: 'Device', quantity: 1, critical: true },
      { id: 'i8', name: 'Bone Cement', category: 'Misc', quantity: 3, critical: true },
      { id: 'i9', name: 'Reamer Set', category: 'Instrument', quantity: 1, critical: true },
      { id: 'i10', name: 'Retractor Set', category: 'Instrument', quantity: 2, critical: false },
    ],
  },
];

export const rooms: RoomLayout[] = [
  {
    id: '1',
    name: 'Theatre 1',
    theatreNumber: 'T1',
    // Link to Dr James Wilson's hip replacement so nurses see his specific kit
    procedureTemplateId: '2',
    surgeonId: '2',
    status: 'in-use',
    objects: [
      { id: 'o1', type: 'table', label: 'Operating Table', x: 300, y: 200, rotation: 0 },
      { id: 'o2', type: 'anaesthetic', label: 'Anaesthetic Machine', x: 100, y: 150, rotation: 0 },
      { id: 'o3', type: 'mayo', label: 'Mayo Stand', x: 400, y: 150, rotation: 0 },
      { id: 'o4', type: 'instrument', label: 'Instrument Table', x: 450, y: 300, rotation: 0 },
    ],
  },
  {
    id: '2',
    name: 'Theatre 2',
    theatreNumber: 'T2',
    procedureTemplateId: '1',
    surgeonId: '1',
    status: 'available',
    objects: [
      { id: 'o5', type: 'table', label: 'Operating Table', x: 300, y: 200, rotation: 0 },
      { id: 'o6', type: 'anaesthetic', label: 'Anaesthetic Machine', x: 100, y: 150, rotation: 0 },
    ],
  },
  {
    id: '3',
    name: 'Theatre 3',
    theatreNumber: 'T3',
    status: 'cleaning',
    objects: [],
  },
  {
    id: '4',
    name: 'Theatre 4',
    theatreNumber: 'T4',
    status: 'available',
    objects: [],
  },
];

export const todaysLists: TodaysList[] = [
  { id: '1', theatreNumber: 'T1', surgeonName: 'Dr. Sarah Chen', procedure: 'Laparoscopic Cholecystectomy', startTime: '08:00', status: 'in-progress' },
  { id: '2', theatreNumber: 'T1', surgeonName: 'Dr. Sarah Chen', procedure: 'Appendectomy', startTime: '10:30', status: 'setting-up' },
  { id: '3', theatreNumber: 'T2', surgeonName: 'Dr. James Wilson', procedure: 'Total Hip Replacement', startTime: '09:00', status: 'ready' },
  { id: '4', theatreNumber: 'T3', surgeonName: 'Dr. Emily Brooks', procedure: 'Tonsillectomy', startTime: '11:00', status: 'not-started' },
  { id: '5', theatreNumber: 'T4', surgeonName: 'Dr. Michael Torres', procedure: 'Craniotomy', startTime: '13:00', status: 'not-started' },
];

export const equipmentPalette = [
  { type: 'table', label: 'Operating Table', category: 'Core' },
  { type: 'anaesthetic', label: 'Anaesthetic Machine', category: 'Core' },
  { type: 'mayo', label: 'Mayo Stand', category: 'Core' },
  { type: 'instrument', label: 'Instrument Table', category: 'Core' },
  { type: 'diathermy', label: 'Diathermy', category: 'Devices' },
  { type: 'camera', label: 'Camera Tower', category: 'Devices' },
  { type: 'microscope', label: 'Microscope', category: 'Devices' },
  { type: 'carm', label: 'C-Arm', category: 'Devices' },
  { type: 'robot', label: 'Robot', category: 'Devices' },
  { type: 'ivpole', label: 'IV Pole', category: 'Environment' },
  { type: 'monitor', label: 'Monitor', category: 'Environment' },
  { type: 'pedal', label: 'Foot Pedal', category: 'Environment' },
  { type: 'suction', label: 'Suction', category: 'Environment' },
  { type: 'light', label: 'Surgical Light', category: 'Environment' },
];

export const metrics = {
  avgSetupTime: 18,
  casesToday: 12,
  errorsToday: 2,
  timeSaved: 45,
  setupTrend: [
    { day: 'Mon', time: 22 },
    { day: 'Tue', time: 19 },
    { day: 'Wed', time: 18 },
    { day: 'Thu', time: 17 },
    { day: 'Fri', time: 18 },
  ],
  surgeonSetupTimes: [
    { name: 'Dr. Chen', time: 15 },
    { name: 'Dr. Wilson', time: 22 },
    { name: 'Dr. Brooks', time: 14 },
    { name: 'Dr. Torres', time: 25 },
    { name: 'Dr. Patel', time: 16 },
  ],
};
