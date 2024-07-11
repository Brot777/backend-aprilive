export const convertTextNormalize = (text: string): string => {
  // Replace accented characters
  let textNormalize = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Convert to lowercase
  textNormalize = textNormalize.toLowerCase();
  // Delete especial characters
  textNormalize = textNormalize.replace(/[^\w\s]/gi, "");
  return textNormalize;
};
