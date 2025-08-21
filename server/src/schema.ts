import { z } from 'zod';

// Enum schemas
export const roleSchema = z.enum(['employee', 'admin']);
export const attendanceStatusSchema = z.enum(['present', 'late', 'absent']);
export const leaveStatusSchema = z.enum(['pending', 'approved', 'rejected']);
export const leaveTypeSchema = z.enum(['annual', 'sick', 'personal', 'emergency']);

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password: z.string(),
  full_name: z.string(),
  role: roleSchema,
  employee_id: z.string().nullable(),
  position: z.string().nullable(),
  department: z.string().nullable(),
  hire_date: z.string().nullable(), // Date string from DB
  phone: z.string().nullable(),
  address: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type User = z.infer<typeof userSchema>;

// Work schedule schema
export const workScheduleSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  day_of_week: z.number().int().min(0).max(6), // 0 = Sunday, 6 = Saturday
  start_time: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM format
  end_time: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM format
  is_working_day: z.boolean(),
  created_at: z.coerce.date(),
});

export type WorkSchedule = z.infer<typeof workScheduleSchema>;

// Attendance schema
export const attendanceSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  date: z.string(), // Date string from DB
  clock_in: z.coerce.date().nullable(),
  clock_out: z.coerce.date().nullable(),
  status: attendanceStatusSchema,
  notes: z.string().nullable(),
  is_manual: z.boolean(),
  created_by: z.number().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Attendance = z.infer<typeof attendanceSchema>;

// Leave request schema
export const leaveRequestSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  leave_type: leaveTypeSchema,
  start_date: z.string(), // Date string from DB
  end_date: z.string(), // Date string from DB
  days_count: z.number().int().positive(),
  reason: z.string(),
  status: leaveStatusSchema,
  approved_by: z.number().nullable(),
  approved_at: z.coerce.date().nullable(),
  rejection_reason: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type LeaveRequest = z.infer<typeof leaveRequestSchema>;

// Input schemas for creating/updating records

// User input schemas
export const createUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  role: roleSchema.optional(),
  employee_id: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  hire_date: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const updateUserInputSchema = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  full_name: z.string().min(1).optional(),
  role: roleSchema.optional(),
  employee_id: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  hire_date: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Work schedule input schemas
export const createWorkScheduleInputSchema = z.object({
  user_id: z.number(),
  day_of_week: z.number().int().min(0).max(6),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  is_working_day: z.boolean().optional(),
});

export type CreateWorkScheduleInput = z.infer<typeof createWorkScheduleInputSchema>;

export const updateWorkScheduleInputSchema = z.object({
  id: z.number(),
  user_id: z.number().optional(),
  day_of_week: z.number().int().min(0).max(6).optional(),
  start_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  end_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  is_working_day: z.boolean().optional(),
});

export type UpdateWorkScheduleInput = z.infer<typeof updateWorkScheduleInputSchema>;

// Attendance input schemas
export const clockInInputSchema = z.object({
  user_id: z.number(),
  date: z.string().optional(), // If not provided, use current date
  clock_in: z.coerce.date().optional(), // If not provided, use current time
});

export type ClockInInput = z.infer<typeof clockInInputSchema>;

export const clockOutInputSchema = z.object({
  user_id: z.number(),
  date: z.string().optional(), // If not provided, use current date
  clock_out: z.coerce.date().optional(), // If not provided, use current time
});

export type ClockOutInput = z.infer<typeof clockOutInputSchema>;

export const createAttendanceInputSchema = z.object({
  user_id: z.number(),
  date: z.string(),
  clock_in: z.coerce.date().nullable().optional(),
  clock_out: z.coerce.date().nullable().optional(),
  status: attendanceStatusSchema,
  notes: z.string().nullable().optional(),
  is_manual: z.boolean().optional(),
  created_by: z.number().optional(),
});

export type CreateAttendanceInput = z.infer<typeof createAttendanceInputSchema>;

export const updateAttendanceInputSchema = z.object({
  id: z.number(),
  date: z.string().optional(),
  clock_in: z.coerce.date().nullable().optional(),
  clock_out: z.coerce.date().nullable().optional(),
  status: attendanceStatusSchema.optional(),
  notes: z.string().nullable().optional(),
  is_manual: z.boolean().optional(),
  created_by: z.number().optional(),
});

export type UpdateAttendanceInput = z.infer<typeof updateAttendanceInputSchema>;

// Leave request input schemas
export const createLeaveRequestInputSchema = z.object({
  user_id: z.number(),
  leave_type: leaveTypeSchema,
  start_date: z.string(),
  end_date: z.string(),
  days_count: z.number().int().positive(),
  reason: z.string().min(1),
});

export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestInputSchema>;

export const updateLeaveRequestInputSchema = z.object({
  id: z.number(),
  leave_type: leaveTypeSchema.optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  days_count: z.number().int().positive().optional(),
  reason: z.string().min(1).optional(),
});

export type UpdateLeaveRequestInput = z.infer<typeof updateLeaveRequestInputSchema>;

export const approveLeaveRequestInputSchema = z.object({
  id: z.number(),
  approved_by: z.number(),
  status: z.enum(['approved', 'rejected']),
  rejection_reason: z.string().nullable().optional(),
});

export type ApproveLeaveRequestInput = z.infer<typeof approveLeaveRequestInputSchema>;

// Query input schemas
export const getUsersQuerySchema = z.object({
  role: roleSchema.optional(),
  department: z.string().optional(),
  is_active: z.boolean().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;

export const getAttendanceQuerySchema = z.object({
  user_id: z.number().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: attendanceStatusSchema.optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export type GetAttendanceQuery = z.infer<typeof getAttendanceQuerySchema>;

export const getLeaveRequestsQuerySchema = z.object({
  user_id: z.number().optional(),
  status: leaveStatusSchema.optional(),
  leave_type: leaveTypeSchema.optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export type GetLeaveRequestsQuery = z.infer<typeof getLeaveRequestsQuerySchema>;

// Authentication schemas
export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const authResponseSchema = z.object({
  user: userSchema.omit({ password: true }),
  token: z.string(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

// Report schemas
export const attendanceReportQuerySchema = z.object({
  start_date: z.string(),
  end_date: z.string(),
  user_id: z.number().optional(),
  department: z.string().optional(),
});

export type AttendanceReportQuery = z.infer<typeof attendanceReportQuerySchema>;

export const performanceReportQuerySchema = z.object({
  start_date: z.string(),
  end_date: z.string(),
  user_id: z.number().optional(),
  department: z.string().optional(),
});

export type PerformanceReportQuery = z.infer<typeof performanceReportQuerySchema>;