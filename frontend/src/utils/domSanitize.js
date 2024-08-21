

export const removeDomElementsFromInput = (text) => {
    const htmlTagsRegex = /<[^>]*>/g;
  
    // Remove HTML tags from the string
    const plainText = typeof text == "string" ? text?.replace(htmlTagsRegex, '') || "" : text;
  
    return plainText;
};