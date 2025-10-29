declare module 'react-animated-cursor' {
  import { CSSProperties, FC } from 'react';

  interface ClickableTarget {
    target: string;
    options?: Partial<Omit<AnimatedCursorProps, 'clickables'>>;
  }

  interface AnimatedCursorProps {
    className?: string;
    innerSize?: number;
    outerSize?: number;
    color?: string;
    outerAlpha?: number;
    innerScale?: number;
    outerScale?: number;
    outerStyle?: CSSProperties;
    innerStyle?: CSSProperties;
    trailingSpeed?: number;
    showSystemCursor?: boolean;
    hasBlendMode?: boolean;
    outerClassName?: string;
    innerClassName?: string;
    clickables?: Array<string | ClickableTarget>;
  }

  const AnimatedCursor: FC<AnimatedCursorProps>;

  export default AnimatedCursor;
}

