import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToUpperUnderlineToNormalWords(input: string) {
  return (
    input
      // Split the string into words based on underscores
      .split('_')
      // Convert each word to lowercase and capitalize the first letter
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      // Join the words back into a single string with spaces
      .join(' ')
  );
}

export function addSpaceBetweenWords(input: string): string {
  let output = input
    // Insert a space before all caps
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Make the whole string lowercase
    .toLowerCase();
  // Capitalize the first letter
  output = output.charAt(0).toUpperCase() + output.slice(1);
  return output;
}
