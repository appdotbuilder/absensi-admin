import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createUserInputSchema,
  updateUserInputSchema,
  getUsersQuerySchema,
  loginInputSchema,
  clockInInputSchema,
  clockOutInputSchema,
  createAttendanceInputSchema,
  updateAttendanceInputSchema,
  getAttendanceQuerySchema,
  createWorkScheduleInputSchema,
  updateWorkScheduleInputSchema,
  createLeaveRequestInputSchema,
  updateLeaveRequestInputSchema,
  approveLeaveRequestInputSchema,
  getLeaveRequestsQuerySchema,
  attendanceReportQuerySchema,
  performanceReportQuerySchema,
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { getUsers } from './handlers/get_users';
import { updateUser } from './handlers/update_user';
import { deleteUser } from './handlers/delete_user';
import { login } from './handlers/login';
import { clockIn } from './handlers/clock_in';
import { clockOut } from './handlers/clock_out';
import { getAttendance } from './handlers/get_attendance';
import { createAttendance } from './handlers/create_attendance';
import { updateAttendance } from './handlers/update_attendance';
import { createWorkSchedule } from './handlers/create_work_schedule';
import { getWorkSchedules } from './handlers/get_work_schedules';
import { updateWorkSchedule } from './handlers/update_work_schedule';
import { deleteWorkSchedule } from './handlers/delete_work_schedule';
import { createLeaveRequest } from './handlers/create_leave_request';
import { getLeaveRequests } from './handlers/get_leave_requests';
import { updateLeaveRequest } from './handlers/update_leave_request';
import { approveLeaveRequest } from './handlers/approve_leave_request';
import { deleteLeaveRequest } from './handlers/delete_leave_request';
import { getAttendanceReport } from './handlers/get_attendance_report';
import { getPerformanceReport } from './handlers/get_performance_report';
import { getDashboardStats } from './handlers/get_dashboard_stats';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => login(input)),

  // User Management (Admin)
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),

  getUsers: publicProcedure
    .input(getUsersQuerySchema)
    .query(({ input }) => getUsers(input)),

  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),

  deleteUser: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteUser(input.id)),

  // Attendance Management
  clockIn: publicProcedure
    .input(clockInInputSchema)
    .mutation(({ input }) => clockIn(input)),

  clockOut: publicProcedure
    .input(clockOutInputSchema)
    .mutation(({ input }) => clockOut(input)),

  getAttendance: publicProcedure
    .input(getAttendanceQuerySchema)
    .query(({ input }) => getAttendance(input)),

  createAttendance: publicProcedure
    .input(createAttendanceInputSchema)
    .mutation(({ input }) => createAttendance(input)),

  updateAttendance: publicProcedure
    .input(updateAttendanceInputSchema)
    .mutation(({ input }) => updateAttendance(input)),

  // Work Schedule Management (Admin)
  createWorkSchedule: publicProcedure
    .input(createWorkScheduleInputSchema)
    .mutation(({ input }) => createWorkSchedule(input)),

  getWorkSchedules: publicProcedure
    .input(z.object({ userId: z.number().optional() }))
    .query(({ input }) => getWorkSchedules(input.userId)),

  updateWorkSchedule: publicProcedure
    .input(updateWorkScheduleInputSchema)
    .mutation(({ input }) => updateWorkSchedule(input)),

  deleteWorkSchedule: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteWorkSchedule(input.id)),

  // Leave Request Management
  createLeaveRequest: publicProcedure
    .input(createLeaveRequestInputSchema)
    .mutation(({ input }) => createLeaveRequest(input)),

  getLeaveRequests: publicProcedure
    .input(getLeaveRequestsQuerySchema)
    .query(({ input }) => getLeaveRequests(input)),

  updateLeaveRequest: publicProcedure
    .input(updateLeaveRequestInputSchema)
    .mutation(({ input }) => updateLeaveRequest(input)),

  approveLeaveRequest: publicProcedure
    .input(approveLeaveRequestInputSchema)
    .mutation(({ input }) => approveLeaveRequest(input)),

  deleteLeaveRequest: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteLeaveRequest(input.id)),

  // Reports and Analytics (Admin)
  getAttendanceReport: publicProcedure
    .input(attendanceReportQuerySchema)
    .query(({ input }) => getAttendanceReport(input)),

  getPerformanceReport: publicProcedure
    .input(performanceReportQuerySchema)
    .query(({ input }) => getPerformanceReport(input)),

  getDashboardStats: publicProcedure
    .query(() => getDashboardStats()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();