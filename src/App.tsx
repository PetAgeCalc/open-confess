import { useState } from 'react';
import Header, { LegalTopic } from './components/Header';
import HomePage from './pages/HomePage';
import LegalPage from './pages/LegalPage';
import { InstallModal } from './components/InstallModal';
import CreateConfessionModal from './components/CreateConfessionModal';

export default function App() {
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [legalTopic, setLegalTopic] = useState<LegalTopic | null>(null);
  const [activeTab, setActiveTab] = useState<'fresh' | 'trending'>('fresh');
  const [refreshing, setRefreshing] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // 1. Fresh button action
  const handleFreshClick = () => {
    setRefreshing(true);
    setActiveTab('fresh');
    try {
      localStorage.removeItem('open_confess_feed_cache_instant_v1');
    } catch {}
    
    setTimeout(() => {
      setRefreshing(false);
      window.location.reload();
    }, 400);
  };

  // 2. Trending button action
  const handleTabChange = (tab: 'fresh' | 'trending') => {
    setActiveTab(tab);
  };

  // 3. Confess button action
  const handleOpenCreate = () => {
    setCreateModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#fff8f5] text-stone-900">
      {/* Header ko 3 buttons ke actions pass kiye gaye hain */}
      <Header
        selectedRegion={regionFilter}
        onRegionChange={setRegionFilter}
        onOpenLegal={setLegalTopic}
        activeTab={activeTab}
        refreshing={refreshing}
        onFreshClick={handleFreshClick}
        onTabChange={handleTabChange}
        onOpenCreate={handleOpenCreate}
      />

      <HomePage regionFilter={regionFilter} activeTab={activeTab} />
      
      {legalTopic && (
        <LegalPage topic={legalTopic} onClose={() => setLegalTopic(null)} />
      )}
      
      {/* Confess Button dabane par khulne wala modal */}
      {createModalOpen && (
        <CreateConfessionModal 
          onClose={() => setCreateModalOpen(false)} 
          onCreated={() => {
            setCreateModalOpen(false);
            handleFreshClick();
          }} 
        />
      )}

      {/* Install App Popup Modal */}
      <InstallModal />
    </div>
  );
}
