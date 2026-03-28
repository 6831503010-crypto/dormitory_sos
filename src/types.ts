export type Role = 'student' | 'staff';

export type Priority = 'High' | 'Medium' | 'Low';

export type Category = 'Medical' | 'Security' | 'Fire' | 'Facility' | 'Other';

export type Status = 'Sent' | 'Received' | 'On the Way' | 'Resolved' | 'Cancelled';

export interface Location {
  building: string;
  floor: string;
  room: string;
}

export interface Alert {
  id: string;
  studentId: string;
  studentName: string;
  category: Category;
  location: Location;
  note?: string;
  status: Status;
  createdAt: string;
  resolutionNote?: string;
  assignedStaffId?: string;
  aiPriority?: Priority;
  aiReason?: string;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  dormInfo?: string;
}
