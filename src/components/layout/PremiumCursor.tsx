import { useMemo, type CSSProperties } from 'react';
import AnimatedCursor from 'react-animated-cursor';

import { useTheme } from '@components/providers/ThemeProvider';

const CLICKABLE_TARGETS = [
  'a',
  'button',
  'label',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '.cursor-link',
];

type AnimatedCursorStyle = CSSProperties;

type Palette = {
  color: string;
  outerAlpha: number;
  innerStyle: AnimatedCursorStyle;
  outerStyle: AnimatedCursorStyle;
};

const LIGHT_PALETTE: Palette = {
  color: '32, 76, 164',
  outerAlpha: 0.32,
  innerStyle: {
    backgroundColor: 'rgba(18, 28, 48, 0.92)',
    border: '1px solid rgba(255, 255, 255, 0.72)',
    boxShadow: '0 10px 28px rgba(32, 76, 164, 0.32)',
  },
  outerStyle: {
    border: '2px solid rgba(32, 76, 164, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 22px 44px rgba(32, 76, 164, 0.18)',
    mixBlendMode: 'multiply',
  },
};

const DARK_PALETTE: Palette = {
  color: '132, 202, 255',
  outerAlpha: 0.24,
  innerStyle: {
    backgroundColor: 'rgba(12, 21, 36, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.28)',
    boxShadow: '0 12px 30px rgba(14, 128, 255, 0.28)',
  },
  outerStyle: {
    border: '2px solid rgba(132, 202, 255, 0.45)',
    backgroundColor: 'rgba(16, 48, 96, 0.26)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 26px 50px rgba(12, 98, 220, 0.32)',
    mixBlendMode: 'screen',
  },
};

export const PremiumCursor = () => {
  const { resolvedTheme } = useTheme();

  const palette = useMemo(() => (resolvedTheme === 'dark' ? DARK_PALETTE : LIGHT_PALETTE), [resolvedTheme]);

  return (
    <AnimatedCursor
      innerSize={10}
      outerSize={42}
      outerScale={2.6}
      innerScale={0.72}
      trailingSpeed={9}
      color={palette.color}
      outerAlpha={palette.outerAlpha}
      outerStyle={palette.outerStyle}
      innerStyle={palette.innerStyle}
      clickables={CLICKABLE_TARGETS}
    />
  );
};
