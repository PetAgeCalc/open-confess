import { useState } from 'react';
import Header, { LegalTopic } from './components/Header';
import HomePage from './pages/HomePage';
import LegalPage from './pages/LegalPage';
import { InstallModal } from './components/InstallModal';
import CreateConfessionModal from './components/CreateConfessionModal';

export default function App() {
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [legalTopic, setLegalTopic] = useState<LegalTopic | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'fresh' | 'trending'>('fresh');
  const [refreshing, setRefreshing] = useState(false);

  function handleFreshClick() {
    setRefreshing(true);
    setActiveTab('fresh');
    try {
      localStorage.removeItem('open_confess_feed_cache_instant_v1');
      window.location.reload();
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#fff8f5] text-stone-900">
      <Header
        selectedRegion={regionFilter}
        onRegionChange={setRegionFilter}
        onOpenLegal={setLegalTopic}
        activeTab={activeTab}
        refreshing={refreshing}
        onFreshClick={handleFreshClick}
        onTabChange={setActiveTab}
        onOpenCreate={() => setCreateOpen(true)}
      />

      {/* activeTab pass karna zaroori hai taaki Fresh/Trending kaam kare */}
      <HomePage regionFilter={regionFilter} activeTab={activeTab} />

      {legalTopic && (
        <LegalPage topic={legalTopic} onClose={() => setLegalTopic(null)} />
      )}
      
      {createOpen && (
        <CreateConfessionModal 
          onClose={() => setCreateOpen(false)} 
          onCreated={() => window.location.reload()} 
        />
      )}

      {/* Install App Popup Modal */}
      <InstallModal />
    </div>
  );
}
