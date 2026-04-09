import { MapPin, FileText, Info, ArrowRight, Verified } from 'lucide-react';
import { ProjectData } from '../types';

interface ProjectDetailsProps {
  data: ProjectData;
  onChange: (data: Partial<ProjectData>) => void;
  onNext: () => void;
}

export function ProjectDetails({ data, onChange, onNext }: ProjectDetailsProps) {
  return (
    <div className="max-w-5xl mx-auto pt-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="border-l-2 border-tertiary pl-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
            Project Initialization
          </p>
          <h2 className="text-4xl font-extrabold tracking-tighter text-primary font-headline">
            Technical Specifications
          </h2>
        </div>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold tracking-tighter">System Status</p>
            <p className="text-sm font-medium">Calibrated / Active</p>
          </div>
          <div className="text-tertiary-fixed-dim">
            <Verified size={24} fill="currentColor" stroke="white" />
          </div>
        </div>
      </div>

      {/* Form Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Form Card */}
        <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(7,30,39,0.04)] flex flex-col gap-8">
          <div className="space-y-6">
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                Client Name
              </label>
              <input
                type="text"
                value={data.clientName}
                onChange={(e) => onChange({ clientName: e.target.value })}
                className="w-full bg-surface-container-highest border-none rounded-sm px-4 py-4 text-primary font-medium focus:ring-0 focus:bg-surface-container-lowest transition-all border-b-primary focus:border-b-2 placeholder:text-outline-variant/60"
                placeholder="Enter corporate entity..."
              />
            </div>
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => onChange({ location: e.target.value })}
                  className="w-full bg-surface-container-highest border-none rounded-sm pl-12 pr-4 py-4 text-primary font-medium focus:ring-0 focus:bg-surface-container-lowest transition-all border-b-primary focus:border-b-2 placeholder:text-outline-variant/60"
                  placeholder="Site coordinates or facility name..."
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
              </div>
            </div>
          </div>

          {/* Technical Illustration */}
          <div className="mt-4 overflow-hidden rounded-lg h-48 bg-surface-container relative">
            <img
              src="https://picsum.photos/seed/industrial/1200/600"
              alt="Industrial Facility"
              className="w-full h-full object-cover mix-blend-overlay opacity-40"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <div className="bg-primary/90 text-on-primary p-3 inline-block self-start rounded-sm">
                <p className="text-[10px] uppercase font-bold tracking-widest">Facility Insight</p>
                <p className="text-xs">Precision mapping active for global coordinates.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Report No Card */}
          <div className="bg-surface-container-low p-6 rounded-xl">
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
              Kingsley Report No.
            </label>
            <div className="flex items-center gap-3 bg-surface-container-lowest p-4 rounded-sm border-l-4 border-primary">
              <FileText className="text-primary" size={20} />
              <input
                type="text"
                value={data.reportNo}
                onChange={(e) => onChange({ reportNo: e.target.value })}
                className="w-full bg-transparent border-none p-0 focus:ring-0 font-mono text-primary font-bold"
              />
            </div>
          </div>

          {/* Revision & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-6 rounded-xl">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                Rev No.
              </label>
              <input
                type="number"
                value={data.revNo}
                onChange={(e) => onChange({ revNo: parseInt(e.target.value) || 0 })}
                className="w-full bg-surface-container-lowest border-none rounded-sm p-4 text-center font-bold text-primary focus:ring-0"
              />
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                Date
              </label>
              <input
                type="date"
                value={data.date}
                onChange={(e) => onChange({ date: e.target.value })}
                className="w-full bg-surface-container-lowest border-none rounded-sm p-3 text-xs font-bold text-primary focus:ring-0"
              />
            </div>
          </div>

          {/* Integrity Card */}
          <div className="flex-grow bg-surface-variant/70 backdrop-blur-xl p-6 rounded-xl border border-white/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Info className="text-primary" size={16} />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Form Integrity
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                All inputs are validated against ISO 9001:2015 engineering standards. Ensure Report Number follows the KR-YYYY-XXXX format.
              </p>
            </div>
            <div className="pt-6">
              <div className="h-1 w-full bg-outline-variant/30 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/4"></div>
              </div>
              <p className="text-[10px] mt-2 font-bold text-on-surface-variant uppercase tracking-widest">
                Step 1 of 4: Identity
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="md:col-span-12 flex justify-end items-center mt-8">
          <button
            onClick={onNext}
            className="group flex items-center gap-4 bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-5 rounded-md shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            <span className="text-sm font-bold uppercase tracking-[0.2em]">Proceed to Process</span>
            <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
