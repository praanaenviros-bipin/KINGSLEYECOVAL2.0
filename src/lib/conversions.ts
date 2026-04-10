import { PressureUnit, TempUnit, FlowUnit } from '../types';

// Pressure Conversions (Base: barg)
const pressureToBarg = {
  'barg': 1,
  'PSIG': 0.0689476,
  'Kg/cm2': 0.980665,
};

export function convertPressure(value: string, from: PressureUnit, to: PressureUnit): string {
  const val = parseFloat(value.replace(/,/g, ''));
  if (isNaN(val)) return value;
  
  // Convert to barg first
  const inBarg = val * pressureToBarg[from];
  // Convert to target unit
  const result = inBarg / pressureToBarg[to];
  
  return result.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 4,
    useGrouping: false 
  });
}

// Temperature Conversions
export function convertTemp(value: string, from: TempUnit, to: TempUnit): string {
  let val = parseFloat(value.replace(/,/g, ''));
  if (isNaN(val)) return value;

  // Convert to Celsius first
  let inC = val;
  if (from === '°F') inC = (val - 32) / 1.8;
  else if (from === 'K') inC = val - 273.15;

  // Convert to target unit
  let result = inC;
  if (to === '°F') result = inC * 1.8 + 32;
  else if (to === 'K') result = inC + 273.15;

  return result.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2,
    useGrouping: false 
  });
}

// Flow Rate Conversions (Base: kg/hr)
// Note: m3/hr conversion usually requires density, but here we might just use a simple factor if it's water-equivalent or just provide the toggle.
// For now, let's assume a simple conversion or just handle the unit change if the user wants to enter in different units.
// Actually, m3/hr to kg/hr depends on density (Specific Gravity).
export function convertFlow(value: string, from: FlowUnit, to: FlowUnit, sg: number = 1.0): string {
  const val = parseFloat(value.replace(/,/g, ''));
  if (isNaN(val)) return value;

  let result = val;
  if (from === 'kg/hr' && to === 'm3/hr') {
    result = val / (1000 * sg);
  } else if (from === 'm3/hr' && to === 'kg/hr') {
    result = val * (1000 * sg);
  }

  return result.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2,
    useGrouping: true 
  });
}
