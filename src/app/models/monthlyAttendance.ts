export interface MonthlyAttendance {
  employeeId: number;
  firstName: string;
  lastName: string;
  attendanceDate: string;
  firstCheckInTime: string | null;
  lastCheckOutTime: string | null;
  workedHours: string;
  todaysDepartmentId: number;
  todaysDepartment: string;
}
