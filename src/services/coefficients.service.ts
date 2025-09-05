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

export async function getCoefficients(): Promise<CoefficientsData> {
  if (coefficientsCache) {
    return coefficientsCache;
  }

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
    throw error;
  }
}

export function clearCoefficientsCache() {
  coefficientsCache = null;
}
