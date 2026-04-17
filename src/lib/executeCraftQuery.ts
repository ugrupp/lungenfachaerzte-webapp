import ky from "ky";
import { ResultAsync } from "neverthrow";
import { createCustomError } from "./createCustomError";

export type CraftVariables = Record<
  string,
  string | number | boolean | null | string[]
>;

export class ExecuteCraftQueryError extends createCustomError({
  name: "ExecuteCraftQueryError",
}) {}

/**
 * Low-level Craft GraphQL HTTP client.
 * Server-only — only call this inside server function handlers.
 * The GRAPHQL_TOKEN env var never leaves this function.
 */
export const executeCraftQuery = (input: {
  query: string;
  variables?: CraftVariables;
  previewToken?: string;
}) =>
  ResultAsync.fromPromise(
    ky
      .post("api", {
        baseUrl: process.env.CRAFT_URL?.replace(/\/$/, ""),
        json: {
          query: input.query,
          variables: input.variables ?? {},
        },
        headers: {
          ...(process.env.GRAPHQL_TOKEN && {
            Authorization: `Bearer ${process.env.GRAPHQL_TOKEN}`,
          }),
          ...(input.previewToken && {
            "X-Craft-Token": input.previewToken,
          }),
        },
      })
      .json(),
    (error) => {
      console.error("Failed to fetch Craft API", error);
      return new ExecuteCraftQueryError({
        message: "Failed to fetch Craft API.",
        cause: error,
      });
    },
  );
