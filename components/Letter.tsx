import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Calendar, ChevronDown, ChevronUp, Phone, X } from "lucide-react";
import CountdownTimer from "./features/CountdownTimer";
import { StickyScrollCards } from "@/components/ui/sticky-scroll-cards";

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
    <div className={`${width} h-px bg-gradient-to-r from-transparent via-[#F2D9A0] to-transparent mx-auto`} />
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
        cardBg: 'bg-[#F2E5C6]',
        cardBgHex: '#F2E5C6',
        textGold: 'text-[#75162D]',
        textCream: 'text-[#3B010B]',
        textMuted: 'text-[#3B010B]/75',
        textLight: 'text-[#3B010B]/85',
        border: 'border-[#F2D9A0]',
        borderAccent: 'border-[#F2D9A0]',
        btnSolid: 'bg-[#75162D] text-[#F2E5C6] hover:bg-[#3B010B] active:scale-[0.97]',
        btnOutline: 'border-[#F2D9A0] bg-transparent text-[#75162D] hover:bg-[#F2D9A0]/20 active:scale-[0.97]',
        card: 'border-[#F2D9A0]/50 bg-[#F2E5C6]/50',
        ornament: 'text-[#F2D9A0]',
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

    const scrollPrev = () => {
        if (!scrollContainerRef.current) return;
        const prevIndex = Math.max(0, activeIndex - 1);
        scrollContainerRef.current.scrollTo({
            top: prevIndex * scrollContainerRef.current.clientHeight,
            behavior: "smooth"
        });
    };

    const scrollNext = () => {
        if (!scrollContainerRef.current) return;
        const nextIndex = Math.min(cards.length - 1, activeIndex + 1);
        scrollContainerRef.current.scrollTo({
            top: nextIndex * scrollContainerRef.current.clientHeight,
            behavior: "smooth"
        });
    };




    const cards = [
        {
            id: 'sec-0', content: (
                <div className={`w-[92vw] max-w-md min-h-[82vh] flex flex-col items-center justify-center p-6 rounded-md shadow-2xl relative ${t.cardBg} `}>
                    {/* Paper Texture overlay */}
                    <div
                        className="absolute inset-0 opacity-70 pointer-events-none rounded-md"
                        style={{
                            backgroundImage: `url('/assets/images/paper-bg.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    {/* Corner ornaments */}
                    <CornerOrnament className={`absolute top-3 left-3 w-12 h-12 ${t.ornament}`} />
                    <CornerOrnament className={`absolute top-3 right-3 w-12 h-12 ${t.ornament} -scale-x-100`} />
                    <CornerOrnament className={`absolute bottom-3 left-3 w-12 h-12 ${t.ornament} -scale-y-100`} />
                    <CornerOrnament className={`absolute bottom-3 right-3 w-12 h-12 ${t.ornament} scale-[-1]`} />

                    {/* Double-line gold border */}
                    <div className={`absolute inset-5 border ${t.border} pointer-events-none`} />
                    <div className={`absolute inset-[26px] border ${t.border} opacity-50 pointer-events-none`} />

                    <div className="relative z-10 flex flex-col items-center w-full h-full pt-4 pb-4">
                        {/* Couple Image */}
                        <div className="relative w-[65vw] max-w-[250px] aspect-[4/5] mb-6 pointer-events-none z-0">
                            <Image
                                src="/assets/images/couple.png"
                                alt="Couple"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain object-bottom scale-[1.35] origin-bottom"
                                priority
                            />
                        </div>

                        {/* Names */}
                        <div className="relative w-full flex flex-col items-center justify-center mb-5 mt-2">
                            {/* Faint '&' */}
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-10 text-8xl font-script text-[#ede3e3] z-0 opacity-70">&amp;</span>

                            <p className={`font-sans uppercase text-[16px] md:text-xs font-semibold ${t.textCream} leading-[1.7] tracking-[.15em] z-10 text-center`}>
                                {weddingData?.couple?.groom?.name ? `MR. ${weddingData.couple.groom.name.toUpperCase()}` : "MR. SUBODH VERMA"}<br />
                                {weddingData?.couple?.bride?.name ? `MRS. ${weddingData.couple.bride.name.toUpperCase()}` : "MRS. SHWETA VERMA"}
                            </p>
                        </div>

                        <GoldDivider width="w-16" />

                        {/* Date */}
                        <h2 className={`font-sans uppercase text-3xl font-bold tracking-[0.2em] text-center ${t.textCream}`}>
                            {displayDay}<sup className="text-sm align-top -ml-0.5 tracking-[0.2em]">{displaySuffix.toUpperCase()}</sup> <span className="ml-2">{displayMonth.toUpperCase()}</span>
                        </h2>

                        {/* Minimal Shining Swipe Instruction */}
                        <div className="absolute bottom-[-120px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none">
                            <style>{`
                                @keyframes shine-text {
                                    0% { background-position: 200% center; }
                                    100% { background-position: -200% center; }
                                }
                                @keyframes swipe-up-gesture {
                                    0% { transform: translateY(8px); opacity: 0; }
                                    30% { opacity: 0.6; }
                                    70% { opacity: 0.6; }
                                    100% { transform: translateY(-8px); opacity: 0; }
                                }
                            `}</style>
                            <div className="animate-[swipe-up-gesture_2.5s_ease-in-out_infinite]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={`w-7 h-7 md:w-8 md:h-8 ${t.textGold}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v11" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l-4-4-4 4" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 13.5v-1a1.5 1.5 0 0 0-3 0v.5m-3-2v-1a1.5 1.5 0 0 0-3 0v4.5M6.5 14.5v1.5A5.5 5.5 0 0 0 12 21.5h1A5.5 5.5 0 0 0 18.5 16v-2.5a1.5 1.5 0 0 0-1.5-1.5h-1.5" />
                                </svg>
                            </div>
                            <span
                                className="text-[9px] md:text-[10px] uppercase font-bold tracking-[0.4em] bg-clip-text text-transparent"
                                style={{
                                    backgroundImage: 'linear-gradient(90deg, #75162D 0%, #75162D 40%, #F2D9A0 50%, #75162D 60%, #75162D 100%)',
                                    backgroundSize: '200% auto',
                                    animation: 'shine-text 3s linear infinite'
                                }}
                            >
                                Swipe to explore
                            </span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'sec-1', content: (
                <div className={`w-[92vw] max-w-md min-h-[82vh] flex flex-col items-center justify-center p-6 rounded-md shadow-2xl relative ${t.cardBg} `}>
                    {/* Paper Texture overlay */}
                    <div
                        className="absolute inset-0 opacity-70 pointer-events-none rounded-md"
                        style={{
                            backgroundImage: `url('/assets/images/paper-bg.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    {/* Corner ornaments */}
                    <CornerOrnament className={`absolute top-3 left-3 w-12 h-12 ${t.ornament}`} />
                    <CornerOrnament className={`absolute top-3 right-3 w-12 h-12 ${t.ornament} -scale-x-100`} />
                    <CornerOrnament className={`absolute bottom-3 left-3 w-12 h-12 ${t.ornament} -scale-y-100`} />
                    <CornerOrnament className={`absolute bottom-3 right-3 w-12 h-12 ${t.ornament} scale-[-1]`} />

                    {/* Double-line gold border */}
                    <div className={`absolute inset-5 border ${t.border} pointer-events-none`} />
                    <div className={`absolute inset-[26px] border ${t.border} opacity-50 pointer-events-none`} />

                    <div className="relative z-10 flex flex-col items-center w-full h-full pt-4 pb-4">
                        <img src="/assets/images/logo-plain.svg" alt="Logo" className="w-[35vw] md:w-[180px] mb-5 object-contain opacity-80 mix-blend-multiply" />

                        <GoldDivider width="w-24" />

                        <p className={`font-sans uppercase text-2xl md:text-3xl font-bold tracking-[0.2em] mb-2 text-center ${t.textGold}`}>When & Where</p>
                        <p className={`font-sans text-[10px] md:text-xs font-semibold leading-[1.7] max-w-xs mb-4 text-center ${t.textMuted}`}>
                            We cannot wait to share this beautiful evening with our closest friends and family.
                        </p>

                        <div className="flex flex-col gap-6 w-full max-w-sm">
                            {weddingData?.celebrations?.map((celeb: any, idx: number) => (
                                <div key={idx} className="flex flex-col items-center gap-1.5">
                                    <h4 className={`font-sans text-[10px] uppercase font-bold tracking-[0.3em] ${t.textGold}`}>{celeb.name}</h4>
                                    <div className="flex flex-col items-center">
                                        <span className={`font-sans uppercase text-sm md:text-base font-bold tracking-[0.2em] text-center ${t.textCream}`}>
                                            {celeb.date}
                                        </span>
                                        <span className={`font-sans text-[10px] md:text-xs font-semibold leading-[1.7] tracking-wider mt-0.5 text-center ${t.textMuted}`}>
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
                </div>
            )
        },
        {
            id: 'sec-2', content: (
                <div className={`w-[92vw] max-w-md min-h-[82vh] flex flex-col items-center justify-center p-6 rounded-md shadow-2xl relative ${t.cardBg} `}>
                    {/* Paper Texture overlay */}
                    <div
                        className="absolute inset-0 opacity-70 pointer-events-none rounded-md"
                        style={{
                            backgroundImage: `url('/assets/images/paper-bg.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    {/* Corner ornaments */}
                    <CornerOrnament className={`absolute top-3 left-3 w-12 h-12 ${t.ornament}`} />
                    <CornerOrnament className={`absolute top-3 right-3 w-12 h-12 ${t.ornament} -scale-x-100`} />
                    <CornerOrnament className={`absolute bottom-3 left-3 w-12 h-12 ${t.ornament} -scale-y-100`} />
                    <CornerOrnament className={`absolute bottom-3 right-3 w-12 h-12 ${t.ornament} scale-[-1]`} />

                    {/* Double-line gold border */}
                    <div className={`absolute inset-5 border ${t.border} pointer-events-none`} />
                    <div className={`absolute inset-[26px] border ${t.border} opacity-50 pointer-events-none`} />

                    <div className="relative z-10 flex flex-col items-center w-full h-full pt-4 pb-4">
                        <img src="/assets/images/logo-plain.svg" alt="Logo" className="w-[35vw] md:w-[180px] mb-5 object-contain opacity-80 mix-blend-multiply" />

                        <p className={`font-sans uppercase text-2xl md:text-3xl font-bold tracking-[0.2em] mb-4 text-center ${t.textGold}`}>
                            The Celebration
                        </p>

                        {/* Double-Bezel card for celebration details */}
                        <div className="relative p-[1px] w-full max-w-xs bg-[#F2D9A0] shadow-lg">
                            <div className={`p-5 md:p-6 w-full ${t.cardBg} shadow-[inset_0_1px_1px_rgba(242,217,160,0.3)]`}>
                                <div className="mb-4">
                                    <h4 className={`text-[10px] md:text-xs font-sans font-bold uppercase tracking-[0.2em] mb-2 ${t.textGold}`}>
                                        Dress Code
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                        {weddingData?.celebrations?.map((celeb: any, idx: number) => (
                                            <div key={idx} className="flex flex-col items-center">
                                                <span className={`font-sans text-[10px] md:text-xs font-semibold leading-[1.7] uppercase tracking-[0.2em] text-center ${t.textMuted}`}>{celeb.name}</span>
                                                <p className={`font-sans text-[10px] md:text-xs font-semibold leading-[1.7] text-center ${t.textCream}`}>
                                                    {celeb.dressCode || "Occasion Ready"}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <GoldDivider width="w-10" />

                                <div className="mt-4">
                                    <h4 className={`text-[10px] md:text-xs font-sans font-bold uppercase tracking-[0.2em] mb-1.5 text-center ${t.textGold}`}>
                                        Your Presence
                                    </h4>
                                    <p className={`font-sans text-[10px] md:text-xs font-semibold leading-[1.7] text-center ${t.textLight}`}>
                                        {weddingData?.messages?.inviteText || "Please bless us with your presence as we celebrate this beautiful milestone. We look forward to sharing our joy with you."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'sec-3', content: (
                <div className={`w-[92vw] max-w-md min-h-[82vh] flex flex-col items-center justify-center p-6 rounded-md shadow-2xl relative ${t.cardBg} `}>
                    {/* Paper Texture overlay */}
                    <div
                        className="absolute inset-0 opacity-70 pointer-events-none rounded-md"
                        style={{
                            backgroundImage: `url('/assets/images/paper-bg.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    {/* Corner ornaments */}
                    <CornerOrnament className={`absolute top-3 left-3 w-12 h-12 ${t.ornament}`} />
                    <CornerOrnament className={`absolute top-3 right-3 w-12 h-12 ${t.ornament} -scale-x-100`} />
                    <CornerOrnament className={`absolute bottom-3 left-3 w-12 h-12 ${t.ornament} -scale-y-100`} />
                    <CornerOrnament className={`absolute bottom-3 right-3 w-12 h-12 ${t.ornament} scale-[-1]`} />

                    {/* Double-line gold border */}
                    <div className={`absolute inset-5 border ${t.border} pointer-events-none`} />
                    <div className={`absolute inset-[26px] border ${t.border} opacity-50 pointer-events-none`} />

                    <div className="relative z-10 flex flex-col items-center w-full h-full pt-4 pb-4">
                        <img src="/assets/images/logo-plain.svg" alt="Logo" className="w-[35vw] md:w-[180px] mb-5 object-contain opacity-80 mix-blend-multiply" />

                        <h2 className={`font-sans uppercase text-3xl md:text-4xl font-bold tracking-[0.2em] mb-4 drop-shadow-sm text-center ${t.textGold}`}>Reach Out</h2>
                        <p className={`font-sans text-[10px] md:text-xs font-semibold leading-[1.7] max-w-xs mb-6 text-center ${t.textMuted}`}>
                            For any queries or to confirm your presence, please feel free to connect with us.
                        </p>

                        {/* Double-Bezel contact card */}
                        <div className="relative p-[1px] w-full max-w-xs bg-[#F2D9A0] shadow-lg">
                            <div className={`p-5 md:p-6 w-full ${t.cardBg} shadow-[inset_0_1px_1px_rgba(242,217,160,0.3)] flex flex-col items-center`}>
                                <h4 className={`text-[10px] md:text-xs font-sans font-bold uppercase tracking-[0.2em] mb-1 text-center ${t.textMuted}`}>
                                    Contact Person
                                </h4>
                                <p className={`font-sans text-base md:text-lg font-bold tracking-[0.1em] mb-3 text-center ${t.textCream}`}>
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
                            <p className={`font-sans text-[10px] md:text-[11px] font-semibold tracking-widest uppercase text-center ${t.textMuted}`}>
                                Share Your Warmest Wishes
                            </p>
                            <a
                                href={`https://wa.me/${weddingData?.contact?.whatsapp || "918709595001"}?text=${encodeURIComponent("Wishing you a very Happy Anniversary! 🥂")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-block mt-1.5 font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] border-b border-current pb-0.5 ${t.textGold} hover:opacity-70 transition-opacity duration-300`}
                            >
                                Send a message →
                            </a>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'sec-4', content: (
                <div className={`w-[92vw] max-w-md min-h-[82vh] flex flex-col items-center justify-center p-6 rounded-md shadow-2xl relative ${t.cardBg} `}>
                    {/* Paper Texture overlay */}
                    <div
                        className="absolute inset-0 opacity-70 pointer-events-none rounded-md"
                        style={{
                            backgroundImage: `url('/assets/images/paper-bg.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    {/* Corner ornaments */}
                    <CornerOrnament className={`absolute top-3 left-3 w-12 h-12 ${t.ornament}`} />
                    <CornerOrnament className={`absolute top-3 right-3 w-12 h-12 ${t.ornament} -scale-x-100`} />
                    <CornerOrnament className={`absolute bottom-3 left-3 w-12 h-12 ${t.ornament} -scale-y-100`} />
                    <CornerOrnament className={`absolute bottom-3 right-3 w-12 h-12 ${t.ornament} scale-[-1]`} />

                    {/* Double-line gold border */}
                    <div className={`absolute inset-5 border ${t.border} pointer-events-none`} />
                    <div className={`absolute inset-[26px] border ${t.border} opacity-50 pointer-events-none`} />

                    <div className="relative z-10 flex flex-col items-center w-full h-full pt-4 pb-4">
                        <img src="/assets/images/logo-plain.svg" alt="Logo" className="w-[35vw] md:w-[180px] mb-5 object-contain opacity-80 mix-blend-multiply" />

                        <h2 className={`font-sans uppercase text-md md:text-lg font-bold tracking-[0.2em] mb-3 drop-shadow-sm text-center ${t.textGold}`}>Forever Marked in Time</h2>
                        <p className={`font-sans text-[10px] md:text-xs font-semibold leading-[1.7] max-w-[280px] md:max-w-xs mb-6 text-center ${t.textMuted}`}>
                            Counting down the days until we celebrate this beautiful milestone together.
                        </p>

                        <div className={`font-sans uppercase text-xl md:text-2xl font-bold tracking-[0.2em] mb-4 text-center ${t.textCream}`}>
                            {weddingData?.wedding?.displayDate || "MAY 31ST, 2026"}
                        </div>

                        <GoldDivider width="w-16" />

                        {/* Double-Bezel countdown frame */}
                        <div className="relative mt-4 p-[1px] w-full max-w-xs bg-[#F2D9A0] shadow-lg">
                            <div className={`w-full h-full p-4 flex flex-col items-center justify-center ${t.cardBg} shadow-[inset_0_1px_1px_rgba(242,217,160,0.3)]`}>
                                <CountdownTimer
                                    targetDate={weddingData?.wedding?.date || "2026-05-31T19:00:00"}
                                    textMainClass={t.textCream}
                                    textMutedClass={t.textMuted}
                                />
                            </div>
                        </div>

                        <h3 className={`font-script text-2xl md:text-3xl mt-6 mb-16 text-center ${t.textCream}`}>
                            See you there
                        </h3>
                    </div>

                    {/* HALF SEAL FOR CLOSING — preserved from original */}
                    <div className="absolute bottom-[65px] left-1/2 -translate-x-1/2 z-50">
                        <button
                            onClick={onClose}
                            className="relative flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-full group cursor-pointer hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                        >
                            {/* Warm gold aura */}
                            <div className="absolute inset-x-[-5%] inset-y-[-5%] -z-10 bg-[#F2D9A0] rounded-full mix-blend-screen animate-royal-glow" />

                            <div className="absolute inset-[-30px] md:inset-[-40px] -z-10 border border-[#F2D9A0]/50 rounded-full pointer-events-none" />

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
                                    <text className="fill-[#75162D] text-xs md:text-sm font-bold uppercase tracking-[0.2em] pointer-events-none">
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
            )
        },
    ];
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
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className={`w-full relative overflow-x-hidden overflow-y-auto scroll-smooth snap-y snap-mandatory overscroll-y-none`}
                style={{ height: "100dvh" }}
            >
                <div className="relative z-10 w-full">
                    {/* Invisible snap points matching StickyScrollCards layout */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col pt-[2dvh] pb-[10dvh]">
                        {cards.map((_, i) => (
                            <div key={i} className="h-[100dvh] w-full shrink-0 snap-center snap-always" />
                        ))}
                    </div>
                    <StickyScrollCards cards={cards} scrollContainer={scrollContainerRef} hint="" />
                </div>
            </div>

        </div>
    );

}
