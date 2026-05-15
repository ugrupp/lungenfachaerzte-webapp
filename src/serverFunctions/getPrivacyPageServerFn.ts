import { createCustomError } from "#/lib/createCustomError";
import { executeCraftQuery } from "#/lib/executeCraftQuery";
import { PRIVACY_QUERY, PrivacyQuerySchema } from "#/queries/privacy";
import { createServerFn } from "@tanstack/react-start";
import { ok, Result, safeTry } from "neverthrow";

class GetPrivacyPageServerFnError extends createCustomError({
  name: "GetPrivacyPageServerFnError",
}) {}

const parsePrivacyPage = Result.fromThrowable(
  PrivacyQuerySchema.parse,
  (error) =>
    new GetPrivacyPageServerFnError({
      message: "Failed to parse privacy page data.",
      cause: error,
    }),
);

const getPrivacyPageServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: { previewToken?: string }) => data)
  .handler(async ({ data }) => {
    const result = await safeTry(async function* () {
      const response = yield* executeCraftQuery({
        query: PRIVACY_QUERY,
        previewToken: data.previewToken,
      });

      const privacyPage = yield* parsePrivacyPage(response);

      return ok(privacyPage);
    });

    if (result.isErr()) {
      console.error("Failed to get privacy page data.", result.error);
      throw result.error;
    }

    return result.value;
  });

export { getPrivacyPageServerFn, GetPrivacyPageServerFnError };
