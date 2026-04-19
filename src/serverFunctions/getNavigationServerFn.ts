import { createCustomError } from "#/lib/createCustomError";
import { executeCraftQuery } from "#/lib/executeCraftQuery";
import { NAVIGATION_QUERY, NavigationQuerySchema } from "#/queries/navigation";
import { createServerFn } from "@tanstack/react-start";
import { ok, Result, safeTry } from "neverthrow";

class GetNavigationServerFnError extends createCustomError({
  name: "GetNavigationServerFnError",
}) {}

const parseNavigation = Result.fromThrowable(
  NavigationQuerySchema.parse,
  (error) =>
    new GetNavigationServerFnError({
      message: "Failed to parse navigation data.",
      cause: error,
    }),
);

const getNavigationServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const result = await safeTry(async function* () {
      const response = yield* executeCraftQuery({ query: NAVIGATION_QUERY });
      const navigation = yield* parseNavigation(response);
      return ok(navigation);
    });

    if (result.isErr()) {
      console.error("Failed to get navigation data.", result.error);
      return [];
    }

    return result.value;
  },
);

export { getNavigationServerFn, GetNavigationServerFnError };
