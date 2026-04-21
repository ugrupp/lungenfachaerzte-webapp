import { createCustomError } from "#/lib/createCustomError";
import { executeCraftQuery } from "#/lib/executeCraftQuery";
import {
  AUSSTATTUNG_QUERY,
  AusstattungQuerySchema,
} from "#/queries/ausstattung";
import { createServerFn } from "@tanstack/react-start";
import { ok, Result, safeTry } from "neverthrow";

class GetAusstattungPageServerFnError extends createCustomError({
  name: "GetAusstattungPageServerFnError",
}) {}

const parseAusstattungPage = Result.fromThrowable(
  AusstattungQuerySchema.parse,
  (error) =>
    new GetAusstattungPageServerFnError({
      message: "Failed to parse ausstattung page data.",
      cause: error,
    }),
);

const getAusstattungPageServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: { previewToken?: string }) => data)
  .handler(async ({ data }) => {
    const result = await safeTry(async function* () {
      const response = yield* executeCraftQuery({
        query: AUSSTATTUNG_QUERY,
        previewToken: data.previewToken,
      });

      const ausstattungPage = yield* parseAusstattungPage(response);

      return ok(ausstattungPage);
    });

    if (result.isErr()) {
      console.error("Failed to get ausstattung page data.", result.error);
      throw result.error;
    }

    return result.value;
  });

export { getAusstattungPageServerFn, GetAusstattungPageServerFnError };
