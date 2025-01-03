export const truncateString = (input, maxLength) => {
   return input.length > maxLength ? `${input.substring(0, maxLength)}...` : input;
};