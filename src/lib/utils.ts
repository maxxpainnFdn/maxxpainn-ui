import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import colors from "tailwindcss/colors";
import Color from "color";
import api from "@/config/api";
import { BN } from "@coral-xyz/anchor";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";
import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';
import { getNetworkById } from "@/config/networks";
import app from "@/config/app";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function daysToYearsMonthsDays(days: number) {
  const years = Math.floor(days / 365);
  const remainingDays = days % 365;

  const months = Math.floor(remainingDays / 30); // Approximate month length
  const finalDays = remainingDays % 30;

  return { years, months, days: finalDays };
}

export default class utils {
  static systemError = "Opps!, something just broke";

  static maskAddress(
    address: string = "",
    firstLen: number = 2,
    lastLen: number = 2,
  ): string {
    if (!address || address == null || address.trim() === "") return "";

    return (
      address.substring(0, firstLen) + ".." + address.slice(-lastLen) // ✅ replaces substr
    );
  }

  static logError(msg = "", e = null) {
    console.log("Error: ", msg);
    if (e != null) console.error(e, e.stack);
  }

  static tailwindColorToHSL(tailwindColor: string): string {
    if (tailwindColor.startsWith("from-")) {
      tailwindColor = tailwindColor.replace("from-", "");
    }

    // Split "purple-500" → ["purple", "500"]
    const [name, shade] = tailwindColor.split("-");

    const colorGroup = colors[name];

    if (!colorGroup) {
      throw new Error(`Unknown Tailwind color: ${name}`);
    }

    const hex = colorGroup[shade];

    if (!hex) {
      throw new Error(`Shade ${shade} not found for color ${name}`);
    }

    // Convert HEX → HSL
    const hsl = Color(hex).hsl().string();

    return hsl;
  }

  static getServerImage(image: string, group: string, size: string): string {
    let imageHost = (app.imageCdn || "") != "" ? app.imageCdn : api.endpoint;
    let url = `${imageHost}/files/images/${group}/${size}/${image}`;
    return url;
  }

  static getCoverPhotoSize(): string {
    // Check if code is running in browser
    if (typeof window === "undefined") return "large"; // Default for SSR

    const width = window.innerWidth;
    const dpr = window.devicePixelRatio || 1;

    // Optional: Adjust target width based on pixel ratio for sharper images on retina screens
    // remove the (* dpr) part if you want to strictly save bandwidth over quality
    const targetWidth = width * (dpr > 1.5 ? 1.5 : 1);

    if (targetWidth >= 1200) return "large";
    if (targetWidth >= 800) return "medium";
    if (targetWidth >= 600) return "small";

    return "xsmall";
  }

  static getCoverPhotoUrl(
    image: string,
    group: string,
    size: string = "",
  ): string {
    if (size == "") size = this.getCoverPhotoSize();
    let url = `${api.endpoint}/files/images/${group}/${size}/${image}`;
    return url;
  }

  static toShortNumber(num: number | string) {
    num = Number(num);

    const units = ["", "K", "M", "B", "T"]; // stops at trillion
    let unitIndex = 0;

    while (Math.abs(num) >= 1000 && unitIndex < units.length - 1) {
      num /= 1000;
      unitIndex++;
    }

    return num.toFixed(2).replace(/\.00$/, "") + units[unitIndex];
  }

  static formatUnit(value: any, decimals: number): string {
    let valueBN = new BN(value.toString()).div(new BN(Math.pow(10, decimals)));
    return valueBN.toString();
  }
  
  static toUnits(value: any, decimals: number): BN {
    const [whole, fraction = ""] = value.toString().split(".");
  
    const safeFraction = fraction.slice(0, decimals);
    const padded = safeFraction.padEnd(decimals, "0");
  
    return new BN(whole)
      .mul(new BN(10).pow(new BN(decimals)))
      .add(new BN(padded));
  }

  static isFloat(n: any): boolean {
    return Number(n) === n && n % 1 !== 0;
  }

  static isFloatString(n) {
    return !Number.isNaN(parseFloat(n)) && n.toString().includes(".");
  }

  static toLocaleString(value: any, maxDecimals: number = 2): string {
    value = Number(value);
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxDecimals,
    });
  }

  static truncDecimals(value: number, decimals = 2): number {
    const factor = 10 ** decimals;
    return Math.trunc(value * factor) / factor;
  }

  /*
  static getRelativeDate(dateString: string | Date) {
    const date = new Date(dateString);
    const now = new Date();

    // If more than 30 days ago, return "January 10"
    if (differenceInDays(now, date) > 30) {
      return format(date, "MMMM d");
      // Use "MMMM d, yyyy" if you want the year included
    }

    // Otherwise return "5 minutes ago", "2 hours ago"
    return formatDistanceToNow(date, { addSuffix: false, includeSeconds:false });
    }*/

  static getRelativeDate(
    date: Date | string | number,
    addPrefix: boolean | undefined = true,
  ): string {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const suffix = addPrefix ? ` ago` : "";

    // Handle future dates or just now
    if (diffInSeconds < 5) {
      return "just now";
    }

    const minute = 60;
    const hour = 3600;
    const day = 86400;
    const week = 604800;
    const month = 2592000; // ~30 days

    // Short format for less than a month
    if (diffInSeconds < minute) {
      return `${diffInSeconds}s${suffix}`;
    }

    if (diffInSeconds < hour) {
      return `${Math.floor(diffInSeconds / minute)}m${suffix}`;
    }

    if (diffInSeconds < day) {
      return `${Math.floor(diffInSeconds / hour)}h${suffix}`;
    }

    if (diffInSeconds < week) {
      return `${Math.floor(diffInSeconds / day)}d${suffix}`;
    }

    if (diffInSeconds < month) {
      return `${Math.floor(diffInSeconds / week)}w${suffix}`;
    }

    // Month and above: show "MMM YYYY" format (no suffix needed)
    return past.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  static async sleep(timeMs: number) {
    return new Promise((resolve) => setTimeout(resolve, timeMs));
  }

  static daysToSeconds(days: number): number {
    const SECONDS_PER_DAY = 60 * 60 * 24;
    return SECONDS_PER_DAY * days;
  }
    
  static uuidFromSeed(seed: string): string {
    return uuidv5(seed, "a13a7628-1154-43cc-9e2a-93c0a6ddedcc");
  }
  
  static getExplorerUrl(networkId: string, uri: string): string {
    const netInfo = getNetworkById(networkId);
    if (!netInfo) return ""
    const exp = new URL(netInfo.explorer)
    exp.pathname = uri;
    return exp.toString()
  }
  
  static getAccountExplorerUrl(networkId: string, account: string): string {
    return this.getExplorerUrl(networkId, `account/${account}`)
  }
  
}
