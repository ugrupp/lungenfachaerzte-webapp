import { createCustomError } from "#/lib/createCustomError";
import { executeCraftQuery } from "#/lib/executeCraftQuery";
import { HOME_QUERY, HomeQuerySchema } from "#/queries/home";
import { createServerFn } from "@tanstack/react-start";
import { ok, Result, safeTry } from "neverthrow";

class GetHomePageServerFnError extends createCustomError({
  name: "GetHomePageServerFnError",
}) {}

const parseHomePage = Result.fromThrowable(
  HomeQuerySchema.parse,
  (error) =>
    new GetHomePageServerFnError({
      message: "Failed to parse home page data.",
      cause: error,
    }),
);

const getHomePageServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: { previewToken?: string }) => data)
  .handler(async ({ data }) => {
    const result = await safeTry(async function* () {
      const response = yield* executeCraftQuery({
        query: HOME_QUERY,
        previewToken: data.previewToken,
      });

      const homePage = yield* parseHomePage(response);

      return ok(homePage);
    });

    if (result.isErr()) {
      console.error("Failed to get home page data.", result.error);
      throw result.error;
    }

    return result.value;
  });

export { getHomePageServerFn, GetHomePageServerFnError };
