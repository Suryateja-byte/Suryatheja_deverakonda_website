import { motion, useReducedMotion } from 'framer-motion';

const blobConfigs = [
  {
    className: 'bg-sky-500/25 dark:bg-sky-400/15',
    style: { top: '-10%', left: '-12%' },
    size: 'h-[420px] w-[420px]',
    animate: { x: [0, 32, -24, 0], y: [0, 24, -18, 0] },
  },
  {
    className: 'bg-purple-500/20 dark:bg-purple-400/15',
    style: { bottom: '-14%', right: '-8%' },
    size: 'h-[520px] w-[520px]',
    animate: { x: [0, -36, 18, 0], y: [0, -18, 26, 0] },
  },
  {
    className: 'bg-emerald-400/15 dark:bg-emerald-300/10',
    style: { top: '24%', right: '8%' },
    size: 'h-[360px] w-[360px]',
    animate: { x: [0, 18, -12, 0], y: [0, 20, -14, 0] },
  },
];

export function AmbientBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_55%)]" />
      {blobConfigs.map((blob, index) => {
        const MotionDiv = motion.div;
        return (
          <MotionDiv
            key={`ambient-blob-${index}`}
            className={`absolute ${blob.size} ${blob.className} blur-[140px]`}
            style={blob.style}
            animate={reduceMotion ? undefined : blob.animate}
            transition={reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror', delay: index * 2 }}
          />
        );
      })}
      <div className="absolute inset-x-0 bottom-0 h-[8rem] bg-gradient-to-t from-background via-background/90 to-transparent" />
    </div>
  );
}

