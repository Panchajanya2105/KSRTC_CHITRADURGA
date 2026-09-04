import React, { useState } from 'react';
import { Info, PhoneCall, HelpCircle, ShieldCheck, ChevronDown, Phone, MapPin, Building2, Printer, Mail, Send, ExternalLink, UserCircle } from 'lucide-react';
import { ALL_STATION_CONTACTS } from '../../utils/constants';
import { getCallablePhoneNumber } from '../../utils/phone';

interface AboutViewProps {
  t: (key: string) => string;
}

export const AboutView: React.FC<AboutViewProps> = ({ t }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const GOOGLE_FORM_URL = import.meta.env.VITE_GOOGLE_FORM_URL || 'https://forms.gle/8GxPQozwPpMkoH7Q8';

  const faqs = [
    {
      q: 'How do I know if a bus starts from Chitradurga or passes through?',
      a: 'Look for the colored badge on the bus card: 🟢 Green badge ("Starting Here") means the trip originates at this bus stand, while 🔵 Blue badge ("Passing Through") indicates an inter-city bus making a scheduled stop.'
    },
    {
      q: 'Where can I see live 15-minute departures for Challakere or Chitradurga?',
      a: 'Select your bus stand in the top menu, then check the "⚡ Buses Departing in Next 15 Minutes" live board on the Home Page. It automatically syncs with your current device time.'
    },
    {
      q: 'Where can I inquire about lost luggage or missed buses?',
      a: 'You can call the central Chitradurga Control Room at 08194-222431 or contact any station enquiry counter number listed below.'
    },
    {
      q: 'Are online ticket bookings available for Rajahamsa and Airavat services?',
      a: 'Yes, premium services (Rajahamsa, Airavat Club Class, NAC Sleeper) can be booked online via KSRTC portal ksrtc.in or mobile application.'
    },
    {
      q: 'What is the helpline for women passenger safety and grievances?',
      a: 'For passenger grievances or emergency safety assistance, call the 24x7 KSRTC Toll-Free Helpline at 080-26252625.'
    }
  ];


  return (
    <div className="space-y-6">

      {/* Title */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          <span>{t('about-title')}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
          Karnataka State Road Transport Corporation — Chitradurga Division passenger service directory & helplines.
        </p>
      </div>

      {/* COMPREHENSIVE BUS STAND PHONE NUMBERS DIRECTORY */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-rose-600" />
            <span>All Chitradurga Division Bus Station Contact Numbers</span>
          </h3>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900">
            5 Bus Stands Directory
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ALL_STATION_CONTACTS.map((station, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-bold mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{station.location}</span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {station.name}
                </h4>
                <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 mt-1">
                  {station.phone}
                </p>
              </div>

              <a
                href={`tel:${getCallablePhoneNumber(station.phone)}`}
                className="btn btn-sm w-full border border-rose-500 text-rose-500 bg-transparent hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all group"
              >
                <Phone className="w-3.5 h-3.5 text-rose-500 group-hover:text-white transition-colors" />
                <span>Call Station</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Helpline Safety Banner & FAQ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column: Division & Helpline Info */}
        <div className="space-y-6">
          {/* Division Details */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-sky-200/50 dark:border-sky-800/30">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-500" />
              <span>Chitradurga Division</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-500" />
                <span className="font-bold">Land line No:</span> 08194-222431
              </div>
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-sky-500" />
                <span className="font-bold">Fax No:</span> 08194-222500
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-500" />
                <span className="font-bold">e-mail:</span> dccdg@ksrtc.org &amp; aocdg@ksrtc.org
              </div>
            </div>
          </div>

          {/* Safety & Helpline Info */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Passenger Grievances & Toll-Free Assistance</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              For lost baggage, bus breakdown assistance, or passenger safety complaints, contact the KSRTC 24x7 Control Room or Toll-Free Help Desk.
            </p>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 space-y-2">
              <span className="text-xs font-extrabold text-emerald-500 dark:text-emerald-500 block">24x7 Customer Care Helpline</span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-mono font-black text-emerald-500 dark:text-emerald-500">080-26252625</span>
                <a
                  href="tel:080-26252625"
                  className="btn btn-sm border border-rose-500 text-rose-500 bg-transparent hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all group"
                >
                  <Phone className="w-3.5 h-3.5 text-rose-500 group-hover:text-white transition-colors" />
                  Toll Free Call
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-500" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-3.5 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-2"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Passenger Feedback ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Passenger Feedback</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Share your feedback or timetable suggestions with us.
              </p>
            </div>
          </div>
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-black transition-all shadow-md hover:shadow-lg"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Share Feedback</span>
          </a>
        </div>
      </div>

      {/* ── Developer Contact ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <UserCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Developer & Contact</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                SRUJAN PANCHAJANYA S S
              </p>
            </div>
          </div>
          <a
            href="mailto:SRUJANPANCHAJANYAS@GMAIL.COM"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-black transition-all shadow-md hover:shadow-lg"
          >
            <Mail className="w-4 h-4" />
            <span>Email Developer</span>
          </a>
        </div>
      </div>

    </div>
  );
};
