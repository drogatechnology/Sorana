import React, { useEffect, useState } from "react";
import logoImg from "@/assets/logo/Sorana-Logo.png";

const LOADING_TOTAL_MS = 3400;

export function LoadingScreen() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMinimumTimeMet, setIsMinimumTimeMet] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  // 1. Wait for minimum 2200ms (duration of circle draw and line extend)
  useEffect(() => {
    const minTimer = setTimeout(() => {
      setIsMinimumTimeMet(true);
    }, 2200);

    return () => clearTimeout(minTimer);
  }, []);

  // 2. Wait for all assets (images, fonts, etc.) to be fully loaded
  useEffect(() => {
    if (document.readyState === "complete") {
      setIsLoaded(true);
    } else {
      const handleLoad = () => setIsLoaded(true);
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // 3. Trigger the 1200ms exit animation once both conditions are met
  useEffect(() => {
    if (isLoaded && isMinimumTimeMet) {
      // Let other components (like HeroSection) know it's time to start
      sessionStorage.setItem('loadingScreenDone', 'true');
      window.dispatchEvent(new Event('loadingScreenExiting'));

      const exitTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 1200);

      return () => clearTimeout(exitTimer);
    }
  }, [isLoaded, isMinimumTimeMet]);

  if (!isAnimating) return null;

  // Add the class that triggers the CSS exit animation only when conditions are met
  const containerClass = `loading-screen fixed inset-0 z-[9999] overflow-hidden select-none bg-transparent pointer-events-auto ${
    isLoaded && isMinimumTimeMet ? "is-exiting" : ""
  }`;

  return (
    <>
      <style>{`body { overflow: hidden !important; }`}</style>
      <div className={containerClass}>
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
