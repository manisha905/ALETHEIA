import React, { useEffect, useRef, useState } from 'react';

const LedMarquee = ({ badgeText = "DASHBOARD", badgeStyle = "" }) => {
  const [isGridMode, setIsGridMode] = useState(true);
  const canvasRef = useRef(null);
  const modeRef = useRef(isGridMode);

  useEffect(() => {
    modeRef.current = isGridMode;
  }, [isGridMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');

    const handleResize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 45;
      offCanvas.width = canvas.width;
      offCanvas.height = canvas.height;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const text = "⚡ ALETHEIA · REVEAL THE CONCEALED · CASEMIND AI · DECISION-SUPPORT SYSTEM FOR MULTI-HYPOTHESIS INVESTIGATIVE INTELLIGENCE · JUSTICE DELAYED IS JUSTICE DENIED ⚡";
    let x = canvas.width;
    const speed = 1.0;
    let animationFrameId;

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#050A07';
      ctx.fillRect(0, 0, w, h);

      if (modeRef.current) {
        offCtx.fillStyle = '#000000';
        offCtx.fillRect(0, 0, w, h);
        offCtx.font = 'bold 24px "JetBrains Mono", "Fira Code", monospace';
        offCtx.textBaseline = 'middle';
        offCtx.fillStyle = '#FFFFFF';
        offCtx.fillText(text, x, 23);

        const imgData = offCtx.getImageData(0, 0, w, h).data;
        const step = 3;

        for (let px = 1.5; px < w; px += step) {
          for (let py = 1.5; py < h; py += step) {
            const index = (Math.floor(py) * w + Math.floor(px)) * 4;
            const brightness = imgData[index];

            ctx.beginPath();
            ctx.arc(px, py, 1.3, 0, Math.PI * 2);

            if (brightness > 40) {
              ctx.fillStyle = '#2AE06A';
              ctx.shadowColor = '#2AE06A';
              ctx.shadowBlur = 3;
              ctx.fill();
              ctx.shadowBlur = 0;
            } else {
              ctx.fillStyle = '#031003';
              ctx.fill();
            }
          }
        }
      } else {
        ctx.strokeStyle = 'rgba(42, 224, 106, 0.05)';
        ctx.lineWidth = 1;
        for (let px = 0; px < w; px += 20) {
          ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
        }

        ctx.font = '700 23px "JetBrains Mono", monospace';
        ctx.fillStyle = '#2AE06A';
        ctx.shadowColor = '#2AE06A';
        ctx.shadowBlur = 8;
        ctx.fillText(text, x, 31);
        ctx.shadowBlur = 0;
      }

      x -= speed;
      ctx.font = '700 23px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(text).width;
      if (x < -textWidth) {
        x = w;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="led-bar-container" id="led-container">
      <div className="led-bar-header">
        <div className={`led-status-badge ${badgeStyle}`}>
          <span className={`pulse-dot ${badgeStyle.includes('badge-magenta') ? 'pulse-magenta' : ''}`}></span>
          {badgeText}
        </div>
        <div className="led-controls">
          <button
            onClick={() => setIsGridMode(!isGridMode)}
            className="led-btn"
            style={{
              color: isGridMode ? '#2AE06A' : '#00F3FF',
              borderColor: isGridMode ? '#2AE06A' : '#00F3FF'
            }}
          >
            {isGridMode ? '[ GRID MODE ]' : '[ SMOOTH MODE ]'}
          </button>
        </div>
      </div>
      <div className="led-display-wrapper">
        <canvas ref={canvasRef} id="led-canvas" height="45" />
      </div>
    </div>
  );
};

export default LedMarquee;
