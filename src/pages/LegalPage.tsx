import { useEffect } from 'react';
import { X } from 'lucide-react';
import { LegalTopic } from '../components/Header';

interface LegalPageProps {
  topic: LegalTopic;
  onClose: () => void;
}

const CONTENT: Record<LegalTopic, { title: string; body: JSX.Element }> = {
  about: {
    title: 'About Us',
    body: (
      <>
        <p>
          Open Confess is a space for the things people carry quietly — the regrets, the
          unspoken feelings, the family stories that never made it into everyday conversation.
          There's no login, no profile, and no way to trace a post back to the person who wrote it.
        </p>
        <h3>Why we built this</h3>
        <p>
          Most social platforms ask you to perform a version of yourself. We wanted the opposite:
          a place where the only thing that matters is the honesty of what's written, not who wrote it.
        </p>
        <h3>What this is not</h3>
        <p>
          This isn't a dating platform, a place to name and shame real people, or a substitute for
          professional support. It's simply a shared, anonymous notebook for the world.
        </p>
      </>
    ),
  },
  contact: {
    title: 'Contact Us',
    body: (
      <>
        <p>
          We read every message that comes through, though we can't always reply individually given
          the volume of anonymous traffic on the platform.
        </p>
        <h3>General inquiries</h3>
        <p>Email us at hello@openconfess.com for feedback, press, or partnership questions.</p>
        <h3>Report a post</h3>
        <p>
          If you believe a confession violates our content guidelines — naming a real identifiable
          person in a harmful way, sharing illegal content, or inciting harm — email
          reports@openconfess.com with the post's share link and a short description.
        </p>
        <h3>Safety concerns</h3>
        <p>
          If a post suggests someone may be in danger, please contact local emergency services or a
          crisis line in your region first. Open Confess is not a monitored safety service.
        </p>
      </>
    ),
  },
  privacy: {
    title: 'Privacy Policy',
    body: (
      <>
        <p>
          Open Confess is designed around collecting as little as possible. There are no accounts,
          no passwords, and no persistent user profiles anywhere on the platform.
        </p>
        <h3>What we store</h3>
        <p>
          The text, optional photo, and optional location you choose to include in a confession are
          stored so the post can be displayed publicly. We do not attach your IP address, device ID,
          or any identifying metadata to a published confession.
        </p>
        <h3>Local storage</h3>
        <p>
          Your browser uses local storage to remember which reaction you've given a post and how many
          comments you've left on it, purely to enforce fair-use limits. This data stays on your
          device and is never transmitted to us as personally identifying information.
        </p>
        <h3>Images</h3>
        <p>
          Uploaded photos are compressed in your browser before upload and hosted via our media
          provider. Please don't upload photos that could identify you or anyone else if you wish to
          remain anonymous.
        </p>
        <h3>Changes to this policy</h3>
        <p>
          We may update this policy as the platform evolves. Continued use of Open Confess after
          changes means you accept the revised terms.
        </p>
      </>
    ),
  },
  terms: {
    title: 'Terms of Service',
    body: (
      <>
        <p>
          By using Open Confess, you agree to share content that is your own honest experience or
          reflection, and to treat other visitors' stories with the same care you'd want for your own.
        </p>
        <h3>Acceptable use</h3>
        <p>
          Don't post content that identifies real people without their consent in a harmful way,
          promotes violence or self-harm, contains illegal material, or is spam or advertising
          disguised as a confession.
        </p>
        <h3>Ownership</h3>
        <p>
          You retain rights to the words you write. By posting, you grant Open Confess a license to
          display that content publicly on the platform indefinitely, given there's no account to
          delete it from later.
        </p>
        <h3>No warranty</h3>
        <p>
          Open Confess is provided as-is. We don't guarantee uninterrupted availability, and we're
          not responsible for the accuracy of anything a visitor chooses to post.
        </p>
        <h3>Changes</h3>
        <p>
          We may modify these terms at any time. Continued use after changes constitutes acceptance
          of the updated terms.
        </p>
      </>
    ),
  },
  disclaimer: {
    title: 'Disclaimer & Moderation',
    body: (
      <>
        <p>
          Confessions on this platform are user-submitted and reflect the personal experiences and
          opinions of anonymous visitors. They are not verified, fact-checked, or endorsed by Open
          Confess.
        </p>
        <h3>Not professional advice</h3>
        <p>
          Nothing on this platform constitutes medical, legal, psychological, or financial advice.
          If you're struggling with something you've read or written about, please reach out to a
          licensed professional or a support line in your area.
        </p>
        <h3>Moderation approach</h3>
        <p>
          Because there are no accounts, moderation happens after publication rather than before. We
          rely on community reports to identify content that violates our guidelines, and we remove
          posts that clearly cross the line — threats, illegal content, or content that maliciously
          identifies a real person.
        </p>
        <h3>Your responsibility</h3>
        <p>
          Reading confessions from strangers means encountering difficult, sometimes upsetting
          material. Please take breaks from the feed if a topic feels heavy, and remember every post
          here is one person's account of their own experience, not a universal truth.
        </p>
      </>
    ),
  },
};

export default function LegalPage({ topic, onClose }: LegalPageProps) {
  const { title, body } = CONTENT[topic];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0 max-w-3xl w-full mx-auto">
        <h2 className="font-display text-xl font-semibold text-gray-900">{title}</h2>
        <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div
          className="max-w-3xl w-full mx-auto px-5 py-6 text-gray-900 text-base leading-7 space-y-4
          [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:pt-2
          [&_p]:text-gray-700"
        >
          {body}
        </div>
      </div>
    </div>
  );
}
