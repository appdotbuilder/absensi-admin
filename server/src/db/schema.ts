import { serial, text, pgTable, timestamp, integer, boolean, pgEnum, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['employee', 'admin']);
export const attendanceStatusEnum = pgEnum('attendance_status', ['present', 'late', 'absent']);
export const leaveStatusEnum = pgEnum('leave_status', ['pending', 'approved', 'rejected']);
export const leaveTypeEnum = pgEnum('leave_type', ['annual', 'sick', 'personal', 'emergency']);

// Users table (employees and admins)
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  full_name: text('full_name').notNull(),
  role: roleEnum('role').notNull().default('employee'),
  employee_id: text('employee_id').unique(), // Nullable for admin users
  position: text('position'),
  department: text('department'),
  hire_date: date('hire_date'),
  phone: text('phone'),
  address: text('address'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Work schedules table
export const workSchedulesTable = pgTable('work_schedules', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  day_of_week: integer('day_of_week').notNull(), // 0 = Sunday, 1 = Monday, etc.
  start_time: text('start_time').notNull(), // HH:MM format
  end_time: text('end_time').notNull(), // HH:MM format
  is_working_day: boolean('is_working_day').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Attendance records table
export const attendanceTable = pgTable('attendance', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  clock_in: timestamp('clock_in'),
  clock_out: timestamp('clock_out'),
  status: attendanceStatusEnum('status').notNull().default('present'),
  notes: text('notes'),
  is_manual: boolean('is_manual').notNull().default(false), // For admin corrections
  created_by: integer('created_by').references(() => usersTable.id), // Admin who made manual entry
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Leave requests table
export const leaveRequestsTable = pgTable('leave_requests', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  leave_type: leaveTypeEnum('leave_type').notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  days_count: integer('days_count').notNull(),
  reason: text('reason').notNull(),
  status: leaveStatusEnum('status').notNull().default('pending'),
  approved_by: integer('approved_by').references(() => usersTable.id),
  approved_at: timestamp('approved_at'),
  rejection_reason: text('rejection_reason'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many, one }) => ({
  attendance: many(attendanceTable),
  workSchedules: many(workSchedulesTable),
  leaveRequests: many(leaveRequestsTable),
  approvedLeaveRequests: many(leaveRequestsTable, { relationName: 'approvedBy' }),
  manualAttendanceEntries: many(attendanceTable, { relationName: 'createdBy' }),
}));

export const workSchedulesRelations = relations(workSchedulesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [workSchedulesTable.user_id],
    references: [usersTable.id],
  }),
}));

export const attendanceRelations = relations(attendanceTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [attendanceTable.user_id],
    references: [usersTable.id],
  }),
  createdBy: one(usersTable, {
    fields: [attendanceTable.created_by],
    references: [usersTable.id],
    relationName: 'createdBy',
  }),
}));

export const leaveRequestsRelations = relations(leaveRequestsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [leaveRequestsTable.user_id],
    references: [usersTable.id],
  }),
  approvedBy: one(usersTable, {
    fields: [leaveRequestsTable.approved_by],
    references: [usersTable.id],
    relationName: 'approvedBy',
  }),
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type WorkSchedule = typeof workSchedulesTable.$inferSelect;
export type NewWorkSchedule = typeof workSchedulesTable.$inferInsert;
export type Attendance = typeof attendanceTable.$inferSelect;
export type NewAttendance = typeof attendanceTable.$inferInsert;
export type LeaveRequest = typeof leaveRequestsTable.$inferSelect;
export type NewLeaveRequest = typeof leaveRequestsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  users: usersTable,
  workSchedules: workSchedulesTable,
  attendance: attendanceTable,
  leaveRequests: leaveRequestsTable,
};