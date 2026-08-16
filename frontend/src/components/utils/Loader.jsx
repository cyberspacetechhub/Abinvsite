const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-50 dark:bg-darkBg">

      {/* Ambient glow blobs */}
      <div className="absolute w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl -bottom-20 -right-20 pointer-events-none" />

      <div className="relative flex items-center justify-center mb-10">
        {/* Outer slow orbit */}
        <div className="absolute w-32 h-32 rounded-full border border-primary-300/40 dark:border-primary-500/20"
          style={{ animation: 'spin 4s linear infinite' }} />

        {/* Middle orbit with dot */}
        <div className="absolute w-24 h-24 rounded-full"
          style={{ animation: 'spin 2.5s linear infinite' }}>
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.6)]" />
        </div>

        {/* Inner orbit with dot */}
        <div className="absolute w-16 h-16 rounded-full"
          style={{ animation: 'spin 1.5s linear infinite reverse' }}>
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent-purple shadow-[0_0_8px_2px_rgba(139,92,246,0.6)]" />
        </div>

        {/* Logo core */}
        <div className="relative w-14 h-14 rounded-2xl bg-white dark:bg-neutral-800 shadow-strong flex items-center justify-center overflow-hidden">
          <img src="/semlogo.png" alt="Stock Exchange Mining" className="w-9 h-9 object-contain" />
          {/* scan line */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ animation: 'scanline 2s ease-in-out infinite' }}>
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary-400/60 to-transparent" />
          </div>
        </div>
      </div>

      {/* Brand name */}
      <p className="font-display text-xl font-bold text-neutral-900 dark:text-white tracking-wide mb-1">
        Stock Exchange Mining
      </p>
      <p className="font-sans text-sm text-neutral-400 dark:text-neutral-500 mb-8">
        Initializing platform...
      </p>

      {/* Progress bar */}
      <div className="w-48 h-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-purple"
          style={{ animation: 'progress 2s ease-in-out infinite' }} />
      </div>

      <style>{`
        @keyframes scanline {
          0%   { transform: translateY(-100%); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(3500%); opacity: 0; }
        }
        @keyframes progress {
          0%   { width: 0%;   margin-left: 0%; }
          50%  { width: 60%;  margin-left: 20%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}

export default Loader
