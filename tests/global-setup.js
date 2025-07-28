// global-setup.ts

import { extractFieldsFromTopics, extractNonTier0FieldsFromTopics, extractTier0FieldsFromTopics } from "./utils/buyerPublishProject";

async function globalSetup() {
  await extractTier0FieldsFromTopics();
  await extractNonTier0FieldsFromTopics();
  await extractFieldsFromTopics();
}

export default globalSetup;
