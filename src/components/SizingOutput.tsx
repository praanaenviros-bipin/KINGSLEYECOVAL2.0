import { CheckCircle2, SquareDashedBottom, Ruler, Info, Download } from 'lucide-react';
import { SizingResults } from '../lib/calculations';
import { ProjectData, ProcessData, SizingData } from '../types';
import { generateSizingReport } from '../lib/pdfGenerator';

interface SizingOutputProps {
  results: SizingResults;
  projectData: ProjectData;
  processData: ProcessData;
  sizingData: SizingData;
}

export function SizingOutput({ results, projectData, processData, sizingData }: SizingOutputProps) {
  const handleDownload = () => {
    generateSizingReport(projectData, processData, sizingData, results);
  };

  return (
    <div className="max-w-7xl mx-auto pt-12 pb-28">
      {/* Header Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-8 bg-tertiary rounded-full"></div>
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">
            Sizing Output
          </h2>
        </div>
        <p className="text-on-surface-variant max-w-2xl">
          Finalized technical validation for safety relief valve sizing. Calculations performed in accordance with <span className="font-semibold text-primary">API 520, 10th Ed Part-1</span>.
        </p>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Technical Summary Card */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl p-8 border-l-4 border-primary shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  Calculation Status
                </h3>
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 size={24} fill="currentColor" stroke="white" />
                  <span className="font-headline font-bold text-xl">Sizing Validated</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-on-surface-variant block uppercase font-bold tracking-widest">
                  Timestamp
                </span>
                <span className="text-sm font-mono font-medium">
                  {new Date().toISOString().replace('T', ' ').split('.')[0]} UTC
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
              {/* Metric 1 */}
              <div className="bg-surface-container-low p-6 rounded-lg relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                  <SquareDashedBottom size={64} />
                </div>
                <h4 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2">
                  Required Area
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-headline font-extrabold text-primary">
                    {results.requiredArea}
                  </span>
                  <span className="text-sm text-on-surface-variant font-bold">in²</span>
                </div>
                <div className="mt-4 w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-1000" 
                    style={{ width: `${Math.min((results.requiredArea / results.selectedArea) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-surface-container-low p-6 rounded-lg relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                  <Ruler size={64} />
                </div>
                <h4 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2">
                  Selected Area
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-headline font-extrabold text-primary">
                    {results.selectedArea}
                  </span>
                  <span className="text-sm text-on-surface-variant font-bold">in²</span>
                </div>
                <p className="text-[10px] text-tertiary font-bold mt-4">
                  +{results.margin}% Margin over Required
                </p>
              </div>

              {/* Metric 3 */}
              <div className="bg-surface-container p-6 rounded-lg border border-outline-variant/20">
                <h4 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">
                  Orifice Designation
                </h4>
                <div className="flex items-center justify-center bg-surface-container-lowest rounded py-4 border border-primary/10">
                  <span className="text-6xl font-headline font-extrabold text-primary tracking-tighter">
                    "{results.orifice}"
                  </span>
                </div>
              </div>

              {/* Metric 4: Rated Capacity */}
              <div className="bg-surface-container p-6 rounded-lg border border-outline-variant/20">
                <h4 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">
                  Rated Capacity
                </h4>
                <div className="flex items-center justify-center bg-surface-container-lowest rounded py-4 border border-primary/10">
                  <span className="text-2xl font-headline font-extrabold text-primary tracking-tight">
                    {results.ratedCapacity}
                  </span>
                </div>
              </div>

              {/* Metric 5 */}
              <div className="bg-surface-container p-6 rounded-lg border border-outline-variant/20 sm:col-span-2">
                <h4 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">
                  Recommended Valve Size
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center bg-surface-container-lowest p-3 rounded">
                    <span className="text-xs text-on-surface-variant font-bold">INLET</span>
                    <span className="text-lg font-headline font-bold text-primary">
                      {results.inletSize} ANSI 300
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-surface-container-lowest p-3 rounded">
                    <span className="text-xs text-on-surface-variant font-bold">OUTLET</span>
                    <span className="text-lg font-headline font-bold text-primary">
                      {results.outletSize} ANSI 150
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Preview & Action */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-surface-container-highest rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-full aspect-[3/4] bg-white rounded shadow-inner mb-6 relative overflow-hidden border border-outline-variant/30">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 opacity-5 text-6xl font-extrabold whitespace-nowrap pointer-events-none">
                KINGSLEY
              </div>
              <div className="p-4 text-left">
                <div className="h-2 w-1/2 bg-surface-container-high mb-2"></div>
                <div className="h-2 w-1/3 bg-surface-container-high mb-6"></div>
                <div className="space-y-3">
                  <div className="h-1 bg-surface-container mb-1"></div>
                  <div className="h-1 bg-surface-container mb-1"></div>
                  <div className="h-1 bg-surface-container mb-1"></div>
                  <div className="h-1 bg-surface-container mb-1"></div>
                </div>
                <div className="mt-8 flex gap-2">
                  <div className="h-12 w-12 bg-primary/10 rounded"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-2 w-full bg-surface-container"></div>
                    <div className="h-2 w-3/4 bg-surface-container"></div>
                  </div>
                </div>
              </div>
              <img
                src="https://picsum.photos/seed/blueprint/400/600"
                alt="Technical Drawing"
                className="absolute bottom-0 left-0 w-full opacity-20"
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              onClick={handleDownload}
              className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold py-4 rounded-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all group active:scale-95"
            >
              <Download size={20} />
              <span>Download Report</span>
            </button>
            <p className="text-[10px] text-on-surface-variant mt-4 leading-relaxed px-4">
              Document Kingsley-VAL-77281-R4. Includes full sizing datasheet and certification compliance documentation.
            </p>
          </div>

          {/* Technical Note Glass Card */}
          <div className="bg-surface-container-highest/70 backdrop-blur-xl rounded-xl p-6 border border-white/40">
            <div className="flex items-start gap-3">
              <Info className="text-primary" size={20} />
              <div className="text-xs leading-relaxed text-primary">
                <span className="font-bold block mb-1">Reviewer Note:</span>
                Calculated Area accounts for 10% accumulation. Recommend visual inspection of pipe header diameter before final valve selection.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
