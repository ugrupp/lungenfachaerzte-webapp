import { createCustomError } from "#/lib/createCustomError";
import { executeCraftQuery } from "#/lib/executeCraftQuery";
import {
  SCHWERPUNKTE_QUERY,
  SchwerpunkteQuerySchema,
} from "#/queries/schwerpunkte";
import { createServerFn } from "@tanstack/react-start";
import { ok, Result, safeTry } from "neverthrow";

class GetSchwerpunktePageServerFnError extends createCustomError({
  name: "GetSchwerpunktePageServerFnError",
}) {}

const parseSchwerpunktePage = Result.fromThrowable(
  SchwerpunkteQuerySchema.parse,
  (error) =>
    new GetSchwerpunktePageServerFnError({
      message: "Failed to parse schwerpunkte page data.",
      cause: error,
    }),
);

const getSchwerpunktePageServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: { previewToken?: string }) => data)
  .handler(async ({ data }) => {
    const result = await safeTry(async function* () {
      const response = yield* executeCraftQuery({
        query: SCHWERPUNKTE_QUERY,
        previewToken: data.previewToken,
      });

      const schwerpunktePage = yield* parseSchwerpunktePage(response);

      return ok(schwerpunktePage);
    });

    if (result.isErr()) {
      console.error("Failed to get schwerpunkte page data.", result.error);
      throw result.error;
    }

    return result.value;
  });

export { getSchwerpunktePageServerFn, GetSchwerpunktePageServerFnError };
