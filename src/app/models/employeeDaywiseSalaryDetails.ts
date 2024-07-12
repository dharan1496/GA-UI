export interface EmployeeDaywiseSalaryDetails {
  attendanceDate: string;
  firstCheckInTime: string | null;
  lastCheckOutTime: string | null;
  workedHours: string;
  confirmedAmount: number;
  salaryCategoryId: number;
  salaryCategoryName: string;
  isMorningPresent: boolean;
  isAfterNoonPresent: boolean;
}
