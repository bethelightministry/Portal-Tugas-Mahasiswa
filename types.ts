
export enum AssignmentType {
  JURNAL = 'Jurnal',
  ARTIKEL = 'Artikel Biasa',
  BEDAH_BUKU = 'Bedah Buku'
}

export interface Submission {
  id: string;
  studentName: string;
  type: AssignmentType;
  fileName: string;
  submissionTime: string;
  attendanceTime: string;
  aiFeedback?: string;
}

export interface AttendanceRecord {
  timestamp: string;
  studentName: string;
}
