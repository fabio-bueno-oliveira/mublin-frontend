export const truncateString = (input, maxLength) => {
   return input.length > maxLength ? `${input.substring(0, maxLength)}...` : input;
};

export const  nFormatter = (num) => {
   if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
   }
   if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
   }
   if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
   }
   return num;
};