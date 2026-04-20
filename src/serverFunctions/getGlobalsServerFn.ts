import { createCustomError } from "#/lib/createCustomError";
import { executeCraftQuery } from "#/lib/executeCraftQuery";
import { GLOBALS_QUERY, GlobalsQuerySchema } from "#/queries/globals";
import { createServerFn } from "@tanstack/react-start";
import { ok, Result, safeTry } from "neverthrow";

class GetGlobalsServerFnError extends createCustomError({
  name: "GetGlobalsServerFnError",
}) {}

const parseGlobals = Result.fromThrowable(
  GlobalsQuerySchema.parse,
  (error) =>
    new GetGlobalsServerFnError({
      message: "Failed to parse globals data.",
      cause: error,
    }),
);

const getGlobalsServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const result = await safeTry(async function* () {
      const response = yield* executeCraftQuery({ query: GLOBALS_QUERY });
      const globals = yield* parseGlobals(response);
      return ok(globals);
    });

    if (result.isErr()) {
      console.error("Failed to get globals data.", result.error);
      return { navigation: [], doctolibLink: null };
    }

    return result.value;
  },
);

export { getGlobalsServerFn, GetGlobalsServerFnError };
