import React, { useState, useRef } from 'react';
import { X, Clock, Bus as BusIcon, Send, MessageSquare, ThumbsUp, AlertTriangle, Share2 } from 'lucide-react';
import { Bus, StationInfo, CommentItem } from '../types/bus';
import html2canvas from 'html2canvas';

type FeedbackMode = null | 'experience' | 'complaint';

interface BusDetailModalProps {
  bus: Bus | null;
  currentStation: StationInfo;
  onClose: () => void;
  t: (key: string) => string;
}

export const BusDetailModal: React.FC<BusDetailModalProps> = ({
  bus,
  currentStation,
  onClose,
  t,
}) => {
  if (!bus) return null;

  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleShareRoute = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
    try {
      // Temporarily add a class for clean capture (hide scrollbars, expand if needed)
      cardRef.current.classList.add('sharing-mode');
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      cardRef.current.classList.remove('sharing-mode');
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsSharing(false);
          return;
        }
        
        const fileName = `ksrtc-${bus.from}-to-${bus.destination}.png`.replace(/\s+/g, '-').toLowerCase();
        const file = new File([blob], fileName, { type: 'image/png' });
        
        const shareData = {
          title: `KSRTC Bus: ${bus.from} to ${bus.destination}`,
          text: `Catch the ${bus.time} bus from ${bus.from} to ${bus.destination}. Service: ${bus.service || 'Express'}.`,
          url: window.location.href,
        };

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            ...shareData,
            files: [file]
          });
        } else {
          // Fallback if image sharing is not supported (e.g., Desktop browsers)
          // 1. Download the image directly
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // 2. Copy the URL to clipboard
          try {
            await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
            alert('Bus route image downloaded & details copied to clipboard!');
          } catch (clipErr) {
            alert('Bus route image downloaded!');
          }
        }
      }, 'image/png');
    } catch (e) {
      console.error('Failed to generate share image', e);
      alert('Failed to generate share image. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const storageKey = `ksrtc_feedback_${bus.time}_${bus.destination}`;

  const [feedbacks, setFeedbacks] = useState<CommentItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>(null);
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !feedbackMode) return;

    const item: CommentItem = {
      id: Date.now().toString(),
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: feedbackMode === 'complaint' ? 'Complaint' : 'Experience',
    };

    const updated = [item, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setInputText('');
    setFeedbackMode(null);
  };

  const viaStops = bus.via
    ? bus.via.split(/[,/]/).map(s => s.trim()).filter(Boolean)
    : [];

  const routeTimeline = [bus.from || currentStation.label, ...viaStops, bus.destination];

  // Mini bus info bar shown above the feedback form
  const BusMiniInfo = () => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mb-3">
      <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center shrink-0">
        <BusIcon className="w-4 h-4 text-white" />
      </div>
      <div className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">
        <span className="text-rose-600 dark:text-rose-400 font-black">{bus.time}</span>
        {' · '}
        {bus.from || currentStation.label.split(' ')[0]} → {bus.destination}
        {' · '}
        <span className="text-slate-500">{bus.service || 'Express'}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-rose-900 to-slate-900 text-white rounded-t-3xl relative">
          <div className="absolute top-5 right-5 flex items-center gap-2">
            <button
              onClick={handleShareRoute}
              disabled={isSharing}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
              title="Share Route Card"
              aria-label="Share Route Card"
            >
              {isSharing ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Share2 className="w-6 h-6" />}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <BusIcon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black">{bus.from || 'Station'} ➔ {bus.destination}</h2>
              <p className="text-sm text-rose-400 font-bold mt-0.5">
                {currentStation.label} Schedule Details
              </p>
            </div>
          </div>

          {/* Departure time only — no "On Time" badge */}
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl text-base font-extrabold w-fit mt-4">
            <Clock className="w-5 h-5 text-rose-400" />
            <span>Departure: {bus.time}</span>
          </div>
        </div>

        {/* Modal Body (Captured for sharing) */}
        <div ref={cardRef} className="p-6 sm:p-8 space-y-6 bg-white dark:bg-slate-900">

          {/* Service Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-extrabold text-slate-500 uppercase block mb-1">Service Type</span>
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{bus.service || 'Express'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-extrabold text-slate-500 uppercase block mb-1">Origin Station</span>
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{bus.from || 'Chitradurga'}</span>
            </div>
          </div>

          {/* Route Stop Timeline */}
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <BusIcon className="w-5 h-5 text-rose-600" />
              <span>Route Stop Sequence ({routeTimeline.length} Stops)</span>
            </h3>

            <div className="relative pl-7 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-1 before:bg-rose-500/40">
              {routeTimeline.map((stop, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === routeTimeline.length - 1;
                return (
                  <div key={idx} className="relative flex items-center justify-between text-sm sm:text-base">
                    <div className={`absolute -left-7 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                      isFirst
                        ? 'bg-rose-600 text-white ring-4 ring-rose-100 dark:ring-rose-950'
                        : isLast
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-300'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className={`font-bold ${isFirst || isLast ? 'text-slate-900 dark:text-white text-base sm:text-lg' : 'text-slate-600 dark:text-slate-300'}`}>
                      {stop}
                    </span>
                    {isFirst && <span className="px-2.5 py-0.5 text-xs font-black bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-lg">Starting</span>}
                    {isLast && <span className="px-2.5 py-0.5 text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-500 rounded-lg">Terminus</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Passenger Feedback Section ── */}
          <div className="pt-5 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-sky-500" />
              <span>Passenger Feedback</span>
            </h3>

            {/* Existing feedbacks */}
            {feedbacks.length > 0 && (
              <div className="space-y-2.5 mb-4 max-h-44 overflow-y-auto pr-1">
                {feedbacks.map((f) => (
                  <div
                    key={f.id}
                    className={`p-3.5 rounded-2xl border text-xs sm:text-sm ${
                      f.author === 'Complaint'
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
                        : 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-black flex items-center gap-1 ${
                        f.author === 'Complaint' ? 'text-rose-600 dark:text-rose-400' : 'text-sky-600 dark:text-sky-400'
                      }`}>
                        {f.author === 'Complaint'
                          ? <AlertTriangle className="w-3.5 h-3.5" />
                          : <ThumbsUp className="w-3.5 h-3.5" />}
                        {f.author}
                      </span>
                      <span className="text-xs text-slate-400">{f.timestamp}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-semibold">{f.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Mode selector buttons */}
            {feedbackMode === null ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setFeedbackMode('experience')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-sky-300 dark:border-sky-700 text-sky-600 dark:text-sky-400 font-black text-sm hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Share Experience
                </button>
                <button
                  onClick={() => setFeedbackMode('complaint')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 font-black text-sm hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  File a Complaint
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Mini bus info above the form */}
                <BusMiniInfo />

                <div className={`text-xs font-black px-3 py-1.5 rounded-lg w-fit flex items-center gap-1.5 ${
                  feedbackMode === 'complaint'
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    : 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                }`}>
                  {feedbackMode === 'complaint'
                    ? <><AlertTriangle className="w-3.5 h-3.5" /> Filing a Complaint</>
                    : <><ThumbsUp className="w-3.5 h-3.5" /> Sharing Experience</>}
                </div>

                <textarea
                  rows={3}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    feedbackMode === 'complaint'
                      ? 'Describe your complaint (delay, driver, condition, etc.)...'
                      : 'Share your travel experience on this bus...'
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setFeedbackMode(null); setInputText(''); }}
                    className="btn btn-outline btn-sm flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-sm flex-1 flex items-center justify-center gap-1.5 text-white font-extrabold ${
                      feedbackMode === 'complaint' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-sky-600 hover:bg-sky-700'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
