import { FC, useEffect, useState } from "react";

const Clock: FC = () => {
  const [time, setTime] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
      setTimezone(
        now
          .toLocaleDateString(undefined, { timeZoneName: "long" })
          .split(",")[1]
          ?.trim() || ""
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="header-card flex-1 sm:flex-initial">
      <div className="text-right">
        <p className="text-2xl font-medium tracking-tight">{time}</p>
        <p className="text-xs text-[var(--secondary)] mt-1">{timezone}</p>
      </div>
    </div>
  );
};

export default Clock;
