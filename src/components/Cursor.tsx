import { useEffect, useRef } from "react";

/** Glowing dual-dot cursor with a soft heart burst on click. Desktop only. */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    dot.style.display = "block";
    ring.style.display = "block";

    let mx = -100, my = -100, rx = -100, ry = -100;
    let raf = 0;
    let lastSpark = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const now = performance.now();
      if (now - lastSpark > 55) {
        lastSpark = now;
        const s = document.createElement("span");
        const size = 3 + Math.random() * 4;
        s.style.cssText = `position:fixed;left:${mx + (Math.random() - 0.5) * 14}px;top:${my + (Math.random() - 0.5) * 14}px;width:${size}px;height:${size}px;border-radius:50%;pointer-events:none;z-index:95;background:${Math.random() < 0.5 ? "rgba(255,190,107,.8)" : "rgba(229,127,154,.8)"};transition:all .7s ease-out;opacity:1;transform:translateY(0)`;
        document.body.appendChild(s);
        requestAnimationFrame(() => {
          s.style.opacity = "0";
          s.style.transform = "translateY(14px) scale(0.2)";
        });
        setTimeout(() => s.remove(), 750);
      }
    };

    const onDown = (e: MouseEvent) => {
      for (let i = 0; i < 7; i++) {
        const h = document.createElement("span");
        const ang = (i / 7) * Math.PI * 2 + Math.random() * 0.5;
        const dist = 22 + Math.random() * 30;
        const size = 7 + Math.random() * 6;
        const dx = Math.cos(ang) * dist;
        const dy = Math.sin(ang) * dist - 10;
        h.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="rgba(229,127,154,.9)"><path d="M12 21s-7.5-4.9-10-9.5C.5 8 2.5 4.5 6 4.5c2.2 0 3.7 1.2 6 3.6 2.3-2.4 3.8-3.6 6-3.6 3.5 0 5.5 3.5 4 7-2.5 4.6-10 9.5-10 9.5z"/></svg>`;
        h.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;pointer-events:none;z-index:96;transition:all .8s cubic-bezier(.2,.8,.3,1);opacity:1`;
        document.body.appendChild(h);
        requestAnimationFrame(() => {
          h.style.transform = `translate(${dx}px, ${dy}px) rotate(${(Math.random() - 0.5) * 120}deg) scale(0.4)`;
          h.style.opacity = "0";
        });
        setTimeout(() => h.remove(), 850);
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} style={{ display: "none" }} className="pointer-events-none fixed left-0 top-0 z-[97] h-9 w-9 rounded-full border border-rose-2-400/50 transition-[width,height] duration-300" />
      <div ref={dotRef} style={{ display: "none" }} className="pointer-events-none fixed left-0 top-0 z-[98] h-1.5 w-1.5 rounded-full bg-ember-300 shadow-[0_0_12px_2px_rgba(255,190,107,.8)]" />
    </>
  );
}
