const createCustomError = <TData = unknown>({
  name,
  defaultMessage,
}: {
  name: string;
  defaultMessage?: string;
}) =>
  class CustomError extends Error {
    data?: TData;

    constructor({
      message = defaultMessage,
      cause,
      data,
    }: {
      message?: string;
      cause?: unknown;
      data?: TData;
    } = {}) {
      super(message, { cause });

      this.data = data;
      this.name = name;
    }
  };

export { createCustomError };
