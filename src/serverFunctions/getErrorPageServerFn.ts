import { createCustomError } from "#/lib/createCustomError";
import { executeCraftQuery } from "#/lib/executeCraftQuery";
import { ERRORPAGE_QUERY, ErrorpageQuerySchema } from "#/queries/errorpage";
import { createServerFn } from "@tanstack/react-start";
import { ok, Result, safeTry } from "neverthrow";

class GetErrorPageServerFnError extends createCustomError({
  name: "GetErrorPageServerFnError",
}) {}

const parseErrorPage = Result.fromThrowable(
  ErrorpageQuerySchema.parse,
  (error) =>
    new GetErrorPageServerFnError({
      message: "Failed to parse error page data.",
      cause: error,
    }),
);

const getErrorPageServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const result = await safeTry(async function* () {
      const response = yield* executeCraftQuery({ query: ERRORPAGE_QUERY });
      const errorPage = yield* parseErrorPage(response);
      return ok(errorPage);
    });

    if (result.isErr()) {
      console.error("Failed to get error page data.", result.error);
      return null;
    }

    return result.value;
  },
);

export { getErrorPageServerFn, GetErrorPageServerFnError };
