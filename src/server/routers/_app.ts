/**
 * This file contains the root router of your tRPC-backend
 */
import { createRouter } from "../createRouter";
import { customerRouter } from "./customer";
import { salesRecordRouter } from "./salesRecord";
import superjson from "superjson";
import { ZodError } from "zod";

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  /**
   * Add data transformers
   * @link https://trpc.io/docs/data-transformers
   */
  .transformer(superjson)
  /**
   * Optionally do custom error (type safe!) formatting
   * @link https://trpc.io/docs/error-formatting
   */
  .formatError(({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.code === "BAD_REQUEST" && error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  })
  /**
   * Add a health check endpoint to be called with `/api/trpc/healthz`
   */
  .query("healthz", {
    async resolve() {
      return "yay!";
    },
  })
  /**
   * Merge `userRouter` under `customer.`
   */
  .merge("customer.", customerRouter)
  .merge("salesRecord.", salesRecordRouter);

export type AppRouter = typeof appRouter;
