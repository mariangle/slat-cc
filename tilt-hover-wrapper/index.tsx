"use client";

import { cn } from "@/lib/utils/cn";
import * as React from "react";

export function TiltCardWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [tiltStyle, setTiltStyle] = React.useState({
    transform: "rotateX(0deg) rotateY(0deg)",
  });

  const requestRef = React.useRef<number | null>(null);
  const cardRef = React.useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!cardRef.current) return;

    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    requestRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const cardWidth = rect.width;
      const cardHeight = rect.height;

      const centerX = rect.left + cardWidth / 2;
      const centerY = rect.top + cardHeight / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (mouseY / cardHeight) * -30;
      const rotateY = (mouseX / cardWidth) * 30;

      setTiltStyle({
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      });
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "rotateX(0deg) rotateY(0deg)",
    });
  };

  React.useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
      }}
      className={cn("w-full", className)}
    >
      <div
        ref={cardRef}
        style={{
          ...tiltStyle,
          transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
        className="w-full"
      >
        {children}
      </div>
    </div>
  );
}
