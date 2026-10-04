import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Calendar, ChevronDown, Phone, X } from "lucide-react";
import CountdownTimer from "./features/CountdownTimer";

/* ─── CORNER ORNAMENT ─── 
   Concentric arcs with terminal dots — used at each corner 
   of the card for a refined, engraved-stationery feel. */
const CornerOrnament = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" stroke="currentColor" strokeWidth="0.6">
        <path d="M 5 75 Q 5 5 75 5" />
        <path d="M 10 70 Q 10 10 70 10" />
        <path d="M 5 75 C 5 65 10 60 20 55 C 15 50 10 45 5 45" />
        <path d="M 75 5 C 65 5 60 10 55 20 C 50 15 45 10 45 5" />
        <circle cx="5" cy="75" r="2" fill="currentColor" />
        <circle cx="75" cy="5" r="2" fill="currentColor" />
    </svg>
);

/* ─── GOLD DIVIDER ─── 
   Gradient hairline that fades at both ends. */
const GoldDivider = ({ width = "w-20" }: { width?: string }) => (
    <div className={`${width} h-px bg-gradient-to-r from-transparent via-[#C9A961]/40 to-transparent mx-auto`} />
);


export default function Letter({ isOpen, onClose, className, weddingData }: { isOpen: boolean, onClose?: () => void, className?: string, weddingData?: any }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isUnfolded, setIsUnfolded] = useState(false);

    const totalSections = 5;

    /* ═══════════════════════════════════════════════════════════
       THEME PALETTE — Rich Paper + Deep Maroon
       Following Editorial Luxury vibe archetype:
       - Warm rich paper base (#F7F3EA)
       - Tarnished gold accents (#A68A48)
       - Deep maroon text for readability (#3D0A14)
    ═══════════════════════════════════════════════════════════ */
    const t = {
        cardBg: 'bg-[#FDFBF7]',
        cardBgHex: '#FDFBF7',
        textGold: 'text-[#8C6D23]',
        textCream: 'text-[#2A060C]',
        textMuted: 'text-[#2A060C]/75',
        textLight: 'text-[#2A060C]/85',
        border: 'border-[#8C6D23]/40',
        borderAccent: 'border-[#8C6D23]/60',
        btnSolid: 'bg-[#2A060C] text-[#FDFBF7] hover:bg-[#1A0307] active:scale-[0.97]',
        btnOutline: 'border-[#2A060C]/30 bg-transparent text-[#2A060C] hover:bg-[#2A060C]/10 active:scale-[0.97]',
        card: 'border-[#2A060C]/10 bg-[#2A060C]/5',
        ornament: 'text-[#8C6D23]/50',
    };

    const groomName = weddingData?.couple?.groom?.name || 'Subodh Verma';
    const brideName = weddingData?.couple?.bride?.name || 'Shweta Verma';
    const groomFirstName = groomName.split(' ')[0];
    const brideFirstName = brideName.split(' ')[0];

    const displayDateStr = weddingData?.wedding?.displayDate || "MAY 31st, 2026";
    const dateParts = displayDateStr.split(' ');
    const displayMonth = dateParts[0] || "MAY";
    const dayWithSuffix = dateParts[1]?.replace(',', '') || "31st";
    const displayDayMatch = dayWithSuffix.match(/\d+/);
    const displayDay = displayDayMatch ? displayDayMatch[0] : "31";
    const displaySuffix = dayWithSuffix.replace(/\d+/, '') || "ST";

    const generateCalendarLink = (celebration: any) => {
        if (!celebration) return "#";
        const title = encodeURIComponent(`${groomFirstName} & ${brideFirstName}'s Anniversary`);
        const details = encodeURIComponent("We are so excited to celebrate with you!");
        const location = encodeURIComponent(celebration.venue || "");

        let dates = "";
        try {
            const dStr = celebration.date;
            const tStr = celebration.time;
            const months: Record<string, string> = { "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12" };

            const mMatch = dStr.match(/([a-zA-Z]+) (\d+), (\d+)/);
            const tMatch = tStr.match(/(\d+):(\d+)\s*(AM|PM)/i);

            if (mMatch && tMatch) {
                const month = months[mMatch[1].substring(0, 3)] || "05";
                const day = mMatch[2].padStart(2, '0');
                const year = mMatch[3];

                let hour12 = parseInt(tMatch[1], 10);
                const min = tMatch[2];
                const ampm = tMatch[3].toUpperCase();

                if (ampm === "PM" && hour12 < 12) hour12 += 12;
                if (ampm === "AM" && hour12 === 12) hour12 = 0;

                const startHour = hour12.toString().padStart(2, '0');
                const endHour = ((hour12 + 4) % 24).toString().padStart(2, '0');

                const dateStrStart = `${year}${month}${day}T${startHour}${min}00`;
                const dateStrEnd = `${year}${month}${day}T${endHour}${min}00`;

                dates = `&dates=${dateStrStart}/${dateStrEnd}&ctz=Asia/Kolkata`;
            }
        } catch (e) { /* silent */ }

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}${dates}&details=${details}&location=${location}`;
    };

    useEffect(() => {
        if (isOpen) {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
            }
            const timer = setTimeout(() => setIsUnfolded(true), 1200);
            return () => clearTimeout(timer);
        } else {
            setIsUnfolded(false);
            setActiveIndex(0);
        }
    }, [isOpen]);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollTop, clientHeight } = scrollContainerRef.current;
        const newIndex = Math.round(scrollTop / clientHeight);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    const scrollToNext = () => {
        if (!scrollContainerRef.current) return;
        const nextIndex = activeIndex + 1;
        if (nextIndex < totalSections) {
            scrollContainerRef.current.scrollTo({
                top: nextIndex * scrollContainerRef.current.clientHeight,
                behavior: "smooth"
            });
        }
    };

    return (
        <div
            className={`origin-bottom flex flex-col transition-all duration-1500 ease-[cubic-bezier(0.2,0.8,0.3,1)] ${className} ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
            style={{
                transform: `translateY(${isOpen ? "0%" : "100%"})`,
                width: "100%",
                zIndex: isOpen ? 40 : 10,
                transitionDelay: isOpen ? '300ms' : '0ms'
            }}
        >
            {/* ═══════════════════════════════════════════════════════
                THE CARD — Double-Bezel architecture per high-end skill
                Outer shell: shadow + subtle border glow
                Inner core: deep maroon with grain texture
            ═══════════════════════════════════════════════════════ */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className={`w-full relative shadow-[0_20px_80px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(201,169,97,0.08)] rounded-sm overflow-x-hidden snap-y snap-mandatory scroll-smooth ${isOpen ? 'overflow-y-auto' : 'overflow-y-hidden'} ${t.cardBg}`}
                style={{ height: "90dvh" }}
            >
                {/* ─── STATIC BACKGROUND & FRAME ─── */}
                <div className={`sticky top-0 left-0 w-full h-[90dvh] z-0 pointer-events-none overflow-hidden ${t.cardBg}`}>
                    {/* Paper Texture overlay */}
                    <div
                        className="absolute inset-0 opacity-70 pointer-events-none"
                        style={{
                            backgroundImage: `url('/assets/images/paper-bg.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />

                    {/* Corner ornaments — each rotated/mirrored */}
                    <CornerOrnament className={`absolute top-3 left-3 w-16 h-16 md:w-20 md:h-20 ${t.ornament}`} />
                    <CornerOrnament className={`absolute top-3 right-3 w-16 h-16 md:w-20 md:h-20 ${t.ornament} -scale-x-100`} />
                    <CornerOrnament className={`absolute bottom-3 left-3 w-16 h-16 md:w-20 md:h-20 ${t.ornament} -scale-y-100`} />
                    <CornerOrnament className={`absolute bottom-3 right-3 w-16 h-16 md:w-20 md:h-20 ${t.ornament} scale-[-1]`} />

                    {/* Double-line gold border — concentric insets */}
                    <div className={`absolute inset-5 md:inset-6 border ${t.border} pointer-events-none`} />
                    <div className={`absolute inset-[26px] md:inset-[30px] border ${t.border} opacity-50 pointer-events-none`} />
                </div>

                {/* ─── FIXED CONTENT WRAPPER ─── */}
                <div className="sticky top-0 left-0 w-full h-[90dvh] z-10 flex flex-col items-center justify-center p-6 md:p-8 -mt-[90dvh]">

                    {/* ═════════════ SECTION 0: HERO / COUPLE INTRO ═════════════ */}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center px-8 transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] 
                        ${activeIndex === 0
                            ? (isUnfolded ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-8 pointer-events-none")
                            : "opacity-0 -translate-y-8 pointer-events-none"}`}
                    >
                        {/* Couple Image — arch frame with Double-Bezel effect */}
                        <div className="relative w-[60vw] max-w-[230px] mb-6">
                            {/* Outer shell */}
                            <div className={`relative aspect-[4/5] rounded-t-full p-[3px] bg-gradient-to-br from-[#C9A961]/30 via-[#C9A961]/10 to-[#C9A961]/30`}>
                                {/* Inner core */}
                                <div className="relative w-full h-full rounded-t-full overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
                                    <Image
                                        src="/assets/images/couple.jpg"
                                        alt="Couple"
                                        fill
                                        className="object-cover object-center"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-[#3D0A14]/15 mix-blend-multiply" />
                                </div>
                            </div>
                        </div>

                        {/* Names */}
                        <div className="flex flex-col items-center gap-0">
                            <p className={`font-sans text-[11px] md:text-[13px] uppercase tracking-[0.4em] ${t.textMuted} mb-2`}>
                                Together with their families
                            </p>
                            <h2 className={`font-script text-4xl md:text-5xl ${t.textCream} leading-none`}>
                                {groomFirstName}
                            </h2>
                            <span className={`font-script text-2xl ${t.textGold} opacity-50 my-0.5`}>&</span>
                            <h2 className={`font-script text-4xl md:text-5xl ${t.textCream} leading-none`}>
                                {brideFirstName}
                            </h2>
                        </div>

                        <GoldDivider width="w-16" />

                        {/* Date */}
                        <div className="mt-4 flex flex-col items-center">
                            <p className={`font-sans text-[11px] md:text-[13px] uppercase tracking-[0.3em] ${t.textMuted} mb-1`}>
                                {weddingData?.eventType || "Anniversary"}
                            </p>
                            <h3 className={`font-sans text-lg md:text-xl uppercase tracking-[0.25em] font-light ${t.textCream}`}>
                                {displayDay}<sup className="text-[9px] -ml-0.5">{displaySuffix.toUpperCase()}</sup>{" "}
                                <span>{displayMonth.toUpperCase()}</span>
                            </h3>
                        </div>
                    </div>

                    {/* ═════════════ SECTION 1: WHEN & WHERE ═════════════ */}
                    <div className={`absolute inset-0 pt-6 pb-24 flex flex-col items-center justify-center text-center px-8 md:px-10 transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] ${activeIndex === 1 ? "opacity-100 translate-y-0 pointer-events-auto delay-200" : "opacity-0 translate-y-8 pointer-events-none"}`}>

                        <img src="/assets/images/logo-plain.svg" alt="Logo" className="w-[35vw] md:w-[180px] mb-5 object-contain opacity-80 mix-blend-multiply" />

                        <GoldDivider width="w-24" />

                        <p className={`font-sans text-[11px] md:text-[13px] uppercase tracking-[0.35em] mt-5 mb-3 ${t.textGold}`}>
                            When & Where
                        </p>

                        <div className="flex flex-col gap-6 w-full max-w-sm">
                            {weddingData?.celebrations?.map((celeb: any, idx: number) => (
                                <div key={idx} className="flex flex-col items-center gap-1.5">
                                    <h4 className={`font-sans text-[10px] uppercase tracking-[0.3em] ${t.textGold}`}>{celeb.name}</h4>
                                    <div className="flex flex-col items-center">
                                        <span className={`font-sans uppercase text-sm md:text-base font-light tracking-[0.2em] ${t.textCream}`}>
                                            {celeb.date}
                                        </span>
                                        <span className={`font-sans text-[11px] md:text-[13px] tracking-wider mt-0.5 ${t.textMuted}`}>
                                            {celeb.time} • {celeb.venueTitle}
                                        </span>
                                    </div>
                                    <div className="flex gap-3 mt-1.5">
                                        <a
                                            href={generateCalendarLink(celeb)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`px-4 py-1.5 rounded-full text-[10px] md:text-[12px] uppercase tracking-[0.2em] font-semibold transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${t.btnSolid} hover:scale-105`}
                                        >
                                            <Calendar className="w-2.5 h-2.5" />
                                            Calendar
                                        </a>
                                        {celeb.googleMapsUrl && (
                                            <a
                                                href={celeb.googleMapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`px-4 py-1.5 rounded-full text-[10px] md:text-[12px] uppercase tracking-[0.2em] font-semibold transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${t.btnSolid} hover:scale-105`}
                                            >
                                                <MapPin className="w-2.5 h-2.5" />
                                                Map
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5">
                            <GoldDivider width="w-20" />
                        </div>
                    </div>

                    {/* ═════════════ SECTION 2: THE CELEBRATION ═════════════ */}
                    <div className={`absolute inset-0 pt-6 pb-24 flex flex-col items-center justify-center text-center px-8 md:px-10 transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] ${activeIndex === 2 ? "opacity-100 translate-y-0 pointer-events-auto delay-200" : "opacity-0 translate-y-8 pointer-events-none"}`}>

                        <img src="/assets/images/logo-plain.svg" alt="Logo" className="w-[35vw] md:w-[180px] mb-5 object-contain opacity-80 mix-blend-multiply" />

                        <p className={`font-sans text-[11px] md:text-[13px] uppercase tracking-[0.35em] mb-5 ${t.textGold}`}>
                            The Celebration
                        </p>

                        {/* Double-Bezel card for celebration details */}
                        <div className="relative p-[1px] w-full max-w-xs bg-gradient-to-br from-[#C9A961]/25 via-transparent to-[#C9A961]/25 shadow-lg">
                            <div className={`p-5 md:p-6 w-full ${t.cardBg} shadow-[inset_0_1px_1px_rgba(201,169,97,0.06)]`}>
                                <div className="mb-4">
                                    <h4 className={`text-xs md:text-sm font-sans uppercase tracking-[0.25em] mb-2 ${t.textGold}`}>
                                        Dress Code
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                        {weddingData?.celebrations?.map((celeb: any, idx: number) => (
                                            <div key={idx} className="flex flex-col items-center">
                                                <span className={`font-sans text-[10px] md:text-[12px] uppercase tracking-[0.2em] ${t.textMuted}`}>{celeb.name}</span>
                                                <p className={`font-sans text-xs md:text-sm font-light tracking-wider ${t.textCream}`}>
                                                    {celeb.dressCode || "Occasion Ready"}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <GoldDivider width="w-10" />

                                <div className="mt-4">
                                    <h4 className={`text-xs md:text-sm font-sans uppercase tracking-[0.25em] mb-1.5 ${t.textGold}`}>
                                        Your Presence
                                    </h4>
                                    <p className={`font-sans text-[12px] md:text-sm font-light leading-[1.8] ${t.textLight}`}>
                                        {weddingData?.messages?.inviteText || "Please bless us with your presence as we celebrate this beautiful milestone. We look forward to sharing our joy with you."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═════════════ SECTION 3: CONTACT ═════════════ */}
                    <div className={`absolute inset-0 pt-6 pb-24 flex flex-col items-center justify-center text-center px-8 transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] ${activeIndex === 3 ? "opacity-100 translate-y-0 pointer-events-auto delay-200" : "opacity-0 translate-y-8 pointer-events-none"}`}>

                        <img src="/assets/images/logo-plain.svg" alt="Logo" className="w-[35vw] md:w-[180px] mb-5 object-contain opacity-80 mix-blend-multiply" />

                        <p className={`font-sans text-[11px] md:text-[13px] uppercase tracking-[0.35em] mb-2 ${t.textGold}`}>
                            Reach Out
                        </p>
                        <p className={`font-sans text-[12px] md:text-sm font-light leading-[1.7] max-w-xs mb-6 ${t.textLight}`}>
                            For any queries or to confirm your presence, please feel free to connect with us.
                        </p>

                        {/* Double-Bezel contact card */}
                        <div className="relative p-[1px] w-full max-w-xs bg-gradient-to-br from-[#C9A961]/25 via-transparent to-[#C9A961]/25 shadow-lg">
                            <div className={`p-5 md:p-6 w-full ${t.cardBg} shadow-[inset_0_1px_1px_rgba(201,169,97,0.06)] flex flex-col items-center`}>
                                <h4 className={`text-xs md:text-sm font-sans uppercase tracking-[0.25em] mb-1 ${t.textMuted}`}>
                                    Contact Person
                                </h4>
                                <p className={`font-sans text-base md:text-lg tracking-[0.15em] font-light mb-3 ${t.textCream}`}>
                                    {weddingData?.couple?.groom?.name || "Subodh Verma"}
                                </p>

                                <GoldDivider width="w-10" />

                                <a
                                    href="tel:8709595001"
                                    className={`mt-4 px-5 py-2.5 rounded-full text-[11px] md:text-[13px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-md flex items-center gap-2 ${t.btnSolid} hover:scale-105`}
                                >
                                    <Phone className="w-3.5 h-3.5" />
                                    8709595001
                                </a>
                            </div>
                        </div>

                        <div className="mt-6">
                            <GoldDivider width="w-16" />
                        </div>

                        <div className="mt-5">
                            <p className={`font-sans text-[11px] md:text-[13px] tracking-[0.25em] uppercase ${t.textMuted}`}>
                                Share Your Warmest Wishes
                            </p>
                            <a
                                href={`https://wa.me/${weddingData?.contact?.whatsapp || "918709595001"}?text=${encodeURIComponent("Wishing you a very Happy Anniversary! 🥂")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-block mt-2 font-sans text-xs md:text-sm tracking-[0.2em] uppercase border-b border-current pb-0.5 ${t.textGold} hover:opacity-70 transition-opacity duration-300`}
                            >
                                Send a message →
                            </a>
                        </div>
                    </div>

                    {/* ═════════════ SECTION 4: COUNTDOWN & SIGN OFF ═════════════ */}
                    <div className={`absolute inset-0 pt-8 pb-20 flex flex-col items-center justify-center text-center px-8 transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] ${activeIndex === 4 ? "opacity-100 translate-y-0 pointer-events-auto delay-200" : "opacity-0 translate-y-8 pointer-events-none"}`}>

                        <img src="/assets/images/logo-plain.svg" alt="Logo" className="w-[35vw] md:w-[180px] mb-5 object-contain opacity-80 mix-blend-multiply" />

                        <p className={`font-sans text-[11px] md:text-[13px] uppercase tracking-[0.35em] mb-2 ${t.textGold}`}>
                            Forever Marked in Time
                        </p>
                        <p className={`font-sans text-[12px] md:text-sm font-light leading-[1.7] max-w-[260px] mb-6 ${t.textLight}`}>
                            Counting down the days until we celebrate this beautiful milestone together.
                        </p>

                        <div className={`font-sans uppercase text-base md:text-lg tracking-[0.25em] font-light mb-4 ${t.textCream}`}>
                            {weddingData?.wedding?.displayDate || "MAY 31ST, 2026"}
                        </div>

                        <GoldDivider width="w-16" />

                        {/* Double-Bezel countdown frame */}
                        <div className="relative mt-4 p-[1px] w-full max-w-xs bg-gradient-to-br from-[#C9A961]/35 via-[#C9A961]/10 to-[#C9A961]/35 shadow-lg">
                            <div className={`w-full h-full p-4 flex flex-col items-center justify-center ${t.cardBg} shadow-[inset_0_1px_1px_rgba(201,169,97,0.06)]`}>
                                <CountdownTimer
                                    targetDate={weddingData?.wedding?.date || "2026-05-31T19:00:00"}
                                    textMainClass={t.textCream}
                                    textMutedClass={t.textMuted}
                                />
                            </div>
                        </div>

                        <h3 className={`font-script text-2xl md:text-3xl mt-6 ${t.textCream}`}>
                            See you there
                        </h3>

                        {/* HALF SEAL FOR CLOSING — preserved from original */}
                        <div className="absolute bottom-[-30px] md:bottom-[-40px] left-1/2 -translate-x-1/2 z-50">
                            <button
                                onClick={onClose}
                                className="relative flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-full group cursor-pointer hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                            >
                                {/* Warm gold aura */}
                                <div className="absolute inset-x-[-5%] inset-y-[-5%] -z-10 bg-[#C9A961] rounded-full mix-blend-screen animate-royal-glow" />

                                <div className="absolute inset-[-30px] md:inset-[-40px] -z-10 border border-[#C9A961]/20 rounded-full pointer-events-none" />

                                <img
                                    src="/assets/images/seal.png"
                                    alt="Close Envelope"
                                    className="w-full h-full object-contain pointer-events-none drop-shadow-md z-10 relative"
                                />

                                {/* Circular instruction text */}
                                <div className="absolute inset-[-20px] md:inset-[-25px] z-0 pointer-events-none transition-opacity duration-1000 opacity-70 group-hover:opacity-100">
                                    <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow origin-center overflow-visible">
                                        <path
                                            id="closeCirclePath"
                                            d="M 100, 100 m -85, 0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0"
                                            fill="none"
                                        />
                                        <text className="fill-[#C9A961]/80 text-xs md:text-sm font-bold uppercase tracking-[0.2em] pointer-events-none">
                                            <textPath href="#closeCirclePath" startOffset="25%" textAnchor="middle">
                                                • Press here to reset •
                                            </textPath>
                                            <textPath href="#closeCirclePath" startOffset="75%" textAnchor="middle">
                                                • Press here to reset •
                                            </textPath>
                                        </text>
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* ─── NAVIGATION BUTTON ─── */}
                    {isOpen && (
                        <div className="absolute bottom-8 left-0 w-full z-50 flex justify-center pointer-events-none">
                            <div className={`transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col items-center ${activeIndex === totalSections - 1 || !isUnfolded ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'}`}>
                                <button
                                    onClick={scrollToNext}
                                    className="flex flex-row items-center justify-center gap-2 group backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] bg-[#F7F3EA]/90 border border-[#C9A961]/40 hover:bg-[#FDFBF7] cursor-pointer select-none mb-2"
                                    style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
                                >
                                    <ChevronDown className={`w-3.5 h-3.5 animate-bounce ${t.textGold} opacity-60 pointer-events-none`} strokeWidth={2.5} />
                                    <span className={`text-xs md:text-sm uppercase tracking-[0.2em] font-bold ${t.textGold} pointer-events-none whitespace-nowrap`}>
                                        {activeIndex === 0 ? "Tap to Read" : "Tap for More"}
                                    </span>
                                    <ChevronDown className={`w-3.5 h-3.5 animate-bounce ${t.textGold} opacity-60 pointer-events-none`} strokeWidth={2.5} />
                                </button>
                                <span className={`text-[7px] md:text-[9px] uppercase font-sans tracking-[0.2em] opacity-80 ${t.textMuted} pointer-events-none`}>
                                    Or swipe to explore
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* SCROLL TRACKS */}
                <div className="w-full -mt-[90dvh] pointer-events-none">
                    <div className="w-full h-[90dvh] snap-start snap-always" />
                    <div className="w-full h-[90dvh] snap-start snap-always" />
                    <div className="w-full h-[90dvh] snap-start snap-always" />
                    <div className="w-full h-[90dvh] snap-start snap-always" />
                    <div className="w-full h-[90dvh] snap-start snap-always" />
                </div>

            </div>
        </div>
    );
}