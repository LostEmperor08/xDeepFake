import { useState } from 'react';
import { Navbar } from './layouts/Navbar';
import { Footer } from './layouts/Footer';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { ReportPage } from './pages/ReportPage';
import { MethodologyPage } from './pages/MethodologyPage';
import type { AnalysisReport } from './types/forensic';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'methodology'>('dashboard');
  const [currentReport, setCurrentReport] = useState<AnalysisReport | null>(null);

  const handleReportGenerated = (report: AnalysisReport) => {
    setCurrentReport(report);
  };

  const handleReset = () => {
    setCurrentReport(null);
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 cyber-grid">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          // If navigating away, reset report view if desired
          setCurrentReport(null);
          setActiveTab(tab);
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentReport ? (
          <ReportPage report={currentReport} onReset={handleReset} />
        ) : activeTab === 'dashboard' ? (
          <DashboardPage
            onStartAnalysis={() => setActiveTab('upload')}
            onViewMethodology={() => setActiveTab('methodology')}
          />
        ) : activeTab === 'upload' ? (
          <UploadPage onReportGenerated={handleReportGenerated} />
        ) : (
          <MethodologyPage />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
