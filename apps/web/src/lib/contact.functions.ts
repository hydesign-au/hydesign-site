import { createServerFn } from "@tanstack/react-start";

import { readContactFormConfig } from "@/lib/contact.server";

const getContactFormConfig = createServerFn({ method: "GET" }).handler(() =>
  readContactFormConfig(),
);

export { getContactFormConfig };
