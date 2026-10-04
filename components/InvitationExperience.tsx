"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Letter from "./Letter";

export default function InvitationExperience({ weddingData }: { weddingData?: any }) {
  const [stage, setStage] = useState<"sealed" | "zoomed" | "opened" | "closing_letter" | "closing_flap">("sealed");
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const ZOOM_SCALE = 1.05;

  const handleSealClick = (e?: React.SyntheticEvent) => {
    if (stage === "sealed") {
      setStage("zoomed");
      setTimeout(() => {
        setStage("opened");
      }, 1500);
    }
  };

  const handleClose = () => {
    if (stage === "opened") {
      setStage("closing_letter");
      setTimeout(() => {
        setStage("closing_flap");
        setTimeout(() => {
          setStage("sealed");
        }, 1500);
      }, 1500);
    }
  };

  const isZoomed = stage !== "sealed";
  const isFlapOpen = stage === "opened" || stage === "closing_letter";
  const areFoldsDown = stage === "opened" || stage === "closing_letter";
  const isLetterVisible = stage === "opened";
  const isSealHidden = stage === "opened" || stage === "closing_letter" || stage === "closing_flap";

  return (
    <>
      <div
        className="relative w-full h-dvh overflow-hidden select-none flex items-end justify-center"
        ref={containerRef}
      >
        {/* ═══════════════════════════════════════════════════════
            SILK VIDEO BACKGROUND — replaces the static bg image
            Loops continuously, muted for autoplay compliance
        ═══════════════════════════════════════════════════════ */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="/assets/video/bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{ filter: "brightness(0.75) saturate(1.15)" }}
        />

        {/* CINEMATIC VIGNETTE — radial darkening for depth and focus */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 25%, rgba(10,0,3,0.6) 100%)"
          }}
        />

        {/* ═══════════════════════════════════════════════════════
            SCENIC FULL SCREEN OVERLAY — zooms on open
        ═══════════════════════════════════════════════════════ */}
        <div
          className="absolute inset-0 pointer-events-none origin-bottom overflow-hidden transition-transform duration-1500 ease-[cubic-bezier(0.25,1,0.5,1)] z-[2]"
          style={{
            transform: `scale(${isZoomed ? ZOOM_SCALE : 1}) translateY(${isLetterVisible ? "2%" : "0%"})`
          }}
        >
          {/* THIN GOLD BORDER FRAME (visible on the video) */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute inset-[6px] md:inset-3 border border-[#C9A961]/20" />
            <div className="absolute inset-3 md:inset-4 border border-[#C9A961]/10" />
          </div>

          {/* HEADER TEXT ABOVE ENVELOPE */}
          <div className="absolute top-[21dvh] md:top-[33dvh] left-1/2 -translate-x-1/2 w-full flex flex-col items-center gap-4 text-center z-10 pointer-events-none">
            <div
              className="flex flex-col items-center gap-4 transition-opacity duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              {/* LOGO */}
              <div className="w-[80vw] md:w-[700px] h-32 md:h-48 relative">
                <Image
                  src="/assets/images/logo-27.webp"
                  alt="Logo"
                  fill
                  sizes="(max-width: 768px) 80vw, 700px"
                  className="object-contain"
                  priority
                />
              </div>
              {/* TEXT */}
              <div className="w-[74vw] md:w-[500px] h-32 md:h-48 relative">
                <Image
                  src="/assets/images/text.svg"
                  alt="Ganesh"
                  fill
                  sizes="(max-width: 768px) 74vw, 500px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* TOP ORNAMENT */}
          <div className="absolute top-0 left-0 w-full aspect-200/60 text-stone-300 pointer-events-none">
            <Image
              src="/assets/images/top-ornament.svg"
              alt="Top Ornament"
              fill
              sizes="100vw"
              className="object-contain object-top opacity-50"
              priority
            />
          </div>

          {/* BOTTOM ORNAMENT */}
          <div className="absolute bottom-0 left-0 w-full aspect-200/60 text-stone-300 rotate-180 pointer-events-none">
            <Image
              src="/assets/images/bottom-ornament.svg"
              alt="Bottom Ornament"
              fill
              sizes="100vw"
              className="object-contain object-top opacity-50"
            />
          </div>

          {/* SPINNING RING (ABOVE BORDER, HALF HIDDEN) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] md:w-[400px] aspect-square pointer-events-none z-10">
            <Image
              src="/assets/images/ring.webp"
              alt="Ring"
              fill
              className="object-contain animate-[spin_20s_linear_infinite]"
              priority
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            ENVELOPE / SCENE CONTAINER — all the envelope mechanics
        ═══════════════════════════════════════════════════════ */}
        <div
          className="relative z-10 w-full max-w-2xl px-4 pb-12 flex flex-col items-center justify-end origin-bottom transition-transform duration-1500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: `scale(${isZoomed ? ZOOM_SCALE : 1}) translateY(${isZoomed ? "15%" : "0%"})`
          }}
        >
          {/* The Envelope */}
          <div className="relative w-full aspect-4/3 max-h-[60vh] mx-auto mt-auto perspective-1000">

            {/* Inner Envelope BG */}
            <div
              className="absolute inset-x-0 bottom-0 top-[20%] bg-[#d1cbbd] drop-shadow-inner border border-black/10 rounded-b-md transition-all duration-1500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: `translateY(${areFoldsDown ? "50vh" : "0%"})`,
                opacity: areFoldsDown ? 0 : 1,
                transitionDelay: stage === "opened" ? '1500ms' : '0ms'
              }}
            />

            {/* THE LETTER CLIP WRAPPER */}
            <div
              className="absolute inset-x-0 top-[20%] bottom-0 z-10 pointer-events-none"
              style={{ clipPath: "polygon(-50% -500%, 150% -500%, 150% 100%, -50% 100%)" }}
            >
              <Letter
                isOpen={stage === "opened"}
                onClose={handleClose}
                weddingData={weddingData}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 transition-all duration-1500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              />
            </div>

            {/* LOWER ENVELOPE FOLDS (Front) -> Covers letter */}
            <div
              className="absolute inset-x-0 bottom-0 top-[20%] z-20 pointer-events-none transition-all duration-1500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: `translateY(${areFoldsDown ? "50vh" : "0%"})`,
                opacity: areFoldsDown ? 0 : 1,
                transitionDelay: stage === "opened" ? '1500ms' : '0ms'
              }}
            >
              <svg viewBox="0 0 800 500" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                <filter id="drop-shadow">
                  <feDropShadow dx="0" dy="-4" stdDeviation="6" floodColor="#000000" floodOpacity="0.15" />
                </filter>
                <filter id="inner-shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.1" />
                </filter>
                {/* Left Flap */}
                <path d="M 0 0 L 380 260 L 0 500 Z" fill="#e8dfcd" stroke="#d5ccba" strokeWidth="2" />
                {/* Right Flap */}
                <path d="M 800 0 L 420 260 L 800 500 Z" fill="#e8dfcd" stroke="#d5ccba" strokeWidth="2" />
                {/* Bottom Flap */}
                <path d="M 0 500 L 400 230 L 800 500 Z" fill="#f4ece1" stroke="#d5ccba" strokeWidth="1.5" filter="url(#drop-shadow)" />
              </svg>
            </div>

            {/* TOP FLAP Z-INDEX LAYER */}
            <div
              className="absolute inset-x-0 top-[20%] bottom-[20%] pointer-events-none"
              style={{
                zIndex: stage === "opened" ? 5 : 30,
              }}
            >
              {/* TOP FLAP Y-TRANSLATOR */}
              <div
                className="w-full h-full transition-all duration-1500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{
                  transform: `translateY(${areFoldsDown ? "50vh" : "0%"})`,
                  opacity: areFoldsDown ? 0 : 1,
                  transitionDelay: stage === "opened" ? '1500ms' : '0ms'
                }}
              >
                {/* TOP FLAP ROTATOR */}
                <div
                  className="w-full h-full origin-top transition-transform duration-1200 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  style={{
                    transform: `rotateX(${isFlapOpen ? 180 : 0}deg)`
                  }}
                >
                  <svg viewBox="0 0 800 400" className="w-full h-full drop-shadow-xl" preserveAspectRatio="none">
                    <path d="M 0 0 L 400 320 L 800 0 Z" fill="#f0e9dd" stroke="#d5ccba" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════
                SEAL AND CALL TO ACTION OVERLAY
            ═══════════════════════════════════════════════════ */}
            <div
              className={`absolute left-1/2 top-[60%] z-40 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${isSealHidden ? "opacity-0 scale-75 blur-sm pointer-events-none" : "opacity-100 scale-100 blur-none"
                }`}
            >
              <button
                onClick={handleSealClick}
                className={`relative flex items-center justify-center cursor-pointer w-35 h-35 md:w-40 md:h-40 rounded-full group outline-none focus-visible:ring-4 focus-visible:ring-[#C9A961]/20 ${isSealHidden ? 'pointer-events-none' : 'pointer-events-auto'}`}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {/* Royal Aura — warm gold glow */}
                {stage === "sealed" && (
                  <div className="absolute inset-x-[-15%] inset-y-[-15%] -z-10 bg-[#C9A961] rounded-full mix-blend-screen animate-royal-glow" />
                )}

                {/* Wax Seal Image Container */}
                <div className="w-full h-full relative z-10 overflow-hidden rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03] group-active:scale-[0.97] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                  <Image
                    src="/assets/images/seal.png"
                    alt="Wax Seal"
                    fill
                    sizes="(max-width: 768px) 120px, 144px"
                    className="object-contain drop-shadow-md pointer-events-none"
                    priority
                  />

                  {/* Glint Effect */}
                  <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-full">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent w-[50%] animate-glint" />
                  </div>
                </div>

                {/* Outer gold ring */}
                {stage === "sealed" && (
                  <div className="absolute inset-0 -z-5 rounded-full border border-[#C9A961]/25 pointer-events-none transition-all duration-1000 scale-100" />
                )}
              </button>

              {/* Circular Instruction Text */}
              <div
                className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${stage === "sealed" ? "opacity-100 delay-1000" : "opacity-0"
                  }`}
              >
                <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow origin-center overflow-visible">
                  <path
                    id="circlePath"
                    d="M 100, 100 m -85, 0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0"
                    fill="none"
                  />
                  <text className="fill-[#C9A961]/50 text-xs font-bold uppercase tracking-[0.2em] pointer-events-none">
                    <textPath href="#circlePath" startOffset="25%" textAnchor="middle">
                      • Tap here to open •
                    </textPath>
                    <textPath href="#circlePath" startOffset="75%" textAnchor="middle">
                      • Tap here to open •
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
