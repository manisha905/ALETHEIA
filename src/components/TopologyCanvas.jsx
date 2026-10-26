import React, { useEffect, useRef } from 'react';

const TopologyCanvas = () => {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const edgesRef = useRef([]);
  const draggedNodeRef = useRef(null);
  const hoveredNodeRef = useRef(null);

  const initNodesAndEdges = (w, h) => {
    nodesRef.current = [
      { id: 1, label: "Vikram Sharma (Suspect A)", type: "suspect", x: w * 0.25, y: h * 0.35, radius: 20, color: "#FF4D4D" },
      { id: 2, label: "Ramesh Verma (Accomplice)", type: "suspect", x: w * 0.28, y: h * 0.75, radius: 17, color: "#FF4D4D" },
      { id: 3, label: "Priya Malhotra (Victim)", type: "victim", x: w * 0.72, y: h * 0.35, radius: 20, color: "#00F3FF" },
      { id: 4, label: "Cell Tower Sector 4", type: "tower", x: w * 0.50, y: h * 0.22, radius: 16, color: "#FFDF00" },
      { id: 5, label: "Phone Record #98765", type: "device", x: w * 0.48, y: h * 0.55, radius: 16, color: "#2AE06A" },
      { id: 6, label: "Statement Record #4", type: "evidence", x: w * 0.80, y: h * 0.70, radius: 15, color: "#2AE06A" },
      { id: 7, label: "Security Access Log", type: "evidence", x: w * 0.15, y: h * 0.55, radius: 15, color: "#2AE06A" }
    ];

    edgesRef.current = [
      { from: 1, to: 5, label: "OWNS", conflict: false },
      { from: 2, to: 5, label: "CALL_PING", conflict: false },
      { from: 5, to: 4, label: "TOWER_PING", conflict: false },
      { from: 1, to: 4, label: "ALIBI_CONTRADICTION", conflict: true },
      { from: 1, to: 3, label: "FINANCIAL_LINK", conflict: false },
      { from: 3, to: 6, label: "RECORDED_IN", conflict: false },
      { from: 7, to: 1, label: "EXITS_LOCATION", conflict: false }
    ];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      const parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 1000;
      canvas.width = parentW > 300 ? parentW : 1000;
      canvas.height = 420;
      initNodesAndEdges(canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      edgesRef.current.forEach(edge => {
        const source = nodesRef.current.find(n => n.id === edge.from);
        const target = nodesRef.current.find(n => n.id === edge.to);
        if (!source || !target) return;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (edge.conflict) {
          ctx.strokeStyle = "#FF4D4D";
          ctx.setLineDash([6, 6]);
          ctx.lineWidth = 2.5;
          ctx.shadowColor = "#FF4D4D";
          ctx.shadowBlur = 8;
        } else {
          ctx.strokeStyle = "rgba(42, 224, 106, 0.4)";
          ctx.setLineDash([]);
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;

        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        ctx.fillStyle = edge.conflict ? "#FF4D4D" : "rgba(42, 224, 106, 0.8)";
        ctx.font = "10px monospace";
        ctx.fillText(edge.label, midX - 25, midY - 4);
      });

      nodesRef.current.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = (hoveredNodeRef.current === node || draggedNodeRef.current === node) ? 20 : 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = (hoveredNodeRef.current === node) ? 2.5 : 1;
        ctx.stroke();

        ctx.fillStyle = "#E4FFE8";
        ctx.font = "11px monospace";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + node.radius + 15);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const onMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      draggedNodeRef.current = nodesRef.current.find(n => Math.hypot(n.x - mouseX, n.y - mouseY) <= n.radius);
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (draggedNodeRef.current) {
        draggedNodeRef.current.x = mouseX;
        draggedNodeRef.current.y = mouseY;
      } else {
        hoveredNodeRef.current = nodesRef.current.find(n => Math.hypot(n.x - mouseX, n.y - mouseY) <= n.radius);
        canvas.style.cursor = hoveredNodeRef.current ? "pointer" : "crosshair";
      }
    };

    const onMouseUp = () => {
      draggedNodeRef.current = null;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleResetGraph = () => {
    if (!canvasRef.current) return;
    initNodesAndEdges(canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="hero-graph-box" style={{ marginTop: '30px' }}>
      <div className="box-header">
        <div className="box-title">
          <span className="pulse-dot pulse-red"></span> SECURE CASE LINK TOPOLOGY CANVASES
        </div>
        <div className="box-badge">AUTHENTICATED GRAPH CANVAS</div>
      </div>
      <div className="box-canvas-wrapper">
        <canvas ref={canvasRef} id="hero-graph-canvas" width="1100" height="420" />
        <div className="graph-overlay-info">
          <span className="legend-item red-dot">🔴 Suspects</span>
          <span className="legend-item blue-dot">🔵 Victims / Witnesses</span>
          <span className="legend-item yellow-dot">🟡 Cell Towers / Locations</span>
          <span className="legend-item dashed-edge">⚡ Dashed: Conflicts</span>
        </div>
      </div>
      <div className="box-footer">
        <span>Interactive link analysis canvas active. Drag or click nodes to inspect linkages.</span>
        <button className="btn-sm btn-outline" onClick={handleResetGraph}>
          RESET GRAPH
        </button>
      </div>
    </div>
  );
};

export default TopologyCanvas;
