import { Ban, Flame, Thermometer, Info, Construction, TrendingUp, Eye, CheckCircle2 } from 'lucide-react';
import { SizingData } from '../types';

interface FunctionalRequirementsProps {
  data: SizingData;
  onChange: (data: Partial<SizingData>) => void;
  onNext: () => void;
}

export function FunctionalRequirements({ data, onChange, onNext }: FunctionalRequirementsProps) {
  const scenarios = [
    { id: 'BLOCKED', label: 'Blocked Discharge', description: 'Relief from closure of outlet valve.', icon: Ban },
    { id: 'FIRE', label: 'Firecase', description: 'External heat exposure analysis.', icon: Flame },
    { id: 'THERMAL', label: 'Thermal Expansion', description: 'Liquid expansion in blocked sections.', icon: Thermometer },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto pt-12 pb-32">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-8 bg-tertiary"></div>
          <h2 className="text-3xl font-extrabold tracking-tight text-primary font-headline">
            Functional Requirements
          </h2>
        </div>
        <p className="text-on-surface-variant max-w-2xl">
          Define the core sizing parameters and operational safety limits for the pressure relief valve assembly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Section */}
        <div className="lg:col-span-7 space-y-8">
          {/* Sizing Scenario Selection */}
          <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(7,30,39,0.04)]">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-6">
              Select Sizing Scenario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((scenario) => {
                const Icon = scenario.icon;
                const isSelected = data.scenario === scenario.id;
                return (
                  <button
                    key={scenario.id}
                    onClick={() => onChange({ scenario: scenario.id })}
                    className={`relative flex flex-col p-5 rounded-lg cursor-pointer border-2 transition-all text-left group ${
                      isSelected
                        ? 'bg-surface-container border-primary'
                        : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'
                    }`}
                  >
                    <Icon className="text-primary mb-3" size={24} />
                    <span className="font-bold text-sm text-primary">{scenario.label}</span>
                    <span className="text-[10px] text-on-surface-variant mt-1 leading-tight">
                      {scenario.description}
                    </span>
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-primary">
                        <CheckCircle2 size={16} fill="currentColor" stroke="white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Pressure Parameters */}
          <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(7,30,39,0.04)]">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-6">
              Pressure Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-primary">Set Pressure</label>
                  <div className="flex bg-surface-container-high p-0.5 rounded text-[10px] font-bold">
                    <button
                      onClick={() => onChange({ setPressureUnit: 'PSIG' })}
                      className={`px-2 py-0.5 rounded transition-all ${
                        data.setPressureUnit === 'PSIG'
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      PSIG
                    </button>
                    <button
                      onClick={() => onChange({ setPressureUnit: 'Kg/cm2' })}
                      className={`px-2 py-0.5 rounded transition-all ${
                        data.setPressureUnit === 'Kg/cm2'
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      Kg/cm²
                    </button>
                  </div>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={data.setPressure}
                    onChange={(e) => onChange({ setPressure: e.target.value })}
                    className="w-full bg-surface-container-highest border-none rounded-sm px-4 py-3 focus:ring-0 focus:bg-surface-container-lowest transition-all text-primary font-medium"
                    placeholder="0.00"
                  />
                  <div className="absolute right-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    {data.setPressureUnit === 'PSIG' ? 'psig' : 'kg/cm²'}
                  </div>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  The gauge pressure at which the valve is set to open.
                </p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-primary">Overpressure (%)</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={data.overpressure}
                    onChange={(e) => onChange({ overpressure: e.target.value })}
                    className="w-full bg-surface-container-highest border-none rounded-sm px-4 py-3 focus:ring-0 focus:bg-surface-container-lowest transition-all text-primary font-medium"
                    placeholder="10"
                  />
                  <div className="absolute right-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    %
                  </div>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Pressure increase over the set pressure, usually 10% or 21%.
                </p>
              </div>
            </div>
          </section>

          {/* Action Button */}
          <div className="flex justify-end gap-4">
            <button className="px-8 py-3 text-sm font-bold text-primary bg-surface-container-high rounded-md hover:bg-surface-dim transition-colors">
              Save Draft
            </button>
            <button
              onClick={onNext}
              className="px-10 py-3 text-sm font-bold text-on-primary bg-gradient-to-br from-[#002046] to-[#1b365d] rounded-md shadow-lg flex items-center gap-2 hover:brightness-110 transition-all active:scale-95"
            >
              Calculate Requirements
              <TrendingUp className="text-lg" size={20} />
            </button>
          </div>
        </div>

        {/* Side Info / Telemetry Section */}
        <div className="lg:col-span-5 space-y-6">
          {/* Visual Instrument */}
          <div className="bg-primary text-on-primary p-8 rounded-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Info className="text-tertiary-fixed text-sm" size={16} fill="currentColor" stroke="white" />
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">
                  Design Reference
                </span>
              </div>
              <h4 className="text-xl font-bold mb-6 leading-tight font-headline">
                API Standard 520/521 Compliance
              </h4>
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider opacity-60">
                    <span>Allowable Accumulation</span>
                    <span>10%</span>
                  </div>
                  <div className="h-1 w-full bg-surface-container-highest/20 rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary-fixed w-[10%]"></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider opacity-60">
                    <span>Burst Pressure Safety</span>
                    <span>150 PSI</span>
                  </div>
                  <div className="h-1 w-full bg-surface-container-highest/20 rounded-full overflow-hidden">
                    <div className="h-full bg-on-secondary-container w-[65%]"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Abstract Engineering Pattern */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 border-[1px] border-on-primary/10 rounded-full"></div>
            <div className="absolute -right-8 -bottom-8 w-48 h-48 border-[1px] border-on-primary/10 rounded-full"></div>
          </div>

          {/* Precision Note */}
          <div className="bg-surface-variant/70 backdrop-blur-xl p-6 rounded-xl border-l-4 border-tertiary">
            <div className="flex gap-4">
              <div className="text-tertiary">
                <Info size={24} />
              </div>
              <div>
                <span className="block font-bold text-sm text-primary mb-1">
                  Precision Engineering Note
                </span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Ensure that the **Set Pressure** does not exceed the Maximum Allowable Working Pressure (MAWP) of the protected equipment. Thermal expansion scenarios often require smaller orifice sizes but higher precision.
                </p>
              </div>
            </div>
          </div>

          {/* Image / Technical Drawing Mock */}
          <div className="rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-xl group">
            <img
              src="https://picsum.photos/seed/valve/800/600"
              alt="Valve Assembly"
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <div className="bg-surface-container p-4 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Active Assembly: V-1042-B
              </span>
              <Eye className="text-primary" size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
