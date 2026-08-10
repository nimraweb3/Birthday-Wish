import { useEffect, useState } from "react";

interface ClockState {
  time: string;
  date: string;
}

const getClock = (): ClockState => {
  const now = new Date();

  return {
    time: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(now),

    date: new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(now),
  };
};

export const useClock = (): ClockState => {
  const [clock, setClock] = useState<ClockState>(getClock);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setClock(getClock());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return clock;
};