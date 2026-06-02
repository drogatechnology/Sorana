import React, { useEffect, useState } from "react";
import logoImg from "@/assets/logo/Sorana-Logo.png";

const LOADING_TOTAL_MS = 3400;

export function LoadingScreen() {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const endTimer = setTimeout(() => {
      setIsAnimating(false);
    }, LOADING_TOTAL_MS);

    return () => clearTimeout(endTimer);
  }, []);

  if (!isAnimating) return null;

  return (
    <>
      <style>{`body { overflow: hidden !important; }`}</style>
      <div className="loading-screen fixed inset-0 z-[9999] overflow-hidden select-none bg-transparent pointer-events-auto">
        {/* Left Panel */}
        <div className="loading-panel loading-panel--left">
          <div className="loading-edge-line-left" />
          <div className="loading-center-line-top" />

          <div className="absolute top-0 left-0 w-[200%] h-full pointer-events-none">
            <div className="loading-logo-circle">
              <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 90 90">
                <defs>
                  <linearGradient id="circleGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0A7C3F" />
                    <stop offset="100%" stopColor="#E87732" />
                  </linearGradient>
                </defs>
                <circle
                  cx="45" cy="45" r="44"
                  fill="none"
                  stroke="url(#circleGradLeft)"
                  strokeWidth="2"
                  className="loading-circle-draw"
                  strokeLinecap="round"
                />
              </svg>
              <div className="loading-logo-inner">
                <img
                  src={logoImg}
                  alt="Sorana Glass Logo"
                  className="loading-logo-img"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="loading-panel loading-panel--right">
          <div className="loading-edge-line-right" />
          <div className="loading-center-line-bottom" />

          <div className="absolute top-0 left-[-100%] w-[200%] h-full pointer-events-none">
            <div className="loading-logo-circle">
              <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 90 90">
                <defs>
                  <linearGradient id="circleGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0A7C3F" />
                    <stop offset="100%" stopColor="#E87732" />
                  </linearGradient>
                </defs>
                <circle
                  cx="45" cy="45" r="44"
                  fill="none"
                  stroke="url(#circleGradRight)"
                  strokeWidth="2"
                  className="loading-circle-draw"
                  strokeLinecap="round"
                />
              </svg>
              <div className="loading-logo-inner">
                <img
                  src={logoImg}
                  alt="Sorana Glass Logo"
                  className="loading-logo-img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
