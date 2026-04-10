import { Settings2, Info, AlertTriangle, Waves, ChevronRight, Gauge, Droplets } from 'lucide-react';
import { ProcessData, PressureUnit, TempUnit, FlowUnit } from '../types';
import { convertPressure, convertTemp, convertFlow } from '../lib/conversions';

interface ProcessConditionsProps {
  data: ProcessData;
  onChange: (data: Partial<ProcessData>) => void;
  onNext: () => void;
}

export function ProcessConditions({ data, onChange, onNext }: ProcessConditionsProps) {
  const handlePressureUnitChange = (field: 'operatingPressure' | 'designPressure', newUnit: PressureUnit) => {
    const currentUnit = field === 'operatingPressure' ? data.operatingPressureUnit : data.designPressureUnit;
    const currentValue = field === 'operatingPressure' ? data.operatingPressure : data.designPressure;
    const newValue = convertPressure(currentValue, currentUnit, newUnit);
    onChange({ 
      [field]: newValue, 
      [`${field}Unit`]: newUnit 
    });
  };

  const handleTempUnitChange = (field: 'operatingTemp' | 'designTemp', newUnit: TempUnit) => {
    const currentUnit = field === 'operatingTemp' ? data.operatingTempUnit : data.designTempUnit;
    const currentValue = field === 'operatingTemp' ? data.operatingTemp : data.designTemp;
    const newValue = convertTemp(currentValue, currentUnit, newUnit);
    onChange({ 
      [field]: newValue, 
      [`${field}Unit`]: newUnit 
    });
  };

  const handleFlowUnitChange = (newUnit: FlowUnit) => {
    const newValue = convertFlow(data.reliefRate, data.reliefRateUnit, newUnit, parseFloat(data.specificGravity) || 1.0);
    onChange({ 
      reliefRate: newValue, 
      reliefRateUnit: newUnit 
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-12">
      {/* Page Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-tertiary"></div>
          <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">
            Parameter Configuration
          </span>
        </div>
        <h2 className="text-4xl font-extrabold font-headline text-primary tracking-tight">
          Process Conditions
        </h2>
        <p className="text-on-surface-variant mt-2 max-w-2xl">
          Define the operational envelope and fluid characteristics for the primary relief stream. Precise input ensures calibrated sizing accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Operating & Design Section */}
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold font-headline flex items-center gap-2 text-primary">
                <Settings2 className="text-lg" size={20} />
                Operating & Design
              </h3>
              <span className="bg-surface-container-high text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-tighter">
                Calibrated Units: Multi-Standard
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              {/* Pressure Cluster */}
              <div className="space-y-6">
                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Operating Pressure
                    </label>
                    <select 
                      value={data.operatingPressureUnit}
                      onChange={(e) => handlePressureUnitChange('operatingPressure', e.target.value as PressureUnit)}
                      className="text-[10px] font-bold bg-surface-container-high border-none rounded px-1 py-0.5 focus:ring-0"
                    >
                      <option value="barg">barg</option>
                      <option value="PSIG">PSIG</option>
                      <option value="Kg/cm2">Kg/cm²</option>
                    </select>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={data.operatingPressure}
                      onChange={(e) => onChange({ operatingPressure: e.target.value })}
                      className="w-full bg-surface-container-highest border-none text-primary font-bold text-lg px-4 py-3 rounded-sm focus:bg-surface-container-lowest focus:ring-0 transition-all border-b-2 border-transparent focus:border-primary"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-on-surface-variant">
                      {data.operatingPressureUnit}
                    </span>
                  </div>
                </div>
                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Design Pressure
                    </label>
                    <select 
                      value={data.designPressureUnit}
                      onChange={(e) => handlePressureUnitChange('designPressure', e.target.value as PressureUnit)}
                      className="text-[10px] font-bold bg-surface-container-high border-none rounded px-1 py-0.5 focus:ring-0"
                    >
                      <option value="barg">barg</option>
                      <option value="PSIG">PSIG</option>
                      <option value="Kg/cm2">Kg/cm²</option>
                    </select>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={data.designPressure}
                      onChange={(e) => onChange({ designPressure: e.target.value })}
                      className="w-full bg-surface-container-highest border-none text-primary font-bold text-lg px-4 py-3 rounded-sm focus:bg-surface-container-lowest focus:ring-0 transition-all border-b-2 border-transparent focus:border-primary"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-on-surface-variant">
                      {data.designPressureUnit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Temperature Cluster */}
              <div className="space-y-6">
                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Operating Temp
                    </label>
                    <select 
                      value={data.operatingTempUnit}
                      onChange={(e) => handleTempUnitChange('operatingTemp', e.target.value as TempUnit)}
                      className="text-[10px] font-bold bg-surface-container-high border-none rounded px-1 py-0.5 focus:ring-0"
                    >
                      <option value="°C">°C</option>
                      <option value="°F">°F</option>
                      <option value="K">K</option>
                    </select>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={data.operatingTemp}
                      onChange={(e) => onChange({ operatingTemp: e.target.value })}
                      className="w-full bg-surface-container-highest border-none text-primary font-bold text-lg px-4 py-3 rounded-sm focus:bg-surface-container-lowest focus:ring-0 transition-all border-b-2 border-transparent focus:border-primary"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-on-surface-variant">
                      {data.operatingTempUnit}
                    </span>
                  </div>
                </div>
                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Design Temp
                    </label>
                    <select 
                      value={data.designTempUnit}
                      onChange={(e) => handleTempUnitChange('designTemp', e.target.value as TempUnit)}
                      className="text-[10px] font-bold bg-surface-container-high border-none rounded px-1 py-0.5 focus:ring-0"
                    >
                      <option value="°C">°C</option>
                      <option value="°F">°F</option>
                      <option value="K">K</option>
                    </select>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={data.designTemp}
                      onChange={(e) => onChange({ designTemp: e.target.value })}
                      className="w-full bg-surface-container-highest border-none text-primary font-bold text-lg px-4 py-3 rounded-sm focus:bg-surface-container-lowest focus:ring-0 transition-all border-b-2 border-transparent focus:border-primary"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-on-surface-variant">
                      {data.designTempUnit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Full Width Relief Rate */}
              <div className="md:col-span-2 bg-surface-container p-6 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-bold text-on-tertiary-container uppercase tracking-wider">
                    Required Relief Rate
                  </label>
                  <select 
                    value={data.reliefRateUnit}
                    onChange={(e) => handleFlowUnitChange(e.target.value as FlowUnit)}
                    className="text-[10px] font-bold bg-surface-container-lowest border-none rounded px-2 py-1 focus:ring-0"
                  >
                    <option value="kg/hr">kg/hr</option>
                    <option value="m3/hr">m³/hr</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={data.reliefRate}
                      onChange={(e) => onChange({ reliefRate: e.target.value })}
                      className="w-full bg-surface-container-lowest border-none text-primary font-extrabold text-2xl px-4 py-4 rounded-sm focus:ring-0 border-b-2 border-primary"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-on-surface-variant">
                      {data.reliefRateUnit}
                    </span>
                  </div>
                  <div className="bg-tertiary-fixed text-on-tertiary-fixed p-4 rounded flex flex-col items-center justify-center min-w-[80px]">
                    <AlertTriangle size={20} />
                    <span className="text-[10px] font-bold uppercase mt-1">Critical</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Advisory Card */}
          <div className="bg-primary-container text-white p-6 rounded-xl flex gap-6 items-start">
            <Info className="text-4xl text-primary-fixed" size={32} />
            <div>
              <h4 className="font-headline font-bold text-lg mb-1">Validation Thresholds</h4>
              <p className="text-sm text-primary-fixed-dim leading-relaxed">
                System is currently operating at 77% of Design Pressure. Automatic overpressure protection calculation is active based on API 520 standards.
              </p>
            </div>
          </div>
        </section>

        {/* Fluid Properties Section */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/20 p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold font-headline flex items-center gap-2 text-primary mb-8">
              <Waves className="text-lg" size={20} />
              Fluid Properties
            </h3>
            <div className="space-y-8">
              {/* Fluid Identity */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Fluid Name / Identifier
                </label>
                <input
                  type="text"
                  value={data.fluidName}
                  onChange={(e) => onChange({ fluidName: e.target.value })}
                  className="w-full bg-surface-container-low border-none text-primary font-medium px-4 py-3 rounded-sm focus:bg-surface-container-lowest transition-all"
                  placeholder="e.g. Superheated Steam / Natural Gas"
                />
              </div>

              {/* State Toggle */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                  Thermodynamic State
                </label>
                <div className="flex bg-surface-container-high p-1 rounded-md">
                  <button
                    onClick={() => onChange({ state: 'GAS' })}
                    className={`flex-1 py-2 text-sm font-bold rounded flex items-center justify-center gap-2 transition-all ${
                      data.state === 'GAS'
                        ? 'bg-primary text-white shadow-md'
                        : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    <Gauge size={16} />
                    Gas / Vapor
                  </button>
                  <button
                    onClick={() => onChange({ state: 'LIQUID' })}
                    className={`flex-1 py-2 text-sm font-bold rounded flex items-center justify-center gap-2 transition-all ${
                      data.state === 'LIQUID'
                        ? 'bg-primary text-white shadow-md'
                        : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    <Droplets size={16} />
                    Liquid
                  </button>
                </div>
              </div>

              {/* Dynamic Inputs */}
              <div className="space-y-6 pt-4 border-t border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">
                    {data.state === 'GAS' ? 'Gas Properties' : 'Liquid Properties'}
                  </span>
                  <span className="h-[1px] flex-grow mx-4 bg-outline-variant/30"></span>
                </div>
                
                {data.state === 'GAS' ? (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                          Molecular Weight
                        </p>
                        <input
                          type="text"
                          value={data.molecularWeight}
                          onChange={(e) => onChange({ molecularWeight: e.target.value })}
                          className="bg-transparent border-none p-0 text-primary font-bold text-xl focus:ring-0 w-24"
                        />
                      </div>
                      <span className="text-xs font-bold text-on-surface-variant">g/mol</span>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                          Specific Heat Ratio (k)
                        </p>
                        <input
                          type="text"
                          value={data.specificHeatRatio}
                          onChange={(e) => onChange({ specificHeatRatio: e.target.value })}
                          className="bg-transparent border-none p-0 text-primary font-bold text-xl focus:ring-0 w-24"
                        />
                      </div>
                      <span className="text-xs font-bold text-on-surface-variant">Cp/Cv</span>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                          Compressibility (Z)
                        </p>
                        <input
                          type="text"
                          value={data.compressibility}
                          onChange={(e) => onChange({ compressibility: e.target.value })}
                          className="bg-transparent border-none p-0 text-primary font-bold text-xl focus:ring-0 w-24"
                        />
                      </div>
                      <span className="text-xs font-bold text-on-surface-variant">Unitless</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                          Specific Gravity
                        </p>
                        <input
                          type="text"
                          value={data.specificGravity}
                          onChange={(e) => onChange({ specificGravity: e.target.value })}
                          className="bg-transparent border-none p-0 text-primary font-bold text-xl focus:ring-0 w-24"
                        />
                      </div>
                      <span className="text-xs font-bold text-on-surface-variant">@ Rel. Temp</span>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                          Viscosity
                        </p>
                        <input
                          type="text"
                          value={data.viscosity}
                          onChange={(e) => onChange({ viscosity: e.target.value })}
                          className="bg-transparent border-none p-0 text-primary font-bold text-xl focus:ring-0 w-24"
                        />
                      </div>
                      <span className="text-xs font-bold text-on-surface-variant">cP</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Anchor */}
          <button
            onClick={onNext}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-5 rounded-lg font-bold flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span>COMMIT PROCESS DATA</span>
            <ChevronRight size={20} />
          </button>
        </section>
      </div>
    </div>
  );
}
