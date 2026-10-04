"use client";

import React, { useState, useEffect } from 'react';

const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

export default function RSVPForm({ weddingData }: { weddingData: any }) {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState('yes');

  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [redirectUrls, setRedirectUrls] = useState({ web: '', app: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    const groomName = weddingData?.couple?.groom?.name || "Groom";
    const brideName = weddingData?.couple?.bride?.name || "Bride";

    let message = "";
    if (attendance === "yes") {
      message = `Hi ${groomName} & ${brideName}! I'm delighted to confirm my presence for your ${weddingData?.eventType ? weddingData.eventType.toLowerCase() : 'wedding'} celebrations.\nWarm regards,\n${name}`;
    } else {
      message = `Hi ${groomName} & ${brideName}! Thank you so much for the invitation. Unfortunately, I won't be able to attend the ${weddingData?.eventType ? weddingData.eventType.toLowerCase() : 'wedding'}.\nWith best wishes,\n${name}`;
    }

    const phoneNumber = weddingData?.contact?.whatsapp || "";
    const encodedMessage = encodeURIComponent(message);
    const whatsappWebURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    const whatsappAppURL = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;

    setRedirectUrls({ web: whatsappWebURL, app: whatsappAppURL });
    setShowModal(true);
    setCountdown(5);
  };

  useEffect(() => {
    if (showModal) {
      let isRedirected = false;

      const triggerRedirect = (isManual = false) => {
        if (isRedirected) return;
        isRedirected = true;
        setShowModal(false);

        if (isManual) {
          window.open(redirectUrls.web, "_blank");
        } else {
          window.location.href = redirectUrls.app;
          setTimeout(() => {
            if (document.hasFocus()) {
              window.location.href = redirectUrls.web;
            }
          }, 500);
        }
      };

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            triggerRedirect(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Save it so we can clear if unmounted
      return () => clearInterval(interval);
    }
  }, [showModal, redirectUrls]);

  const handleManualRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(false);
    window.open(redirectUrls.web, "_blank");
  };

  // We are keeping the same visual style, but ensuring it uses the theme correctly or explicitly defined colors
  // Since RSVPForm does not have access to the theme config `t` directly inside Letter.tsx, we'll assume it uses the light theme colors as per the user's latest change.
  return (
    <>
      <div className="w-full max-w-xs md:max-w-sm mx-auto p-5 md:p-6 bg-[#fefefe]/50 border border-[#c4bcab]/50 rounded-xl backdrop-blur-md shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] md:text-xs font-sans font-bold tracking-[0.2em] uppercase mb-2 text-[#700a0a]">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white/50 border border-[#c4bcab]/50 rounded px-4 py-3 text-[#700a0a] placeholder-[#7c7566]/50 focus:outline-none focus:border-[#700a0a] transition-colors font-sans text-xs md:text-sm font-semibold uppercase tracking-widest"
              placeholder="YOUR FULL NAME"
            />
          </div>
          <div>
            <label className="block text-[10px] md:text-xs font-sans font-bold tracking-[0.2em] uppercase mb-2 text-[#700a0a]">Will you attend?</label>
            <div className="relative">
              <select
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                className="w-full bg-white/50 border border-[#c4bcab]/50 rounded px-4 py-3 text-[#700a0a] focus:outline-none focus:border-[#700a0a] transition-colors appearance-none font-sans text-[10px] md:text-xs font-semibold uppercase tracking-widest"
              >
                <option value="yes" className="bg-white text-[#700a0a]">Joyfully Accept</option>
                <option value="no" className="bg-white text-[#700a0a]">Regretfully Decline</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#700a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-[#700a0a] text-white hover:bg-[#7c7566] rounded py-3 md:py-4 uppercase tracking-[0.2em] font-bold text-[10px] md:text-xs transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <WhatsappIcon />
            <span>Send RSVP</span>
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
          <div className="bg-[#fefefe] border border-[#c4bcab] p-8 rounded-xl shadow-2xl max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
            <h3 className="font-sans font-bold text-xl uppercase tracking-[0.2em] text-[#700a0a] mb-4">Redirecting...</h3>
            <p className="font-sans text-xs uppercase tracking-widest font-semibold text-[#7c7566] mb-6 leading-relaxed">
              Opening WhatsApp in <span className="font-bold text-[#700a0a] text-sm">{countdown}</span> seconds.
            </p>
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 border-4 border-[#25D366]/20 border-t-[#25D366] rounded-full animate-spin"></div>
            </div>
            <button
              onClick={handleManualRedirect}
              className="px-6 py-3 bg-[#25D366] text-white rounded-full font-sans font-bold uppercase tracking-[0.15em] text-xs hover:bg-[#20b858] transition-colors w-full"
            >
              Open WhatsApp Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
