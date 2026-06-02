import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function romanize(num: number): string {
  if (isNaN(num)) return NaN.toString();
  const digits = String(+num).split("");
  const key = [
    "","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
    "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
    "","I","II","III","IV","V","VI","VII","VIII","IX"
  ];
  let roman = "";
  let i = 3;
  while (i--) {
    roman = (key[+digits.pop()! + (i * 10)] || "") + roman;
  }
  return Array(+digits.join("") + 1).join("M") + roman;
}
