import { createCustomError } from "#/lib/createCustomError";
import { executeCraftQuery } from "#/lib/executeCraftQuery";
import { IMPRINT_QUERY, ImprintQuerySchema } from "#/queries/imprint";
import { createServerFn } from "@tanstack/react-start";
import { ok, Result, safeTry } from "neverthrow";

class GetImprintPageServerFnError extends createCustomError({
  name: "GetImprintPageServerFnError",
}) {}

const parseImprintPage = Result.fromThrowable(
  ImprintQuerySchema.parse,
  (error) =>
    new GetImprintPageServerFnError({
      message: "Failed to parse imprint page data.",
      cause: error,
    }),
);

const getImprintPageServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: { previewToken?: string }) => data)
  .handler(async ({ data }) => {
    const result = await safeTry(async function* () {
      const response = yield* executeCraftQuery({
        query: IMPRINT_QUERY,
        previewToken: data.previewToken,
      });

      const imprintPage = yield* parseImprintPage(response);

      return ok(imprintPage);
    });

    if (result.isErr()) {
      console.error("Failed to get imprint page data.", result.error);
      throw result.error;
    }

    return result.value;
  });

export { getImprintPageServerFn, GetImprintPageServerFnError };
