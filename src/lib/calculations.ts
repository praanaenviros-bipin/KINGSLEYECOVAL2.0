import { ProcessData, SizingData } from '../types';

export interface SizingResults {
  requiredArea: number;
  selectedArea: number;
  orifice: string;
  inletSize: string;
  outletSize: string;
  margin: number;
  ratedCapacity: string;
  intermediates: {
    W?: number;
    Q?: number;
    T?: number;
    P1: number;
    P2: number;
    C?: number;
    Kd: number;
    Kb?: number;
    Kw?: number;
    Kc: number;
    Kv?: number;
    k?: number;
    Z?: number;
    M?: number;
    G?: number;
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
  const W_kg_hr = parseFloat(process.reliefRate.replace(/,/g, '')) || 0;
  const W_lb_hr = W_kg_hr * 2.20462;

  const T_C = parseFloat(process.operatingTemp) || 0;
  const T_R = (T_C * 1.8 + 32) + 459.67;

  // Set Pressure conversion
  let P_set_psig = parseFloat(sizing.setPressure) || 0;
  if (sizing.setPressureUnit === 'Kg/cm2') {
    P_set_psig = P_set_psig * 14.2233;
  }

  // Backpressure conversion
  let P2_psig = parseFloat(sizing.backpressure) || 0;
  if (sizing.backpressureUnit === 'Kg/cm2') {
    P2_psig = P2_psig * 14.2233;
  }

  const overpressure_pct = parseFloat(sizing.overpressure) || 10;
  const P1_psig = P_set_psig * (1 + overpressure_pct / 100);
  const P1_psia = P1_psig + 14.7;

  let area = 0;
  let intermediates: any = { P1: P1_psig, P2: P2_psig, Kc: 1.0 };
  let ratedCapacityValue = 0;

  if (process.state === 'GAS') {
    const k = parseFloat(process.specificHeatRatio) || 1.4;
    const Z = parseFloat(process.compressibility) || 1.0;
    const M = parseFloat(process.molecularWeight) || 28.97;
    const Kd = 0.975;
    const Kb = 1.0;
    const Kc = 1.0;
    const C = 520 * Math.sqrt(k * Math.pow(2 / (k + 1), (k + 1) / (k - 1)));

    // A = W / (C * Kd * P1 * Kb * Kc) * sqrt(T * Z / M)
    area = (W_lb_hr / (C * Kd * P1_psia * Kb * Kc)) * Math.sqrt((T_R * Z) / M);
    
    intermediates = { ...intermediates, W: W_lb_hr, T: T_R, C, Kd, Kb, k, Z, M };

    // Find orifice and calculate rated capacity
    const selectedOrifice = API_ORIFICES.find(o => o.area >= area) || API_ORIFICES[API_ORIFICES.length - 1];
    ratedCapacityValue = (selectedOrifice.area * C * Kd * P1_psia * Kb * Kc) / Math.sqrt((T_R * Z) / M);
    ratedCapacityValue = ratedCapacityValue / 2.20462; // back to kg/hr
  } else {
    const G = parseFloat(process.specificGravity) || 1.0;
    const viscosity = parseFloat(process.viscosity) || 1.0;
    const Kd = 0.62; // Typical for liquid
    const Kw = 1.0;  // Assuming conventional valve
    const Kc = 1.0;
    const Kv = 1.0;  // Assuming low viscosity for now

    // Q (gpm) = W (lb/hr) / (500 * G)
    const Q = W_lb_hr / (500 * G);

    // A = Q / (27.2 * Kd * Kw * Kc * Kv) * sqrt(G / (P1 - P2))
    const deltaP = P1_psig - P2_psig;
    area = (Q / (27.2 * Kd * Kw * Kc * Kv)) * Math.sqrt(G / Math.max(deltaP, 0.01));

    intermediates = { ...intermediates, Q, Kd, Kw, Kv, G };

    // Find orifice and calculate rated capacity
    const selectedOrifice = API_ORIFICES.find(o => o.area >= area) || API_ORIFICES[API_ORIFICES.length - 1];
    const ratedQ = selectedOrifice.area * 27.2 * Kd * Kw * Kc * Kv / Math.sqrt(G / Math.max(deltaP, 0.01));
    ratedCapacityValue = ratedQ * 500 * G / 2.20462; // back to kg/hr
  }

  const selectedOrifice = API_ORIFICES.find(o => o.area >= area) || API_ORIFICES[API_ORIFICES.length - 1];
  const margin = area > 0 ? ((selectedOrifice.area - area) / area) * 100 : 0;

  return {
    requiredArea: Number(area.toFixed(3)),
    selectedArea: selectedOrifice.area,
    orifice: selectedOrifice.label,
    inletSize: selectedOrifice.inlet,
    outletSize: selectedOrifice.outlet || (parseInt(selectedOrifice.inlet) + 1).toFixed(1) + '"',
    margin: Number(margin.toFixed(2)),
    ratedCapacity: ratedCapacityValue.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' kg/hr',
    intermediates,
  };
}
