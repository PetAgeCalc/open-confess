import { useState } from 'react';
import Header, { LegalTopic } from './components/Header';
import HomePage from './pages/HomePage';
import LegalPage from './pages/LegalPage';

export default function App() {
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [legalTopic, setLegalTopic] = useState<LegalTopic | null>(null);

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-[#fff8f5] text-stone-900">
      <Header
        selectedRegion={regionFilter}
        onRegionChange={setRegionFilter}
        onOpenLegal={setLegalTopic}
      />
      <HomePage regionFilter={regionFilter} />
      {legalTopic && <LegalPage topic={legalTopic} onClose={() => setLegalTopic(null)} />}
    </div>
  );
}
