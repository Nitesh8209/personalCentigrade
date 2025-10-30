
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


export const validateDuplicateDisplayOrder = (items, itemType, errors) => {
  const orderMap = {};

  for (const item of items) {
    const order = item.display_order;

    // Skip items with null or undefined display_order
    if (order === null || order === undefined) continue;

    if (!orderMap[order]) {
      orderMap[order] = [];
    }
    orderMap[order].push(item.label || item.keyName);
  }

  // Find duplicates
  const duplicates = Object.entries(orderMap).filter(([order, names]) => names.length > 1);
  if (duplicates.length > 0) {
    errors.push(`Duplicate display_order values found in field group '${itemType}': ${duplicates.map(([order, names]) => `Order ${order}: [${names.join(', ')}]`).join('; ')}`);
  }
}
