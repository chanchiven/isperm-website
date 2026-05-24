'use client';

import {ReactNode, useEffect, useState} from 'react';
import dynamic from 'next/dynamic';

const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  {ssr: false}
);

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  initial?: {opacity: number; y: number};
  whileInView?: {opacity: number; y: number};
  viewport?: {once: boolean; margin: string};
  transition?: {duration: number; delay?: number};
  whileHover?: {y: number; boxShadow: string};
}

export default function AnimatedSection({
  children,
  className,
  style,
  initial = {opacity: 0, y: 30},
  whileInView = {opacity: 1, y: 0},
  viewport = {once: true, margin: '-100px'},
  transition = {duration: 0.6},
  whileHover
}: AnimatedSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <MotionDiv
      className={className}
      style={style}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
      whileHover={whileHover}
    >
      {children}
    </MotionDiv>
  );
}
