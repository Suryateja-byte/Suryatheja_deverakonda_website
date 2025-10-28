import { useMemo, type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

import { cn } from '@lib/utils';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

export function Reveal({ children, className, delay = 0, y = 32, once = true }: RevealProps) {
  const reduceMotion = useReducedMotion();

  const variants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y },
      visible: { opacity: 1, y: 0 },
    }),
    [y],
  );

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? undefined : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once, amount: 0.35, margin: '0px 0px -10% 0px' }}
      variants={variants}
      transition={reduceMotion ? undefined : { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
