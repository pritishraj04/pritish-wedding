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

    const groomName = weddingData?.couple?.groom?.name || 'Pritish Raj';
    const brideName = weddingData?.couple?.bride?.name || 'Simran Singh';
    const groomFirstName = groomName.split(' ')[0];
    const brideFirstName = brideName.split(' ')[0];

    const groomMother = weddingData?.couple?.groom?.parents?.mother || 'Premlata';
    const groomFather = weddingData?.couple?.groom?.parents?.father || 'Pramod Kumar';
    const brideMother = weddingData?.couple?.bride?.parents?.mother || 'Ranju Singh';
    const brideFather = weddingData?.couple?.bride?.parents?.father || 'Brajesh Singh';

    const displayDateStr = weddingData?.wedding?.displayDate || "MAY 31st, 2026";
    const dateParts = displayDateStr.split(' ');
    const displayMonth = dateParts[0] || "MAY";
    const dayWithSuffix = dateParts[1]?.replace(',', '') || "31st";
    const displayDayMatch = dayWithSuffix.match(/\d+/);
    const displayDay = displayDayMatch ? displayDayMatch[0] : "31";
    const displaySuffix = dayWithSuffix.replace(/\d+/, '') || "ST";
    const displayYear = dateParts[2] || (weddingData?.wedding?.date ? new Date(weddingData.wedding.date).getFullYear().toString() : "2026");

    const mainEvent = weddingData?.celebrations?.find((c: any) => c.highlight) || weddingData?.celebrations?.[0];
    const mainEventPlace = mainEvent?.venueTitle || mainEvent?.venue || "VRINDAVAN GARDEN, FATUHA (PATNA)";

    const generateCalendarLink = (celebration: any) => {
        if (!celebration) return "#";
        const title = encodeURIComponent(`${groomFirstName} & ${brideFirstName}'s ${celebration.name || 'Wedding'}`);
        const details = encodeURIComponent(celebration.venueDetails || celebration.venueTitle || "We are so excited to celebrate with you!");
        const location = encodeURIComponent(celebration.venue || "");

        let dates = "";
        try {
            const dStr = celebration.date;
            const tStr = celebration.time;
            const months: Record<string, string> = { "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12" };

            const mMatch = dStr.match(/([a-zA-Z]+) (\d+), (\d+)/);
            const tMatch = tStr.match(/(\d+):(\d+)\s*(AM|PM)/i);

            if (mMatch && tMatch) {
                const month = months[mMatch[1].substring(0, 3)] || "12";
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
            } else if (mMatch) {
                const month = months[mMatch[1].substring(0, 3)] || "12";
                const day = mMatch[2].padStart(2, '0');
                const year = mMatch[3];
                const dateStrStart = `${year}${month}${day}T100000`;
                const dateStrEnd = `${year}${month}${day}T220000`;
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
                <div className={`w-[92vw] max-w-md min-h-[82vh] flex flex-col items-center justify-center p-4 min-[430px]:p-5 sm:p-6 rounded-md shadow-2xl relative ${t.cardBg} `}>
                    {/* Paper Texture overlay with reduced opacity for sharper text clarity */}
                    <div
                        className="absolute inset-0 opacity-35 pointer-events-none rounded-md"
                        style={{
                            backgroundImage: `url('/assets/images/paper-bg.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    {/* Corner ornaments */}
                    <CornerOrnament className={`absolute top-2.5 left-2.5 min-[430px]:top-3 min-[430px]:left-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament}`} />
                    <CornerOrnament className={`absolute top-2.5 right-2.5 min-[430px]:top-3 min-[430px]:right-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament} -scale-x-100`} />
                    <CornerOrnament className={`absolute bottom-2.5 left-2.5 min-[430px]:bottom-3 min-[430px]:left-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament} -scale-y-100`} />
                    <CornerOrnament className={`absolute bottom-2.5 right-2.5 min-[430px]:bottom-3 min-[430px]:right-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament} scale-[-1]`} />

                    {/* Double-line gold border */}
                    <div className={`absolute inset-3.5 min-[430px]:inset-4 sm:inset-5 border ${t.border} pointer-events-none`} />
                    <div className={`absolute inset-[18px] min-[430px]:inset-[22px] sm:inset-[26px] border ${t.border} opacity-50 pointer-events-none`} />

                    {/* Garland swaying keyframes */}
                    <style>{`
                        @keyframes garland-sway-left {
                            0%, 100% {
                                transform: rotate(1deg);
                            }
                            50% {
                                transform: rotate(3.8deg);
                            }
                        }
                        @keyframes garland-sway-right {
                            0%, 100% {
                                transform: scaleX(-1) rotate(1deg);
                            }
                            50% {
                                transform: scaleX(-1) rotate(3.8deg);
                            }
                        }
                    `}</style>

                    {/* Marigold garland — left edge */}
                    <div
                        className="absolute top-0 left-2 min-[390px]:left-2.5 min-[430px]:left-3.5 sm:left-4 w-[34px] min-[390px]:w-[40px] min-[430px]:w-[48px] sm:w-[54px] h-[65%] min-[390px]:h-[68%] min-[430px]:h-[72%] pointer-events-none z-20 overflow-visible origin-top"
                        style={{
                            animation: "garland-sway-left 4.6s ease-in-out infinite",
                            transformOrigin: "top center",
                        }}
                    >
                        <img
                            src="/assets/images/phool.png"
                            alt=""
                            className="w-full h-full object-contain object-top"
                        />
                    </div>
                    {/* Marigold garland — right edge (mirrored & tilted inward) */}
                    <div
                        className="absolute top-0 right-2 min-[390px]:right-2.5 min-[430px]:right-3.5 sm:right-4 w-[34px] min-[390px]:w-[40px] min-[430px]:w-[48px] sm:w-[54px] h-[65%] min-[390px]:h-[68%] min-[430px]:h-[72%] pointer-events-none z-20 overflow-visible origin-top"
                        style={{
                            animation: "garland-sway-right 5.2s ease-in-out infinite",
                            transformOrigin: "top center",
                        }}
                    >
                        <img
                            src="/assets/images/phool.png"
                            alt=""
                            className="w-full h-full object-contain object-top"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full py-2 min-[430px]:py-3 px-2">
                        {/* Group 1: Visual Announcement Header */}
                        <div className="flex flex-col items-center mb-1.5 min-[390px]:mb-2 min-[430px]:mb-2.5 pointer-events-none">
                            <div className="relative w-[105px] min-[390px]:w-[118px] min-[430px]:w-[135px] aspect-[547/475] z-0">
                                <Image
                                    src="/assets/images/couple2.png"
                                    alt="Couple"
                                    fill
                                    sizes="(max-width: 430px) 120px, 140px"
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <div className="relative w-[86px] min-[390px]:w-[96px] min-[430px]:w-[110px] aspect-[1546/1048] mt-3 min-[390px]:mt-3.5 min-[430px]:mt-4">
                                <Image
                                    src="/assets/images/sv.png"
                                    alt="Save the Date"
                                    fill
                                    sizes="(max-width: 430px) 100px, 115px"
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Group 2: Hero Invitation & Couple Names */}
                        <div className="flex flex-col items-center w-full mb-1.5 min-[390px]:mb-2 min-[430px]:mb-2.5 z-10">
                            <p className="font-serif italic text-xs min-[390px]:text-[13px] tracking-widest text-center text-[#75162D] font-normal mb-0.5">
                                for the wedding of
                            </p>
                            <span className="font-wonderling uppercase text-[18px] min-[390px]:text-[20px] min-[430px]:text-[22px] sm:text-2xl font-medium text-center text-[#2A0007] leading-tight w-full px-4">
                                {weddingData?.couple?.groom?.name ? `${weddingData.couple.groom.name.toUpperCase()}` : "PRITISH RAJ"}
                            </span>
                            <span className="font-hallbothy text-2xl min-[390px]:text-[28px] min-[430px]:text-3xl my-0.5 text-[#75162D] leading-none">
                                and
                            </span>
                            <span className="font-wonderling uppercase text-[18px] min-[390px]:text-[20px] min-[430px]:text-[22px] sm:text-2xl font-medium text-center text-[#2A0007] leading-tight w-full px-4">
                                {weddingData?.couple?.bride?.name ? `${weddingData.couple.bride.name.toUpperCase()}` : "SIMRAN SINGH"}
                            </span>
                        </div>

                        {/* Group 3: Event Specifics (Date, Venue & Sign-off) */}
                        <div className="flex flex-col items-center w-full mb-2 min-[390px]:mb-2.5 min-[430px]:mb-3">
                            {/* Date Row with hairline vertical dividers */}
                            <div className="flex items-center justify-center">
                                <span className="font-sans uppercase text-[11px] min-[390px]:text-xs tracking-[0.18em] font-medium text-[#75162D]">
                                    {displayMonth.toUpperCase()}
                                </span>
                                <span className="w-px h-3.5 bg-[#75162D]/35 mx-2.5 min-[390px]:mx-3" />
                                <span className="font-sans text-2xl min-[390px]:text-[26px] font-light text-[#2A0007] leading-none tracking-normal px-0.5">
                                    {displayDay}
                                </span>
                                <span className="w-px h-3.5 bg-[#75162D]/35 mx-2.5 min-[390px]:mx-3" />
                                <span className="font-sans uppercase text-[11px] min-[390px]:text-xs tracking-[0.18em] font-medium text-[#75162D]">
                                    {displayYear}
                                </span>
                            </div>

                            {/* Main Event Venue / Address — Refined regular weight */}
                            <p className="font-sans uppercase text-[9.5px] min-[390px]:text-[10px] min-[430px]:text-[10.5px] tracking-[0.16em] font-normal text-center text-[#5A2D35] mt-1.5 w-full px-4 leading-relaxed">
                                {mainEventPlace.toUpperCase()}
                            </p>
                        </div>

                        {/* Minimal Shining Swipe Instruction */}
                        <div className="flex flex-col items-center gap-1 mt-1 pointer-events-none w-max z-30">
                            <style>{`
                                @keyframes shine-text {
                                    0% { background-position: 200% center; }
                                    100% { background-position: -200% center; }
                                }
                                @keyframes swipe-up-gesture {
                                    0% { transform: translateY(4px); opacity: 0; }
                                    30% { opacity: 0.7; }
                                    70% { opacity: 0.7; }
                                    100% { transform: translateY(-4px); opacity: 0; }
                                }
                            `}</style>
                            <div className="animate-[swipe-up-gesture_2.5s_ease-in-out_infinite]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-5 h-5 text-[#75162D]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v11" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l-4-4-4 4" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 13.5v-1a1.5 1.5 0 0 0-3 0v.5m-3-2v-1a1.5 1.5 0 0 0-3 0v4.5M6.5 14.5v1.5A5.5 5.5 0 0 0 12 21.5h1A5.5 5.5 0 0 0 18.5 16v-2.5a1.5 1.5 0 0 0-1.5-1.5h-1.5" />
                                </svg>
                            </div>
                            <span
                                className="text-[8.5px] min-[390px]:text-[9px] uppercase font-medium tracking-[0.26em] bg-clip-text text-transparent"
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
                <div className={`w-[92vw] max-w-md min-h-[82vh] flex flex-col items-center justify-center p-4 min-[430px]:p-5 sm:p-6 rounded-md shadow-2xl relative ${t.cardBg} `}>
                    {/* Paper Texture overlay with reduced opacity for sharper text clarity */}
                    <div
                        className="absolute inset-0 opacity-35 pointer-events-none rounded-md"
                        style={{
                            backgroundImage: `url('/assets/images/paper-bg.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    {/* Corner ornaments */}
                    <CornerOrnament className={`absolute top-2.5 left-2.5 min-[430px]:top-3 min-[430px]:left-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament}`} />
                    <CornerOrnament className={`absolute top-2.5 right-2.5 min-[430px]:top-3 min-[430px]:right-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament} -scale-x-100`} />
                    <CornerOrnament className={`absolute bottom-2.5 left-2.5 min-[430px]:bottom-3 min-[430px]:left-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament} -scale-y-100`} />
                    <CornerOrnament className={`absolute bottom-2.5 right-2.5 min-[430px]:bottom-3 min-[430px]:right-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament} scale-[-1]`} />

                    {/* Double-line gold border */}
                    <div className={`absolute inset-3.5 min-[430px]:inset-4 sm:inset-5 border ${t.border} pointer-events-none`} />
                    <div className={`absolute inset-[18px] min-[430px]:inset-[22px] sm:inset-[26px] border ${t.border} opacity-50 pointer-events-none`} />

                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full py-2 min-[430px]:py-3 px-2">
                        {/* Header Badge */}
                        <div className="flex flex-col items-center mb-1 pointer-events-none">
                            <img src="/assets/images/logo-plain.svg" alt="Logo" className="w-[115px] min-[390px]:w-[130px] min-[430px]:w-[145px] object-contain opacity-95" />
                        </div>

                        {/* Card Title Lockup */}
                        <p className="font-serif italic text-xs min-[390px]:text-[13px] tracking-widest text-center text-[#75162D] font-normal mb-0.5">
                            program & itinerary
                        </p>
                        <h2 className="font-sans uppercase text-[15px] min-[390px]:text-base min-[430px]:text-[17px] font-medium tracking-[0.18em] text-center text-[#2A0007] leading-tight mb-1.5">
                            When & Where
                        </h2>

                        <GoldDivider width="w-12" />

                        {/* Apple-grade horizontal timeline schedule — space-optimized & scannable */}
                        <div className="flex flex-col w-full max-w-[315px] min-[390px]:max-w-[335px] mt-2 mb-1.5 divide-y divide-[#A68A48]/20">
                            {weddingData?.celebrations?.map((celeb: any, idx: number) => (
                                <div key={idx} className={`flex items-center gap-2.5 min-[390px]:gap-3 py-1.5 min-[390px]:py-2 ${celeb.highlight ? "bg-[#75162D]/[0.03] -mx-1.5 px-1.5 rounded-sm" : ""}`}>
                                    {/* Left: Date Lockup (Apple Calendar Anchor) */}
                                    <div className="flex flex-col items-center justify-center shrink-0 w-11 min-[390px]:w-12 text-center">
                                        <span className="font-sans text-[9px] min-[390px]:text-[9.5px] uppercase tracking-wider font-medium text-[#75162D] leading-none">
                                            {celeb.monthShort || "DEC"}
                                        </span>
                                        <span className="font-sans text-lg min-[390px]:text-xl font-light text-[#2A0007] leading-none my-0.5 tracking-tight">
                                            {celeb.dateNum || "11"}
                                        </span>
                                        <span className="font-sans text-[8px] min-[390px]:text-[8.5px] uppercase tracking-wider text-[#75162D]/75 font-normal leading-none">
                                            {celeb.dayShort || "FRI"}
                                        </span>
                                    </div>

                                    {/* Hairline vertical divider */}
                                    <div className="w-px h-7 bg-[#A68A48]/30 shrink-0" />

                                    {/* Right: Event Information */}
                                    <div className="flex flex-col text-left justify-center flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <h3 className={`font-sans text-[11.5px] min-[390px]:text-xs min-[430px]:text-[12.5px] font-medium tracking-normal leading-snug ${celeb.highlight ? "text-[#75162D]" : "text-[#2A0007]"}`}>
                                                {celeb.name}
                                            </h3>
                                            {celeb.highlight && (
                                                <span className="shrink-0 text-[7.5px] uppercase tracking-wider font-sans font-medium px-1.5 py-0.5 rounded-full bg-[#75162D] text-[#F2E5C6] leading-none">
                                                    Wedding
                                                </span>
                                            )}
                                        </div>
                                        <p className="font-sans text-[10px] min-[390px]:text-[10.5px] text-[#5A2D35] font-normal leading-tight mt-0.5 truncate">
                                            {celeb.venueTitle}
                                        </p>
                                        <p className="font-sans text-[9.5px] min-[390px]:text-[10px] text-[#75162D]/85 font-normal leading-tight mt-0.5">
                                            {celeb.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Consolidated Venue Directions Action Bar with refined pill buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 pt-2 border-t border-[#A68A48]/25 w-full max-w-[280px]">
                            <a
                                href="https://maps.google.com/?q=Vrindavan+Garden+Fatuha+Patna"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 rounded-full text-[10px] uppercase font-sans tracking-[0.14em] font-medium transition-all shadow-sm active:scale-95 flex items-center gap-1.5 bg-[#75162D] text-[#F2E5C6] hover:bg-[#3B010B]"
                            >
                                <MapPin className="w-3 h-3 text-[#F2D9A0]" />
                                Wedding Map
                            </a>
                            <a
                                href="https://maps.google.com/?q=COI+Club+Danapur+Cantt+Patna"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 rounded-full text-[10px] uppercase font-sans tracking-[0.14em] font-medium transition-all shadow-sm active:scale-95 flex items-center gap-1.5 bg-[#75162D] text-[#F2E5C6] hover:bg-[#3B010B]"
                            >
                                <MapPin className="w-3 h-3 text-[#F2D9A0]" />
                                Feast Map
                            </a>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'sec-2', content: (
                <div className={`w-[92vw] max-w-md min-h-[82vh] flex flex-col items-center justify-center p-4 min-[430px]:p-5 sm:p-6 rounded-md shadow-2xl relative ${t.cardBg} `}>
                    {/* Paper Texture overlay with reduced opacity for sharper text clarity */}
                    <div
                        className="absolute inset-0 opacity-35 pointer-events-none rounded-md"
                        style={{
                            backgroundImage: `url('/assets/images/paper-bg.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    {/* Corner ornaments */}
                    <CornerOrnament className={`absolute top-2.5 left-2.5 min-[430px]:top-3 min-[430px]:left-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament}`} />
                    <CornerOrnament className={`absolute top-2.5 right-2.5 min-[430px]:top-3 min-[430px]:right-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament} -scale-x-100`} />
                    <CornerOrnament className={`absolute bottom-2.5 left-2.5 min-[430px]:bottom-3 min-[430px]:left-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament} -scale-y-100`} />
                    <CornerOrnament className={`absolute bottom-2.5 right-2.5 min-[430px]:bottom-3 min-[430px]:right-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament} scale-[-1]`} />

                    {/* Double-line gold border */}
                    <div className={`absolute inset-3.5 min-[430px]:inset-4 sm:inset-5 border ${t.border} pointer-events-none`} />
                    <div className={`absolute inset-[18px] min-[430px]:inset-[22px] sm:inset-[26px] border ${t.border} opacity-50 pointer-events-none`} />

                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full py-2 min-[430px]:py-3 px-2">
                        {/* Header Badge */}
                        <div className="flex flex-col items-center mb-1 pointer-events-none">
                            <img src="/assets/images/logo-plain.svg" alt="Logo" className="w-[120px] min-[390px]:w-[135px] min-[430px]:w-[150px] object-contain opacity-95" />
                        </div>

                        <p className="font-serif italic text-xs min-[390px]:text-[13px] tracking-widest text-center text-[#75162D] font-normal mb-0.5">
                            traditions & blessings
                        </p>
                        <h2 className="font-sans uppercase text-[15px] min-[390px]:text-base min-[430px]:text-[17px] font-medium tracking-[0.18em] text-center text-[#2A0007] leading-tight mb-1.5">
                            The Celebration
                        </h2>

                        <GoldDivider width="w-12" />

                        {/* Celebration details - structured 2x2 grid & quote */}
                        <div className="w-full max-w-[295px] min-[390px]:max-w-[315px] flex flex-col items-center mt-2">
                            {/* Cordially Invited By — Parents & Couple */}
                            <div className="w-full flex flex-col items-center mb-2">
                                <span className="font-sans uppercase text-[9px] min-[430px]:text-[9.5px] tracking-[0.2em] font-medium text-[#75162D] mb-1.5">
                                    Cordially Invited By
                                </span>
                                <div className="grid grid-cols-2 gap-2 w-full text-center">
                                    {/* Groom's Parents */}
                                    <div className="flex flex-col items-center bg-[#75162D]/[0.025] border border-[#A68A48]/25 rounded-md py-2 px-1.5 shadow-xs">
                                        <span className="font-sans uppercase text-[8px] min-[390px]:text-[8.5px] tracking-[0.14em] text-[#75162D] font-medium block">
                                            Groom&apos;s Parents
                                        </span>
                                        <p className="font-serif italic text-[11px] min-[390px]:text-[11.5px] text-[#2A0007] font-medium mt-0.5 leading-snug">
                                            {groomMother} &amp; {groomFather}
                                        </p>
                                    </div>

                                    {/* Bride's Parents */}
                                    <div className="flex flex-col items-center bg-[#75162D]/[0.025] border border-[#A68A48]/25 rounded-md py-2 px-1.5 shadow-xs">
                                        <span className="font-sans uppercase text-[8px] min-[390px]:text-[8.5px] tracking-[0.14em] text-[#75162D] font-medium block">
                                            Bride&apos;s Parents
                                        </span>
                                        <p className="font-serif italic text-[11px] min-[390px]:text-[11.5px] text-[#2A0007] font-medium mt-0.5 leading-snug">
                                            {brideMother} &amp; {brideFather}
                                        </p>
                                    </div>
                                </div>

                                {/* Couple Inviting Line */}
                                <div className="mt-1.5 flex items-center justify-center gap-1 text-center">
                                    <span className="font-serif italic text-[10.5px] min-[390px]:text-[11px] text-[#5A2D35]">
                                        along with
                                    </span>
                                    <span className="font-sans uppercase text-[10px] min-[390px]:text-[10.5px] tracking-[0.14em] font-medium text-[#75162D]">
                                        {groomFirstName} &amp; {brideFirstName}
                                    </span>
                                </div>
                            </div>

                            <div className="w-20 min-[430px]:w-28 h-px bg-gradient-to-r from-transparent via-[#A68A48]/30 to-transparent mx-auto my-1.5" />

                            {/* Your Presence Section */}
                            <div className="w-full flex flex-col items-center mt-1">
                                <span className="font-sans uppercase text-[9.5px] min-[430px]:text-[10px] tracking-[0.2em] font-medium text-[#75162D] mb-1">
                                    Your Presence
                                </span>
                                <p className="font-serif italic text-[10.5px] min-[390px]:text-[11px] leading-relaxed text-[#5A2D35] text-center font-normal px-2 max-w-[280px]">
                                    &ldquo;{weddingData?.messages?.inviteText || "Please bless us with your gracious presence and heartfelt wishes as we begin this new life together."}&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'sec-3', content: (
                <div className={`w-[92vw] max-w-md min-h-[82vh] flex flex-col items-center justify-center p-4 min-[430px]:p-5 sm:p-6 rounded-md shadow-2xl relative ${t.cardBg} `}>
                    {/* Paper Texture overlay with reduced opacity for sharper text clarity */}
                    <div
                        className="absolute inset-0 opacity-35 pointer-events-none rounded-md"
                        style={{
                            backgroundImage: `url('/assets/images/paper-bg.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    {/* Corner ornaments */}
                    <CornerOrnament className={`absolute top-2.5 left-2.5 min-[430px]:top-3 min-[430px]:left-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament}`} />
                    <CornerOrnament className={`absolute top-2.5 right-2.5 min-[430px]:top-3 min-[430px]:right-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament} -scale-x-100`} />
                    <CornerOrnament className={`absolute bottom-2.5 left-2.5 min-[430px]:bottom-3 min-[430px]:left-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament} -scale-y-100`} />
                    <CornerOrnament className={`absolute bottom-2.5 right-2.5 min-[430px]:bottom-3 min-[430px]:right-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament} scale-[-1]`} />

                    {/* Double-line gold border */}
                    <div className={`absolute inset-3.5 min-[430px]:inset-4 sm:inset-5 border ${t.border} pointer-events-none`} />
                    <div className={`absolute inset-[18px] min-[430px]:inset-[22px] sm:inset-[26px] border ${t.border} opacity-50 pointer-events-none`} />

                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full py-2 min-[430px]:py-3 px-2">
                        {/* Header Badge */}
                        <div className="flex flex-col items-center mb-1 pointer-events-none">
                            <img src="/assets/images/logo-plain.svg" alt="Logo" className="w-[120px] min-[390px]:w-[135px] min-[430px]:w-[150px] object-contain opacity-95" />
                        </div>

                        <p className="font-serif italic text-xs min-[390px]:text-[13px] tracking-widest text-center text-[#75162D] font-normal mb-0.5">
                            hospitality &amp; logistics
                        </p>
                        <h2 className="font-sans uppercase text-[15px] min-[390px]:text-base min-[430px]:text-[17px] font-medium tracking-[0.18em] text-center text-[#2A0007] leading-tight mb-1.5">
                            Reach Out
                        </h2>

                        <GoldDivider width="w-12" />

                        {/* Structured Travel & Contact Sections */}
                        <div className="w-full max-w-[295px] min-[390px]:max-w-[315px] flex flex-col items-center mt-2">
                            {/* Stay & Travel Micro-Cards */}
                            <div className="w-full flex flex-col gap-2">
                                {/* Barat Departure Card */}
                                <div className="w-full border border-[#A68A48]/30 bg-[#75162D]/[0.025] rounded-md p-2 min-[390px]:p-2.5 text-left transition-all hover:border-[#A68A48]/50">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-sans uppercase text-[9px] min-[390px]:text-[9.5px] tracking-[0.16em] font-medium text-[#75162D]">
                                            Barat Departure
                                        </span>
                                        <a
                                            href="https://maps.google.com/?q=Gyan+Apartment+Kankarbagh+Patna"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[#A68A48]/40 bg-[#F2E5C6] text-[#75162D] hover:bg-[#75162D] hover:text-[#F2E5C6] hover:border-[#75162D] text-[9px] uppercase font-sans tracking-[0.12em] font-medium transition-all shadow-xs active:scale-95 group shrink-0"
                                            title="Open Barat Departure location in Google Maps"
                                        >
                                            <MapPin className="w-2.5 h-2.5 text-[#75162D] group-hover:text-[#F2D9A0] transition-colors" />
                                            <span>Map</span>
                                        </a>
                                    </div>
                                    <p className="font-sans text-[11.5px] min-[390px]:text-xs font-medium text-[#2A0007] mt-1">
                                        4:00 PM • Friday, Dec 11
                                    </p>
                                    <p className="font-sans text-[10px] min-[390px]:text-[10.5px] text-[#5A2D35] font-normal leading-tight mt-0.5">
                                        Departs from residence &ldquo;Gyan Apartment&rdquo;, Kankarbagh via private vehicles for Fatuha.
                                    </p>
                                </div>

                                {/* Janwasa Stay Card */}
                                <div className="w-full border border-[#A68A48]/30 bg-[#75162D]/[0.025] rounded-md p-2 min-[390px]:p-2.5 text-left transition-all hover:border-[#A68A48]/50">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-sans uppercase text-[9px] min-[390px]:text-[9.5px] tracking-[0.16em] font-medium text-[#75162D]">
                                            Janwasa (Groom&apos;s Side Stay)
                                        </span>
                                        <a
                                            href="https://maps.google.com/?q=Honest+Restro+Supanchak+Fatuha+Patna"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[#A68A48]/40 bg-[#F2E5C6] text-[#75162D] hover:bg-[#75162D] hover:text-[#F2E5C6] hover:border-[#75162D] text-[9px] uppercase font-sans tracking-[0.12em] font-medium transition-all shadow-xs active:scale-95 group shrink-0"
                                            title="Open Janwasa location in Google Maps"
                                        >
                                            <MapPin className="w-2.5 h-2.5 text-[#75162D] group-hover:text-[#F2D9A0] transition-colors" />
                                            <span>Map</span>
                                        </a>
                                    </div>
                                    <p className="font-sans text-[11px] min-[390px]:text-[11.5px] font-medium text-[#2A0007] mt-1">
                                        HONEST RESTRO FOOD &amp; ROOM SERVICE
                                    </p>
                                    <p className="font-sans text-[10px] min-[390px]:text-[10.5px] text-[#5A2D35] font-normal leading-tight mt-0.5">
                                        Supanchak, Fatuha (Patna)
                                    </p>
                                </div>
                            </div>

                            {/* Contact & Inquiries */}
                            <div className="flex flex-col items-center mt-3 w-full">
                                <span className="font-sans uppercase text-[9px] min-[390px]:text-[9.5px] tracking-[0.18em] font-medium text-[#75162D] mb-1">
                                    For Hospitality &amp; Inquiries
                                </span>
                                <a
                                    href={`tel:${weddingData?.contact?.whatsapp || "919097785207"}`}
                                    className="px-4 py-1.5 rounded-full text-[11px] min-[390px]:text-xs font-sans uppercase tracking-[0.12em] font-medium transition-all shadow-sm flex items-center gap-2 bg-[#75162D] text-[#F2E5C6] hover:bg-[#3B010B] active:scale-95"
                                >
                                    <Phone className="w-3 h-3 text-[#F2D9A0]" />
                                    +91 {weddingData?.contact?.whatsapp || "9097785207"}
                                </a>
                            </div>

                            {/* WhatsApp Wishes Section */}
                            <div className="mt-2.5 flex flex-col items-center">
                                <a
                                    href={`https://wa.me/${weddingData?.contact?.whatsapp || "919097785207"}?text=${encodeURIComponent("Wishing you a very Happy Wedding celebration! 🥂")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-serif italic text-[11px] min-[390px]:text-xs text-[#75162D] font-normal border-b border-[#75162D]/40 pb-0.5 hover:text-[#2A0007] transition-colors inline-block"
                                >
                                    Send blessings via WhatsApp →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'sec-4', content: (
                <div className={`w-[92vw] max-w-md min-h-[82vh] flex flex-col items-center justify-center p-4 min-[430px]:p-5 sm:p-6 rounded-md shadow-2xl relative ${t.cardBg} `}>
                    {/* Paper Texture overlay with reduced opacity for sharper text clarity */}
                    <div
                        className="absolute inset-0 opacity-35 pointer-events-none rounded-md"
                        style={{
                            backgroundImage: `url('/assets/images/paper-bg.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    {/* Corner ornaments */}
                    <CornerOrnament className={`absolute top-2.5 left-2.5 min-[430px]:top-3 min-[430px]:left-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament}`} />
                    <CornerOrnament className={`absolute top-2.5 right-2.5 min-[430px]:top-3 min-[430px]:right-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament} -scale-x-100`} />
                    <CornerOrnament className={`absolute bottom-2.5 left-2.5 min-[430px]:bottom-3 min-[430px]:left-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament} -scale-y-100`} />
                    <CornerOrnament className={`absolute bottom-2.5 right-2.5 min-[430px]:bottom-3 min-[430px]:right-3 w-10 h-10 min-[430px]:w-11 min-[430px]:h-11 sm:w-12 sm:h-12 ${t.ornament} scale-[-1]`} />

                    {/* Double-line gold border */}
                    <div className={`absolute inset-3.5 min-[430px]:inset-4 sm:inset-5 border ${t.border} pointer-events-none`} />
                    <div className={`absolute inset-[18px] min-[430px]:inset-[22px] sm:inset-[26px] border ${t.border} opacity-50 pointer-events-none`} />

                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full py-2 min-[430px]:py-3 px-2">
                        {/* Header Badge */}
                        <div className="flex flex-col items-center mb-1 pointer-events-none">
                            <img src="/assets/images/logo-plain.svg" alt="Logo" className="w-[120px] min-[390px]:w-[135px] min-[430px]:w-[150px] object-contain opacity-95" />
                        </div>

                        <p className="font-serif italic text-xs min-[390px]:text-[13px] tracking-widest text-center text-[#75162D] font-normal mb-0.5">
                            the countdown
                        </p>
                        <h2 className="font-sans uppercase text-[15px] min-[390px]:text-base min-[430px]:text-[17px] font-medium tracking-[0.18em] text-center text-[#2A0007] leading-tight mb-1">
                            Forever Marked in Time
                        </h2>

                        <span className="font-sans uppercase text-[11px] min-[390px]:text-xs tracking-[0.18em] font-medium text-[#75162D] mb-1">
                            {weddingData?.wedding?.displayDate || "DECEMBER 11th, 2026"}
                        </span>

                        <GoldDivider width="w-12" />

                        <p className="font-serif italic text-[10.5px] min-[390px]:text-[11px] text-[#5A2D35] text-center max-w-[260px] mx-auto mt-1 mb-2 leading-relaxed font-normal">
                            Counting down the moments until we celebrate our auspicious union.
                        </p>

                        {/* Countdown frame - with delicate 1px border box, without background */}
                        <div className="w-full max-w-[270px] min-[390px]:max-w-[290px] border border-[#A68A48]/35 rounded-sm py-2 px-3 flex flex-col items-center justify-center mb-2">
                            <CountdownTimer
                                targetDate={weddingData?.wedding?.date || "2026-12-11T19:00:00"}
                                textMainClass="text-[#2A0007]"
                                textMutedClass="text-[#75162D]"
                            />
                        </div>

                        <p className="font-hallbothy text-2xl min-[390px]:text-[26px] min-[430px]:text-3xl text-[#75162D] mb-2 leading-none text-center">
                            See you there
                        </p>

                        {/* Integrated Reset Seal Button */}
                        <div className="flex flex-col items-center mt-5 min-[430px]:mt-6 z-30">
                            <button
                                onClick={onClose}
                                className="relative flex items-center justify-center w-18 h-18 min-[390px]:w-20 min-[390px]:h-20 rounded-full group cursor-pointer hover:scale-[1.04] active:scale-[0.96] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                            >
                                {/* Warm gold aura */}
                                <div className="absolute inset-x-[-8%] inset-y-[-8%] -z-10 bg-[#F2D9A0] rounded-full mix-blend-screen animate-royal-glow" />
                                <div className="absolute inset-[-12px] min-[430px]:inset-[-15px] -z-10 border border-[#F2D9A0]/50 rounded-full pointer-events-none" />

                                <img
                                    src="/assets/images/seal.png"
                                    alt="Close Envelope"
                                    className="w-full h-full object-contain pointer-events-none drop-shadow-md z-10 relative"
                                />

                                {/* Circular instruction text */}
                                <div className="absolute inset-[-10px] min-[430px]:inset-[-13px] z-0 pointer-events-none transition-opacity duration-1000 opacity-80 group-hover:opacity-100">
                                    <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow origin-center overflow-visible">
                                        <path
                                            id="closeCirclePath"
                                            d="M 100, 100 m -85, 0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0"
                                            fill="none"
                                        />
                                        <text className="fill-[#75162D] text-[11px] font-sans font-medium uppercase tracking-[0.2em] pointer-events-none">
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
                </div>
            )
        },
    ];
    return (
        <div
            className={`origin-bottom flex flex-col transition-all duration-1500 ease-[cubic-bezier(0.2,0.8,0.3,1)] ${className} ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
            style={{
                transform: `translateY(${isOpen ? "0%" : "100%"})`,
                width: "100vw",
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
