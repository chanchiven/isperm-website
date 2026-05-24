'use client';

import {useEffect, type ReactNode} from 'react';

interface FadeInObserverProps {
  children: ReactNode;
  selector?: string;
}

export function FadeInObserver({children, selector = '.fade-in-up'}: FadeInObserverProps) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {threshold: 0.1, rootMargin: '0px 0px -50px 0px'}
    );

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInViewport) {
        el.classList.add('visible');
      } else {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [selector]);

  return <>{children}</>;
}
