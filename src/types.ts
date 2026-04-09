export type Screen = 'PROJECT' | 'PROCESS' | 'SIZING' | 'RESULTS';

export interface ProjectData {
  clientName: string;
  location: string;
  reportNo: string;
  revNo: number;
  date: string;
}

export interface ProcessData {
  operatingPressure: string;
  designPressure: string;
  operatingTemp: string;
  designTemp: string;
  reliefRate: string;
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
  setPressureUnit: 'PSIG' | 'Kg/cm2';
  backpressure: string;
  backpressureUnit: 'PSIG' | 'Kg/cm2';
  overpressure: string;
}
