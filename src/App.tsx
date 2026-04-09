/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header, BottomNav } from './components/Navigation';
import { ProjectDetails } from './components/ProjectDetails';
import { ProcessConditions } from './components/ProcessConditions';
import { FunctionalRequirements } from './components/FunctionalRequirements';
import { SizingOutput } from './components/SizingOutput';
import { Screen, ProjectData, ProcessData, SizingData } from './types';
import { calculateSizing } from './lib/calculations';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('PROJECT');

  const [projectData, setProjectData] = useState<ProjectData>({
    clientName: '',
    location: '',
    reportNo: 'KR-2024-0892',
    revNo: 2,
    date: '2024-04-09',
  });

  const [processData, setProcessData] = useState<ProcessData>({
    operatingPressure: '42.5',
    designPressure: '55.0',
    operatingTemp: '180',
    designTemp: '225',
    reliefRate: '12,500.00',
    fluidName: '',
    state: 'GAS',
    molecularWeight: '28.97',
    specificHeatRatio: '1.40',
    compressibility: '0.985',
    specificGravity: '1.0',
    viscosity: '1.0',
  });

  const [sizingData, setSizingData] = useState<SizingData>({
    scenario: 'BLOCKED',
    setPressure: '797.7',
    setPressureUnit: 'PSIG',
    backpressure: '0.00',
    backpressureUnit: 'PSIG',
    overpressure: '10',
  });

  const renderScreen = () => {
    switch (currentScreen) {
      case 'PROJECT':
        return (
          <ProjectDetails
            data={projectData}
            onChange={(newData) => setProjectData((prev) => ({ ...prev, ...newData }))}
            onNext={() => setCurrentScreen('PROCESS')}
          />
        );
      case 'PROCESS':
        return (
          <ProcessConditions
            data={processData}
            onChange={(newData) => setProcessData((prev) => ({ ...prev, ...newData }))}
            onNext={() => setCurrentScreen('SIZING')}
          />
        );
      case 'SIZING':
        return (
          <FunctionalRequirements
            data={sizingData}
            onChange={(newData) => setSizingData((prev) => ({ ...prev, ...newData }))}
            onNext={() => setCurrentScreen('RESULTS')}
          />
        );
      case 'RESULTS':
        const results = calculateSizing(processData, sizingData);
        return (
          <SizingOutput 
            results={results} 
            projectData={projectData}
            processData={processData}
            sizingData={sizingData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentScreen={currentScreen} onScreenChange={setCurrentScreen} />
      
      <main className="flex-grow px-6 md:px-12 pt-16 pb-20 md:pb-8">
        {renderScreen()}
      </main>

      <BottomNav
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
      />
    </div>
  );
}

