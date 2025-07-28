// global-setup.ts

import { extractFieldsFromTopics, extractTier0FieldsFromTopics } from "./utils/buyerPublishProject";

async function globalSetup() {
  await extractTier0FieldsFromTopics();
  await extractFieldsFromTopics();
}

export default globalSetup;
