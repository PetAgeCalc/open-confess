import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallModal: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Check karein ki user standalone mode me hai ya pehle se install kar chuka hai
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    const alreadyInstalled = localStorage.getItem('openconfess_installed') === 'true';
    const dismissedThisSession = sessionStorage.getItem('dismissed_install_modal') === 'true';

    if (isStandalone || alreadyInstalled || dismissedThisSession) {
      return;
    }

    // 2. Detect iOS (iPhone / iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // iOS par prompt event nahi hota, direct modal dikhana hota hai
      setShowModal(true);
      return;
    }

    // 3. Android / Chrome prompt capture karein
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowModal(true);
    };

    const handleAppInstalled = () => {
      localStorage.setItem('openconfess_installed', 'true');
      setShowModal(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      localStorage.setItem('openconfess_installed', 'true');
      setShowModal(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowModal(false);
    sessionStorage.setItem('dismissed_install_modal', 'true');
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center border border-pink-100">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold p-1 leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Modal Icon */}
        <div className="w-14 h-14 bg-gradient-to-tr from-[#ee4266] to-rose-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-1">
          Install Open Confess
        </h3>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          Open Confess app install karein aur bina kisi identity ke post aur react karein.
        </p>

        {isIOS ? (
          /* iPhone / iOS Guide */
          <div className="bg-pink-50/70 border border-pink-100 rounded-xl p-3 text-xs text-stone-700 text-left mb-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900">1.</span>
              <span>Niche Safari browser me <strong>Share</strong> button dabayein</span>
              <svg className="w-4 h-4 text-stone-800 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900">2.</span>
              <span>Menu me niche scroll karke <strong>Add to Home Screen</strong> chunein</span>
            </div>
          </div>
        ) : (
          /* Android 1-Click Install Button */
          <button
            onClick={handleInstallClick}
            className="w-full py-2.5 px-4 bg-[#ee4266] hover:bg-[#d93b5d] text-white font-semibold rounded-xl shadow-sm transition-all mb-2"
          >
            Install OpenConfess App
          </button>
        )}

        <button
          onClick={handleDismiss}
          className="text-xs text-gray-400 hover:text-gray-600 font-medium"
        >
          Maybe later
        </button>

      </div>
    </div>
  );
};
