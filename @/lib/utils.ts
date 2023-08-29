import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateTimeLeft = () => {
  const difference = +new Date("2023-09-01T19:00:00+05:30") - +new Date();
  let timeLeft = {
    // days: 0,
    hours: 0,
    minutes: 0,
    // seconds: 0
  };
  if (difference > 0) {
    timeLeft = {
      // use this if u want to add days in timeleft
      // days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      // hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      hours: Math.floor(difference / (1000 * 60 * 60)),
      // minutes: Math.floor((difference / 1000 / 60) % 60),
      // seconds: Math.floor((difference / 1000) % 60),
      minutes: Math.floor((difference / (1000 * 60)) % 60)
    };
  }

  return timeLeft;
};