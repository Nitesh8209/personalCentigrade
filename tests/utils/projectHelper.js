import { expect } from "@playwright/test";

export const validateProjectFieldValues = (sentItems, responseBody) => {
   // Create a map of received items for easier lookup
    const receivedItemsMap = new Map(
      responseBody.map(item => [item.keyName, item.value])
    );

    // Track missing and mismatched fields
    const missingFields = [];
    const mismatchedFields = [];

    // Compare sent and received fields
    sentItems.forEach(sentItem => {
      const receivedItem = receivedItemsMap.get(sentItem.keyName);

      if (receivedItem === undefined) {
        missingFields.push(sentItem.keyName);
      } else if (receivedItem !== sentItem.value) {
        mismatchedFields.push({
          KeyName: sentItem.keyName,
          sent: sentItem.value,
          received: receivedItem
        });
      }
    });

    // Throw an error if any fields are missing or mismatched
    if (missingFields.length > 0 || mismatchedFields.length > 0) {
      throw new Error(`Failed to match all fields:\nMissing fields: ${missingFields.join(', ')}\nMismatched fields: ${JSON.stringify(mismatchedFields, null, 2)}`);
    }

}
