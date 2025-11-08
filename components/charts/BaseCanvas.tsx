"use client";
import React, { useEffect } from "react";

export default function BaseCanvas({ canvasRef, draw, attachInteractions }: any) {
  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const detach = attachInteractions();
    return () => detach && detach();
  }, [attachInteractions]);

  return (
    <canvas ref={canvasRef} className="w-full h-64 rounded-xl bg-neutral-950 border border-neutral-800" />
  );
}
