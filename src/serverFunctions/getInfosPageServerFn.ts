import { createCustomError } from "#/lib/createCustomError";
import { executeCraftQuery } from "#/lib/executeCraftQuery";
import { INFOS_QUERY, InfosQuerySchema } from "#/queries/infos";
import { createServerFn } from "@tanstack/react-start";
import { ok, Result, safeTry } from "neverthrow";

class GetInfosPageServerFnError extends createCustomError({
  name: "GetInfosPageServerFnError",
}) {}

const parseInfosPage = Result.fromThrowable(
  InfosQuerySchema.parse,
  (error) =>
    new GetInfosPageServerFnError({
      message: "Failed to parse infos page data.",
      cause: error,
    }),
);

const getInfosPageServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: { previewToken?: string }) => data)
  .handler(async ({ data }) => {
    const result = await safeTry(async function* () {
      const response = yield* executeCraftQuery({
        query: INFOS_QUERY,
        previewToken: data.previewToken,
      });

      const infosPage = yield* parseInfosPage(response);

      return ok(infosPage);
    });

    if (result.isErr()) {
      console.error("Failed to get infos page data.", result.error);
      throw result.error;
    }

    return result.value;
  });

export { getInfosPageServerFn, GetInfosPageServerFnError };
