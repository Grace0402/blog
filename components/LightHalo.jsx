'use client';
export default function LightHalo() {
  return (
    <>
      <div className="fixed top-0 left-0 w-[40vw] h-[40vh] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)' }}
      />
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
      />
    </>
  );
}
