import { Alert, User } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'S1', name: 'John Doe', role: 'student', dormInfo: 'F4, 4F, 401' },
  { id: 'S2', name: 'Jane Smith', role: 'student', dormInfo: 'Sathorn 1, 2F, 205' },
  { id: 'ST1', name: 'Staff Alice', role: 'staff' },
  { id: 'ST2', name: 'Staff Bob', role: 'staff' },
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'A1',
    studentId: 'S1',
    studentName: 'John Doe',
    category: 'Medical',
    location: { building: 'A', floor: '4', room: '401' },
    note: 'Fainted in the room.',
    status: 'Received',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    aiPriority: 'High',
    aiReason: 'Medical category with urgent keyword "fainted" detected.'
  },
  {
    id: 'A2',
    studentId: 'S2',
    studentName: 'Jane Smith',
    category: 'Security',
    location: { building: 'B', floor: '2', room: '205' },
    note: 'Strange noise outside the door.',
    status: 'Sent',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    aiPriority: 'Medium',
    aiReason: 'Security category detected.'
  },
];
