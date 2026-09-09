import { useState, useRef, ChangeEvent, useMemo } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { compressImageToUnder50KB } from '../lib/imageCompressor';
import { uploadImageToCloudinary } from '../lib/cloudinary';
import { createConfession } from '../lib/confessionService';
import { Confession } from '../types';
import { WORLD_LOCATIONS } from '../data/locations';

interface CreateConfessionModalProps {
  onClose: () => void;
  onCreated: (confession: Confession) => void;
}

const WORD_LIMIT = 2000;

export default function CreateConfessionModal({ onClose, onCreated }: CreateConfessionModalProps) {
  const [text, setText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [customCity, setCustomCity] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const overLimit = wordCount > WORD_LIMIT;

  // Selected country ki cities list
  const availableCities = useMemo(() => {
    if (!country) return [];
    const found = WORLD_LOCATIONS.find(
      (c) => c.country.toLowerCase() === country.toLowerCase()
    );
    return found ? found.cities : [];
  }, [country]);

  function handleCountryChange(e: ChangeEvent<HTMLSelectElement>) {
    const selected = e.target.value;
    setCountry(selected);
    setCity('');
    setCustomCity(false);
  }

  function handleCityChange(e: ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (val === '__custom__') {
      setCustomCity(true);
      setCity('');
    } else {
      setCustomCity(false);
      setCity(val);
    }
  }

  async function handleImageSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError(null);
    setCompressing(true);
    try {
      const compressed = await compressImageToUnder50KB(file);
      setImageFile(compressed);
      setImagePreview(URL.createObjectURL(compressed));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not process that image.');
    } finally {
      setCompressing(false);
    }
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit() {
    setError(null);
    if (!text.trim()) {
      setError("Your confession can't be empty.");
      return;
    }
    if (overLimit) {
      setError(`Please keep your confession under ${WORD_LIMIT} words.`);
      return;
    }
    if (!country.trim() || !city.trim()) {
      setError('Please select your country and city.');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }
      const confession = await createConfession({
        authorName: authorName.trim(),
        text: text.trim(),
        imageUrl,
        country: country.trim(),
        city: city.trim(),
      });
      onCreated(confession);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[92vh] sm:rounded-2xl rounded-t-2xl bg-white flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h2 className="font-display text-lg font-semibold text-gray-900">Share your confession</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's something you've never told anyone?"
              rows={7}
              className="w-full text-base leading-relaxed text-gray-900 rounded-xl border border-gray-200 p-3.5 outline-none focus:border-blush-300 resize-none"
            />
            <div className="flex justify-between text-xs mt-1.5">
              <span className={overLimit ? 'text-red-500 font-medium' : 'text-gray-400'}>
                {wordCount} / {WORD_LIMIT} words
              </span>
              <span className="text-gray-400">{charCount} characters</span>
            </div>
          </div>

          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Anonymous (leave blank to stay anonymous)"
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blush-300"
          />

          {/* Dynamic Global Location Selection */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Country Select */}
              <select
                value={country}
                onChange={handleCountryChange}
                className="text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blush-300 bg-white text-gray-800"
              >
                <option value="">Select Country</option>
                {WORLD_LOCATIONS.map((loc) => (
                  <option key={loc.code} value={loc.country}>
                    {loc.country}
                  </option>
                ))}
              </select>

              {/* City Select */}
              {!customCity ? (
                <select
                  value={city}
                  onChange={handleCityChange}
                  disabled={!country}
                  className="text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blush-300 bg-white text-gray-800 disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">
                    {country ? 'Select City / State' : 'Select Country First'}
                  </option>
                  {availableCities.map((item) => (
                    <option key={item.city} value={item.city}>
                      {item.city} {item.state ? `(${item.state})` : ''}
                    </option>
                  ))}
                  {country && <option value="__custom__">+ Other / Type City</option>}
                </select>
              ) : (
                <div className="relative">
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Type city name"
                    autoFocus
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blush-300 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCustomCity(false);
                      setCity('');
                    }}
                    className="absolute right-2.5 top-3 text-xs text-gray-400 hover:text-gray-600"
                    title="Back to list"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="" className="w-full h-40 object-cover rounded-xl" />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={compressing}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-xl py-4 hover:border-blush-300 hover:text-blush-600 transition-colors"
              >
                {compressing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Compressing image…
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    Add one photo (optional)
                  </>
                )}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="p-4 border-t border-gray-100 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={submitting || compressing || !text.trim() || overLimit}
            className="w-full py-3 rounded-full bg-gradient-to-r from-blush-500 to-plum-500 text-white font-semibold text-sm disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Posting…
              </>
            ) : (
              'Post anonymously'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
