export interface MonthlyAttendance {
  employeeId: number;
  attendanceDate: string;
  firstCheckInTime: string | null;
  lastCheckOutTime: string | null;
  workedHours: string;
}
