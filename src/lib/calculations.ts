import { ProcessData, SizingData } from '../types';

export interface SizingResults {
  requiredArea: number;
  selectedArea: number;
  orifice: string;
  inletSize: string;
  outletSize: string;
  margin: number;
  intermediates: {
    W: number;
    T: number;
    P1: number;
    C: number;
    Kd: number;
    Kb: number;
    Kc: number;
    k: number;
    Z: number;
    M: number;
  };
}

const API_ORIFICES = [
  { label: 'D', area: 0.110, inlet: '1.0"', outlet: '2.0"' },
  { label: 'E', area: 0.196, inlet: '1.0"', outlet: '2.0"' },
  { label: 'F', area: 0.307, inlet: '1.5"', outlet: '2.0"' },
  { label: 'G', area: 0.503, inlet: '1.5"', outlet: '2.5"' },
  { label: 'H', area: 0.785, inlet: '2.0"', outlet: '3.0"' },
  { label: 'J', area: 1.287, inlet: '2.0"', outlet: '3.0"' },
  { label: 'K', area: 1.838, inlet: '3.0"', outlet: '4.0"' },
  { label: 'L', area: 2.853, inlet: '3.0"', outlet: '4.0"' },
  { label: 'M', area: 3.600, inlet: '4.0"', outlet: '6.0"' },
  { label: 'N', area: 4.340, inlet: '4.0"', outlet: '6.0"' },
  { label: 'P', area: 6.380, inlet: '4.0"', outlet: '6.0"' },
  { label: 'Q', area: 11.05, inlet: '6.0"', outlet: '8.0"' },
  { label: 'R', area: 16.00, inlet: '6.0"', outlet: '8.0"' },
  { label: 'T', area: 26.00, inlet: '8.0"', outlet: '10.0"' },
];

export function calculateSizing(process: ProcessData, sizing: SizingData): SizingResults {
  // 1. Convert Units to US Customary for API 520 Formula
  const W_kg_hr = parseFloat(process.reliefRate.replace(/,/g, '')) || 0;
  const W = W_kg_hr * 2.20462; // lb/hr

  const T_C = parseFloat(process.operatingTemp) || 0;
  const T = (T_C * 1.8 + 32) + 459.67; // Rankine

  const k = parseFloat(process.specificHeatRatio) || 1.4;
  const Z = parseFloat(process.compressibility) || 1.0;
  const M = parseFloat(process.molecularWeight) || 28.97;

  // Set Pressure conversion
  let P_set_psig = parseFloat(sizing.setPressure) || 0;
  if (sizing.setPressureUnit === 'Kg/cm2') {
    P_set_psig = P_set_psig * 14.2233;
  }

  const overpressure_pct = parseFloat(sizing.overpressure) || 10;
  const P1 = P_set_psig * (1 + overpressure_pct / 100) + 14.7; // psia

  // 2. Constants
  const Kd = 0.975; // Effective coefficient of discharge
  const Kb = 1.0;   // Capacity correction factor (assuming critical flow)
  const Kc = 1.0;   // Combination correction factor

  // C constant calculation
  const C = 520 * Math.sqrt(k * Math.pow(2 / (k + 1), (k + 1) / (k - 1)));

  // 3. Area Calculation (API 520 Part 1)
  // A = W / (C * Kd * P1 * Kb * Kc) * sqrt(T * Z / M)
  const area = (W / (C * Kd * P1 * Kb * Kc)) * Math.sqrt((T * Z) / M);

  // 4. Select Orifice
  const selectedOrifice = API_ORIFICES.find(o => o.area >= area) || API_ORIFICES[API_ORIFICES.length - 1];
  
  const margin = area > 0 ? ((selectedOrifice.area - area) / area) * 100 : 0;

  return {
    requiredArea: Number(area.toFixed(3)),
    selectedArea: selectedOrifice.area,
    orifice: selectedOrifice.label,
    inletSize: selectedOrifice.inlet,
    outletSize: selectedOrifice.outlet || (parseInt(selectedOrifice.inlet) + 1).toFixed(1) + '"',
    margin: Number(margin.toFixed(2)),
    intermediates: {
      W, T, P1, C, Kd, Kb, Kc, k, Z, M
    }
  };
}
