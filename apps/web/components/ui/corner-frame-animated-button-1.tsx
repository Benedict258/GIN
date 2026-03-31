'use client';

import type { FC } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type CornerFrameAnimatedButtonProps = {
  buttonText?: string;
  color?: string;
} & HTMLMotionProps<'button'>;

const CornerFrameAnimatedButton: FC<CornerFrameAnimatedButtonProps> = ({
  buttonText = 'Hover Button',
  className,
  color = 'bg-[var(--primary)]',
  type = 'button',
  ...props
}) => {
  return (
    <motion.button
      type={type}
      className={cn(
        'relative cursor-pointer rounded-sm border border-transparent bg-transparent px-8 py-4 text-lg font-semibold tracking-wide text-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      whileHover="hover"
      whileTap="tap"
      variants={{
        tap: { scale: 0.98 }
      }}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-sm border border-transparent opacity-60"
        variants={{
          hover: {
            opacity: 0,
            transition: { duration: 0.2 }
          }
        }}
      />

      <motion.div
        className={cn('absolute inset-0 rounded-sm', color)}
        initial={{ opacity: 0 }}
        variants={{
          hover: {
            opacity: 1,
            transition: { duration: 0.3, ease: 'easeOut' }
          }
        }}
      />

      <motion.span
        className="relative z-10"
        style={{ color: 'var(--foreground)' }}
        variants={{
          hover: {
            color: 'var(--primary-foreground)',
            transition: { duration: 0.3 }
          }
        }}
      >
        {buttonText}
      </motion.span>
    </motion.button>
  );
};

export default CornerFrameAnimatedButton;
