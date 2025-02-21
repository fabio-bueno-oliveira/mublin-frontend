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

export const years = (yearSmallest, yearBiggest) => {
   let yearText = (yearSum) => {
      return yearSum === 1 ? " ano" : " anos";
   }
   let subtraction = (yearBiggest - yearSmallest);
   return subtraction === 0 ? "(menos de 1 ano)" : "("+subtraction + yearText(subtraction)+")";
}