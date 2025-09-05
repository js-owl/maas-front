import { req_json } from "../api";

export interface CoefficientItem {
  value: string;
  label: string;
}

export interface CoefficientsData {
  finish: CoefficientItem[];
  cover: CoefficientItem[];
  tolerance: CoefficientItem[];
}

let coefficientsCache: CoefficientsData | null = null;
let coefficientsPromise: Promise<CoefficientsData> | null = null;

export async function getCoefficients(): Promise<CoefficientsData> {
  // If we already have cached data, return it immediately
  if (coefficientsCache) {
    return coefficientsCache;
  }

  // If there's already a request in progress, return that promise
  if (coefficientsPromise) {
    return coefficientsPromise;
  }

  // Create a new request promise
  coefficientsPromise = (async () => {
    try {
      const r = await req_json(`/calculator/coefficients/`, "GET");
      const data = await r?.json();
      
      coefficientsCache = {
        finish: data.finish.map((item: any) => ({
          value: item.id,
          label: item.value,
        })),
        cover: data.cover.map((item: any) => ({
          value: item.id,
          label: item.value,
        })),
        tolerance: data.tolerance.map((item: any) => ({
          value: item.id,
          label: item.value,
        })),
      };

      return coefficientsCache;
    } catch (error) {
      console.error("Failed to load coefficients:", error);
      // Clear the promise on error so we can retry
      coefficientsPromise = null;
      throw error;
    }
  })();

  return coefficientsPromise;
}

export function clearCoefficientsCache() {
  coefficientsCache = null;
  coefficientsPromise = null;
}
