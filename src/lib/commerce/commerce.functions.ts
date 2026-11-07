import { createIsomorphicFn, createServerFn } from "@tanstack/react-start";

import { readCommerceConfig } from "./commerce.server";

const getCommerceConfigFromServer = createServerFn({ method: "GET" }).handler(() =>
  readCommerceConfig(),
);

const getCommerceConfig = createIsomorphicFn()
  .server(() => readCommerceConfig())
  .client(() => getCommerceConfigFromServer());

export { getCommerceConfig };
