"use client";

import React, { useState, useEffect } from 'react';

export default function CountdownTimer({
  targetDate,
  textMainClass = "text-[#700a0a]",
  textMutedClass = "text-[#7c7566]"
}: {
  targetDate: string,
  textMainClass?: string,
  textMutedClass?: string
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return timeLeft;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isMounted) return null;

  return (
    <div className="flex gap-2 min-[390px]:gap-2.5 min-[430px]:gap-3 justify-center items-baseline py-1">
      {Object.entries(timeLeft).map(([unit, value], index, array) => (
        <React.Fragment key={unit}>
          <div className="flex flex-col items-center min-w-[40px] min-[390px]:min-w-[44px] min-[430px]:min-w-[48px]">
            <div className={`text-2xl min-[390px]:text-[28px] min-[430px]:text-3xl font-sans font-normal min-[390px]:font-medium tabular-nums leading-none tracking-tight ${textMainClass}`}>
              {value.toString().padStart(2, '0')}
            </div>
            <div className={`text-[10px] min-[390px]:text-[10.5px] uppercase tracking-[0.12em] font-sans font-bold mt-1.5 ${textMutedClass}`}>
              {unit}
            </div>
          </div>
          {index < array.length - 1 && (
            <div className={`text-base min-[390px]:text-lg min-[430px]:text-xl font-sans font-normal opacity-60 -translate-y-0.5 ${textMainClass}`}>
              :
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
