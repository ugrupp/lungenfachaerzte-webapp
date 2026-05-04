import { createCustomError } from "#/lib/createCustomError";
import { executeCraftQuery } from "#/lib/executeCraftQuery";
import { CONTACT_QUERY, ContactQuerySchema } from "#/queries/contact";
import { createServerFn } from "@tanstack/react-start";
import { ok, Result, safeTry } from "neverthrow";

class GetContactPageServerFnError extends createCustomError({
  name: "GetContactPageServerFnError",
}) {}

const parseContactPage = Result.fromThrowable(
  ContactQuerySchema.parse,
  (error) =>
    new GetContactPageServerFnError({
      message: "Failed to parse contact page data.",
      cause: error,
    }),
);

const getContactPageServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: { previewToken?: string }) => data)
  .handler(async ({ data }) => {
    const result = await safeTry(async function* () {
      const response = yield* executeCraftQuery({
        query: CONTACT_QUERY,
        previewToken: data.previewToken,
      });

      const contactPage = yield* parseContactPage(response);

      return ok(contactPage);
    });

    if (result.isErr()) {
      console.error("Failed to get contact page data.", result.error);
      throw result.error;
    }

    return result.value;
  });

export { getContactPageServerFn, GetContactPageServerFnError };
