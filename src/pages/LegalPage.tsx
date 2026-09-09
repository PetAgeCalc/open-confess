import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  HeartHandshake, 
  EyeOff, 
  Copy, 
  Check, 
  HeartPulse, 
  Ban,
  Clock,
  ShieldAlert
} from 'lucide-react';

type LegalTab = 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer';

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<LegalTab>('about');
  const [copied, setCopied] = useState(false);
  const contactEmail = 'contact@openconfess.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: LegalTab; label: string; icon: React.ReactNode }[] = [
    { id: 'about', label: 'About Us', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact Us', icon: <Mail className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'terms', label: 'Terms of Service', icon: <FileText className="w-4 h-4" /> },
    { id: 'disclaimer', label: 'Disclaimer & Moderation', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  return (
    <main className="w-full min-h-screen bg-stone-50/60 py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <header className="p-6 sm:p-8 border-b border-stone-100 bg-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>OpenConfess Legal & Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
            Platform Policies & Guidelines
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Read our core philosophy, data confidentiality standards, and community safety guidelines.
          </p>
        </header>

        {/* Tab Navigation Menu */}
        <nav className="flex items-center gap-1.5 p-3 sm:px-6 bg-stone-50/70 border-b border-stone-200 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
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

        {/* Content Area */}
        <div className="p-6 sm:p-10 text-stone-700 leading-relaxed space-y-6">
          
          {/* 1. ABOUT US */}
          {activeTab === 'about' && (
            <section className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 font-display mb-2">
                  Real Stories. Zero Identities.
                </h2>
                <p className="text-sm sm:text-base text-stone-600">
                  OpenConfess is dedicated to offering a sanctuary for genuine human emotion. In today’s digital era, self-expression is often restrained by social expectations, follower counts, and public scrutiny. People carry silent heartbreaks, quiet regrets, unspoken victories, and deeply personal thoughts that they cannot share on identity-linked social networks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1">True Anonymity</h3>
                  <p className="text-xs sm:text-sm text-stone-600">
                    No profiles, no public identities, and no names required. You are defined only by the honesty of what you choose to express.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="w-9 h-9 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center mb-3">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm mb-1">Empathy First</h3>
                  <p className="text-xs sm:text-sm text-stone-600">
                    An open community where vulnerability meets constructive perspectives, shared reassurance, and mutual understanding.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-stone-600">
                  Every confession published here exists independently. We believe that when people read raw, unfiltered thoughts from others, they realize they are never truly alone in what they feel.
                </p>
              </div>
            </section>
          )}

          {/* 2. CONTACT US */}
          {activeTab === 'contact' && (
            <section className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 font-display mb-2">
                  Official Support & Direct Communication
                </h2>
                <p className="text-sm sm:text-base text-stone-600">
                  Have a suggestion, an inquiry, or a critical moderation concern regarding a submission? Our team is dedicated to keeping this platform safe and respectful.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
                <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">
                  Official Email Address
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-base sm:text-lg font-bold text-stone-900 select-all">
                      {contactEmail}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-medium transition-all active:scale-95 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Copy Email'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl border border-stone-100 bg-white space-y-1">
                  <h3 className="font-bold text-stone-900 text-sm">Content Removal Requests</h3>
                  <p className="text-xs text-stone-600">
                    If an anonymous submission mentions identifying elements, email us the excerpt for immediate review and removal.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-stone-100 bg-white space-y-1">
                  <h3 className="font-bold text-stone-900 text-sm">Response Timeline</h3>
                  <p className="text-xs text-stone-600">
                    Our platform administrators address authentic reports and inquiries within 24 to 48 hours.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* 3. PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <section className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 font-display mb-2">
                  Privacy Policy & Non-Tracking Commitment
                </h2>
                <p className="text-xs text-stone-400">Effective Date: January 2026</p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-600">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                  <h3 className="font-bold text-stone-900 text-sm">1. Zero Personal Data Collection</h3>
                  <p>
                    OpenConfess operates without mandatory accounts, passwords, email verification, or phone numbers. We do not build digital profiles or map IP addresses to private identities.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                  <h3 className="font-bold text-stone-900 text-sm">2. Absolute No Data Monetization</h3>
                  <p>
                    We strictly do not sell, license, rent, or trade your activity to advertising networks, third-party data brokers, or marketing corporations.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                  <h3 className="font-bold text-stone-900 text-sm">3. Local Device Preferences</h3>
                  <p>
                    Your interactive preferences—such as reactions or newly submitted comments—are handled locally on your own personal device browser. This ensures continuity without tracking you across the web.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                  <h3 className="font-bold text-stone-900 text-sm">4. Public Submissions Warning</h3>
                  <p>
                    Confessions and comments are published publicly. For your own protection and privacy, never write personal identifying details (real names, addresses, phone numbers) in the confession text.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* 4. TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <section className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 font-display mb-2">
                  Terms of Service
                </h2>
                <p className="text-xs text-stone-400">Standard User Agreement</p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-600">
                <div>
                  <h3 className="font-bold text-stone-900 mb-1 text-sm">1. Agreement to Terms</h3>
                  <p>
                    By accessing OpenConfess, you acknowledge and agree to comply with these terms and all relevant laws. If you disagree with any part of these rules, you must discontinue using the platform.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 mb-1 text-sm">2. Minimum Age</h3>
                  <p>
                    You must be at least 13 years of age (or the minimum legal age required in your region to access public digital communication platforms) to interact with or submit confessions.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 mb-1 text-sm">3. Permitted Platform Use</h3>
                  <p>
                    The platform exists for personal narrative sharing, reading, and empathetic support. Any malicious activity—including automated web scraping, DDoS attempts, flood spamming, or tampering with site services—is strictly prohibited.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 mb-1 text-sm">4. Submission License</h3>
                  <p>
                    You retain ownership of the thoughts you express. By posting publicly on OpenConfess, you grant us a royalty-free, worldwide license to display, distribute, and format your text on the website.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 mb-1 text-sm">5. Removal Authority</h3>
                  <p>
                    Administrators retain the absolute right to delete any post, reaction, or comment at any time without prior notice if it endangers safety or violates community guidelines.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* 5. DISCLAIMER & MODERATION */}
          {activeTab === 'disclaimer' && (
            <section className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 font-display mb-2">
                  Disclaimer & Zero-Tolerance Moderation
                </h2>
                <p className="text-xs text-stone-400">Safeguarding Platform Integrity</p>
              </div>

              {/* Emergency Crisis Advisory */}
              <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <HeartPulse className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Emergency Crisis Notice</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  OpenConfess is a public narrative board; <strong>it is not a crisis helpline or mental health emergency service</strong>. If you or someone you know is in acute emotional distress, self-harm crisis, or physical danger, please immediately contact verified medical professionals, your local emergency helpline, or a certified crisis hotline.
                </p>
              </div>

              {/* UGC Disclaimer */}
              <div className="space-y-1">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-stone-600" />
                  User-Generated Content Disclaimer
                </h3>
                <p className="text-xs sm:text-sm text-stone-600">
                  All submissions and comments belong entirely to their respective anonymous authors. They do not represent the opinions, advice, or endorsements of OpenConfess. We accept no liability for statements made by third-party contributors.
                </p>
              </div>

              {/* Zero-Tolerance Policies */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <Ban className="w-4 h-4" />
                  <span>Strict Zero-Tolerance Standards</span>
                </div>
                <p className="text-xs text-stone-500">
                  Any confession or comment containing the following violations will be deleted immediately upon discovery:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                    <strong className="text-rose-600 text-xs sm:text-sm block mb-1">No Hate Speech & Slurs</strong>
                    <p className="text-xs text-stone-600">
                      Attacks, discrimination, or slurs based on religion, race, gender, ethnicity, disability, or orientation.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                    <strong className="text-rose-600 text-xs sm:text-sm block mb-1">No Doxxing & Names</strong>
                    <p className="text-xs text-stone-600">
                      Disclosing real names, residential addresses, phone numbers, social handles, or workplaces of any person.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                    <strong className="text-rose-600 text-xs sm:text-sm block mb-1">No Trolling & Harassment</strong>
                    <p className="text-xs text-stone-600">
                      Hostile mockery, gaslighting, targeted insults, or persistent bullying directed at authors.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                    <strong className="text-rose-600 text-xs sm:text-sm block mb-1">No Spam & Promotions</strong>
                    <p className="text-xs text-stone-600">
                      Affiliate links, commercial advertisements, automated solicitations, or fraudulent schemes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-stone-500 pt-2 border-t border-stone-100">
                To report any post violating these guidelines, email <span className="font-semibold text-stone-800">{contactEmail}</span>.
              </div>
            </section>
          )}

        </div>

        {/* Universal Legal Footer */}
        <footer className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-xs text-stone-400">
          <span>OpenConfess Platform</span>
          <span>contact@openconfess.com</span>
        </footer>

      </div>
    </main>
  );
}
