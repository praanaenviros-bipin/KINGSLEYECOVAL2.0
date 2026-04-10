export type Screen = 'PROJECT' | 'PROCESS' | 'SIZING' | 'RESULTS';

export interface ProjectData {
  clientName: string;
  location: string;
  reportNo: string;
  revNo: number;
  date: string;
}

export type PressureUnit = 'barg' | 'PSIG' | 'Kg/cm2';
export type TempUnit = '°C' | '°F' | 'K';
export type FlowUnit = 'kg/hr' | 'm3/hr';

export interface ProcessData {
  operatingPressure: string;
  operatingPressureUnit: PressureUnit;
  designPressure: string;
  designPressureUnit: PressureUnit;
  operatingTemp: string;
  operatingTempUnit: TempUnit;
  designTemp: string;
  designTempUnit: TempUnit;
  reliefRate: string;
  reliefRateUnit: FlowUnit;
  fluidName: string;
  state: 'GAS' | 'LIQUID';
  molecularWeight: string;
  specificHeatRatio: string;
  compressibility: string;
  specificGravity: string;
  viscosity: string;
}

export interface SizingData {
  scenario: 'BLOCKED' | 'FIRE' | 'THERMAL';
  setPressure: string;
  setPressureUnit: PressureUnit;
  backpressure: string;
  backpressureUnit: PressureUnit;
  overpressure: string;
}
