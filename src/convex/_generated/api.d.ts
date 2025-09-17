/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as assessments from "../assessments.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as careerPaths from "../careerPaths.js";
import type * as colleges from "../colleges.js";
import type * as courses from "../courses.js";
import type * as http from "../http.js";
import type * as importantDates from "../importantDates.js";
import type * as recommendations from "../recommendations.js";
import type * as resources from "../resources.js";
import type * as roles from "../roles.js";
import type * as seedData from "../seedData.js";
import type * as studentMarks from "../studentMarks.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  assessments: typeof assessments;
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  careerPaths: typeof careerPaths;
  colleges: typeof colleges;
  courses: typeof courses;
  http: typeof http;
  importantDates: typeof importantDates;
  recommendations: typeof recommendations;
  resources: typeof resources;
  roles: typeof roles;
  seedData: typeof seedData;
  studentMarks: typeof studentMarks;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
