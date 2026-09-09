import React, { useState, useEffect } from 'react';
import { 
  X,
  Sparkles, 
  Mail, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  Copy, 
  Check 
} from 'lucide-react';

export type LegalTopic = 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer';

interface LegalModalProps {
  topic?: LegalTopic | string;
  onClose?: () => void;
}

export default function LegalModal({ topic = 'about', onClose }: LegalModalProps) {
  const getValidTab = (t?: string): LegalTopic => {
    if (t === 'contact' || t === 'privacy' || t === 'terms' || t === 'disclaimer') {
      return t;
    }
    return 'about';
  };

  const [activeTab, setActiveTab] = useState<LegalTopic>(() => getValidTab(topic));
  const [copied, setCopied] = useState(false);
  const contactEmail = 'contact@openconfess.com';

  useEffect(() => {
    if (topic) {
      setActiveTab(getValidTab(topic));
    }
  }, [topic]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: LegalTopic; label: string; icon: React.ReactNode }[] = [
    { id: 'about', label: 'About Us', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact Us', icon: <Mail className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'terms', label: 'Terms of Service', icon: <FileText className="w-4 h-4" /> },
    { id: 'disclaimer', label: 'Disclaimer', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={() => onClose && onClose()}
    >
      {/* Strictly Single Column Container for Both Mobile & Desktop */}
      <div 
        className="relative w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 my-auto border border-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-white shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-stone-900">
              Open Confess
            </h2>
            <p className="text-xs text-stone-500">Real stories. Zero identities.</p>
          </div>
          {onClose && (
            <button 
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </header>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 bg-stone-50/80 border-b border-stone-200 overflow-x-auto scrollbar-none shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200 font-semibold'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100/70'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Single-Column Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-stone-700 leading-relaxed space-y-6">
          
          {/* 1. ABOUT US */}
          {activeTab === 'about' && (
            <section className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-display mb-2">Our Mission</h3>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  Open Confess was created to give people across the world a safe, anonymous space to share their real stories — without fear of judgment, without revealing their identity, and without any login required. We believe everyone deserves to be heard.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-1.5">Global by Design</h3>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  From the USA to Europe, Australia to India, Open Confess serves a global audience. Our city-based filtering lets you connect with confessions from your part of the world or explore stories from entirely different cultures.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-1.5">Zero Identities</h3>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  We collect zero personal data. No accounts, no email addresses, no tracking. Every confession is published as "Anonymous" unless you choose to add a pen name. Even then, no data links that name to you.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-1.5">How It Works</h3>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  Upload a photo, write your story, pick your city, and publish. Your confession appears directly in the real-time community feed.
                </p>
              </div>
            </section>
          )}

          {/* 2. CONTACT US */}
          {activeTab === 'contact' && (
            <section className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-display mb-2">Get In Touch</h3>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  We welcome feedback, questions, partnership inquiries, and reports of inappropriate content. Since we do not collect personal data, please reach out using the direct email below.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Official Email</p>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-rose-500 shrink-0" />
                    <span className="font-mono text-sm sm:text-base font-semibold text-stone-900 select-all">
                      {contactEmail}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-all active:scale-95 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Copy Email'}</span>
                  </button>
                </div>
                <p className="text-xs text-stone-500">
                  For all inquiries, including feedback, content reports, and partnership proposals, please write to us directly.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Response Time</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  We aim to respond to all legitimate inquiries within 48 hours. Content reports are prioritized and reviewed within 24 hours.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Reporting Content</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  If you encounter a confession that violates our zero-tolerance policy against spam, hate speech, or harassment, please email us with the text excerpt for swift moderation.
                </p>
              </div>
            </section>
          )}

          {/* 3. PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <section className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-display mb-2">Privacy Policy</h3>
                <p className="text-xs text-stone-500 mb-4">Effective Date: January 2026</p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Zero Personal Data Collected</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Open Confess does not collect any personal data. We do not require accounts, email addresses, names, phone numbers, or any other personally identifiable information. You can use the platform fully without ever identifying yourself.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">What We Store</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  We store only the content you voluntarily publish: your confession story text, the uploaded image, the city/region you select, and an optional pen name if you choose to provide one. No data links this content to your identity.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Data Retention</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Confessions remain available in the real-time feed. Comments associated with confessions are also retained. We do not maintain long-term archives of user content beyond what is visible in the feed.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Cookies</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Open Confess does not use tracking cookies. Essential browser storage may be used for basic functionality, but no tracking or advertising cookies are deployed.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Children's Privacy</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Open Confess is intended for users aged 18 and above. We do not knowingly collect data from minors. If you believe a minor has posted content, please contact us immediately.
                </p>
              </div>
            </section>
          )}

          {/* 4. TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <section className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-display mb-2">Terms of Service</h3>
                <p className="text-xs text-stone-500 mb-4">Standard User Terms</p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Acceptance of Terms</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  By using Open Confess, you agree to these Terms of Service. If you do not agree, please do not use the platform.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">User Conduct</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  You agree not to post content that constitutes spam, hate speech, trolling, harassment, threats, or illegal material. Open Confess maintains a strict zero-tolerance policy against such content. Violations will result in immediate content removal.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Content Ownership</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  You retain ownership of the content you publish. By posting, you grant Open Confess a non-exclusive license to display your content on the platform.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">No Warranties</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Open Confess is provided "as is" without warranties of any kind. We do not guarantee the accuracy, reliability, or appropriateness of any user-generated content.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Limitation of Liability</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Open Confess is not liable for any damages arising from the use of the platform or from user-generated content. The platform is provided as a free service with no guarantees of uptime or availability.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Modifications</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.
                </p>
              </div>
            </section>
          )}

          {/* 5. DISCLAIMER */}
          {activeTab === 'disclaimer' && (
            <section className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-display mb-2">Disclaimer</h3>
                <p className="text-xs text-stone-500 mb-4">Content & Advisory Boundaries</p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">User-Generated Content</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  All confessions and comments on Open Confess are submitted by anonymous users. The views, opinions, and statements expressed in user-generated content do not reflect the views of Open Confess, its team, or its affiliates.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Not Professional Advice</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Content on Open Confess is for entertainment and community purposes only. It is not intended as professional, medical, legal, or psychological advice. If you need professional help, please consult a qualified professional.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Accuracy of Information</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  We do not verify the accuracy or truthfulness of any confession. User-generated content may be fictional, exaggerated, or inaccurate. Readers should not rely on confessions as factual statements.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">Image Content</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Uploaded images are user-submitted. We are not responsible for the content of uploaded images. If you believe an image violates your rights, please contact us for immediate removal.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-stone-900 mb-1">External Links</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Open Confess may contain links to third-party websites (e.g., social media sharing). We are not responsible for the content or practices of external sites.
                </p>
              </div>
            </section>
          )}

        </div>

        {/* Footer */}
        <footer className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-xs text-stone-400 shrink-0">
          <span>Open Confess Platform</span>
          <span>contact@openconfess.com</span>
        </footer>

      </div>
    </div>
  );
}
