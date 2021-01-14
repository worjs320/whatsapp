export function setMaxlengthText (text) {
  if (text?.length > 10) {
    text = text.substring(0,10);
    text = text.concat("...");
  }
  return text;
}