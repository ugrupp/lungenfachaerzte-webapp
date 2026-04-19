import { createCustomError } from "#/lib/createCustomError";
import { executeCraftQuery } from "#/lib/executeCraftQuery";
import { TEAM_QUERY, TeamQuerySchema } from "#/queries/team";
import { createServerFn } from "@tanstack/react-start";
import { ok, Result, safeTry } from "neverthrow";

class GetTeamPageServerFnError extends createCustomError({
  name: "GetTeamPageServerFnError",
}) {}

const parseTeamPage = Result.fromThrowable(
  TeamQuerySchema.parse,
  (error) =>
    new GetTeamPageServerFnError({
      message: "Failed to parse team page data.",
      cause: error,
    }),
);

const getTeamPageServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: { previewToken?: string }) => data)
  .handler(async ({ data }) => {
    const result = await safeTry(async function* () {
      const response = yield* executeCraftQuery({
        query: TEAM_QUERY,
        previewToken: data.previewToken,
      });

      const teamPage = yield* parseTeamPage(response);

      return ok(teamPage);
    });

    if (result.isErr()) {
      console.error("Failed to get team page data.", result.error);
      throw result.error;
    }

    return result.value;
  });

export { getTeamPageServerFn, GetTeamPageServerFnError };
