# HERO/LANDING PAGE TEXT TYPE

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:

```tsx
myna - hero.tsx;
("use client");

import * as React from "react";
import {
  Activity,
  ArrowRight,
  BarChart,
  Bird,
  Menu,
  Plug,
  Sparkles,
  Zap,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "SOLUTIONS", href: "#" },
  { title: "INDUSTRIES", href: "#" },
  { title: "RESOURCES", href: "#" },
  { title: "ABOUT US", href: "#" },
];

const labels = [
  { icon: Sparkles, label: "Predictive Analytics" },
  { icon: Plug, label: "Machine Learning" },
  { icon: Activity, label: "Natural Language Processing" },
];

const features = [
  {
    icon: BarChart,
    label: "Advanced Analytics",
    description:
      "Gain deeper insights from your data with our cutting-edge predictive models.",
  },
  {
    icon: Zap,
    label: "Intelligent Automation",
    description:
      "Streamline your processes with AI-powered automation solutions.",
  },
  {
    icon: Activity,
    label: "Real-time Insights",
    description:
      "Make informed decisions faster with our real-time data processing capabilities.",
  },
];

export function MynaHero() {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const titleWords = [
    "THE",
    "AI",
    "REVOLUTION",
    "FOR",
    "BUSINESS",
    "INTELLIGENCE",
  ];

  return (
    <div className="container mx-auto px-4 min-h-screen bg-background">
      <header>
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Bird className="h-8 w-8" />
              <span className="font-mono text-xl font-bold">Myna UI</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="text-sm font-mono text-foreground hover:text-[#FF6B2C] transition-colors"
              >
                {item.title}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="default"
              className="rounded-none hidden md:inline-flex bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono"
            >
              GET STARTED <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-6 mt-6">
                  {navigationItems.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      className="text-sm font-mono text-foreground hover:text-[#FF6B2C] transition-colors"
                    >
                      {item.title}
                    </a>
                  ))}
                  <Button className="cursor-pointer rounded-none bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono">
                    GET STARTED <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        <section className="container py-24">
          <div className="flex flex-col items-center text-center">
            <motion.h1
              initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative font-mono text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto leading-tight"
            >
              {titleWords.map((text, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.6,
                  }}
                  className="inline-block mx-2 md:mx-4"
                >
                  {text}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mx-auto mt-8 max-w-2xl text-xl text-foreground font-mono"
            >
              We empower businesses with cutting-edge AI solutions to transform
              data into actionable insights.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="mt-12 flex flex-wrap justify-center gap-6"
            >
              {labels.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1.8 + index * 0.15,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                  }}
                  className="flex items-center gap-2 px-6"
                >
                  <feature.icon className="h-5 w-5 text-[#FF6B2C]" />
                  <span className="text-sm font-mono">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 2.4,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 10,
              }}
            >
              <Button
                size="lg"
                className="cursor-pointer rounded-none mt-12 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono"
              >
                GET STARTED <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="container" ref={ref}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 3.0,
              duration: 0.6,
              type: "spring",
              stiffness: 100,
              damping: 10,
            }}
            className="text-center text-4xl font-mono font-bold mb-6"
          >
            Unlock the Power of AI
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 0.6 }}
            className="grid md:grid-cols-3 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 3.2 + index * 0.2,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                }}
                className="flex flex-col items-center text-center p-8 bg-background border"
              >
                <div className="mb-6 rounded-full bg-[#FF6B2C]/10 p-4">
                  <feature.icon className="h-8 w-8 text-[#FF6B2C]" />
                </div>
                <h3 className="mb-4 text-xl font-mono font-bold">
                  {feature.label}
                </h3>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}

demo.tsx;
import { MynaHero } from "@/components/ui/myna-hero";

export default function DemoOne() {
  return <MynaHero />;
}
```

Copy-paste these files for dependencies:

```tsx
shadcn / button;
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

```tsx
shadcn / sheet;
("use client");

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
```

```tsx
shadcn / input;
import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
```

```tsx
shadcn / label;
("use client");

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
```

Install NPM dependencies:

```bash
lucide-react, framer-motion, @radix-ui/react-slot, class-variance-authority, @radix-ui/react-dialog, @radix-ui/react-label
```

Implementation Guidelines

1.  Analyze the component structure and identify all required dependencies
2.  Review the component's argumens and state
3.  Identify any required context providers or hooks and install them
4.  Questions to Ask

- What data/props will be passed to this component?
- Are there any specific state management requirements?
- Are there any required assets (images, icons, etc.)?
- What is the expected responsive behavior?
- What is the best place to use this component in the app?

Steps to integrate 0. Copy paste all the code above in the correct directories

1.  Install external dependencies
2.  Fill image assets with Unsplash stock images you know exist
3.  Use lucide-react icons for svgs or logos if component requires them

# BUTTONs

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:

```tsx
corner-frame-animated-button-1.tsx
'use client'

import type { ButtonHTMLAttributes, FC } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type CornerFrameAnimatedButtonProps = {
  buttonText?: string
  className?: string
  color?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

const CornerFrameAnimatedButton: FC<CornerFrameAnimatedButtonProps> = ({
  buttonText = 'Hover Button',
  className,
  color = 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600',
  onClick,
  ...props
}) => {
  return (
    <motion.button
      type="button"
      className={cn(
        'relative px-8 py-4 bg-transparent border-0 font-semibold text-lg tracking-wide',
        'text-black dark:text-white focus-visible:outline-none cursor-pointer',
        className
      )}
      onClick={onClick}
      whileHover="hover"
      whileTap="tap"
      variants={{
        tap: { scale: 0.98 }
      }}
      {...props}
    >
      <motion.div
        className={cn(
          'absolute inset-0 pointer-events-none',
          '[background-image:linear-gradient(to_right,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_right,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_left,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_left,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_bottom,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_bottom,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_top,var(--foreground)_1.5px,transparent_1.5px),linear-gradient(to_top,var(--foreground)_1.5px,transparent_1.5px)]',
          '[background-position:0_0,0_100%,100%_0,100%_100%,0_0,100%_0,0_100%,100%_100%]',
          '[background-size:15px_15px]',
          '[background-repeat:no-repeat]'
        )}
        variants={{
          hover: {
            opacity: 0,
            transition: { duration: 0.2 }
          }
        }}
      />

      {/* Gradient background on hover */}
      <motion.div
        className={cn('absolute inset-0', color)}
        initial={{ opacity: 0 }}
        variants={{
          hover: {
            opacity: 1,
            transition: { duration: 0.3, ease: 'easeOut' }
          }
        }}
      />

      {/* Button text */}
      <motion.span
        className="relative z-10"
        style={{ color: 'inherit' }}
        variants={{
          hover: {
            color: 'white',
            transition: { duration: 0.3 }
          }
        }}>
        {buttonText}
      </motion.span>
    </motion.button>
  )
}

export default CornerFrameAnimatedButton


demo.tsx
import CornerFrameAnimatedButton from '@/components/ui/corner-frame-animated-button-1';

export default function Demo() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-8">
        <CornerFrameAnimatedButton onClick={() => console.log('Button clicked!')} />

        <CornerFrameAnimatedButton
          buttonText="Custom Color Button"
          className="px-6 py-3 text-base"
          color="bg-gradient-to-r from-orange-500 to-red-600"
          onClick={() => console.log('Custom Color button!')}
        />
      </div>
    </div>
  );
}

```

Install NPM dependencies:

```bash
framer-motion
```

Implementation Guidelines

1.  Analyze the component structure and identify all required dependencies
2.  Review the component's argumens and state
3.  Identify any required context providers or hooks and install them
4.  Questions to Ask

- What data/props will be passed to this component?
- Are there any specific state management requirements?
- Are there any required assets (images, icons, etc.)?
- What is the expected responsive behavior?
- What is the best place to use this component in the app?

Steps to integrate 0. Copy paste all the code above in the correct directories

1.  Install external dependencies
2.  Fill image assets with Unsplash stock images you know exist
3.  Use lucide-react icons for svgs or logos if component requires them

# INPUT UI:

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:

```tsx
use - character - limit.tsx;
("use client");

import { ChangeEvent, useState } from "react";

type UseCharacterLimitProps = {
  maxLength: number;
  initialValue?: string;
};

export function useCharacterLimit({
  maxLength,
  initialValue = "",
}: UseCharacterLimitProps) {
  const [value, setValue] = useState(initialValue);
  const [characterCount, setCharacterCount] = useState(initialValue.length);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      setValue(newValue);
      setCharacterCount(newValue.length);
    }
  };

  return {
    value,
    characterCount,
    handleChange,
    maxLength,
  };
}

demo.tsx;
("use client");

import { useCharacterLimit } from "@/components/hooks/use-character-limit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId } from "react";

function Component() {
  const id = useId();
  const maxLength = 50;
  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({ maxLength });

  return (
    <div className="space-y-2 min-w-[300px]">
      <Label htmlFor={id}>Input with character limit</Label>
      <div className="relative">
        <Input
          id={id}
          className="peer pe-14"
          type="text"
          value={value}
          maxLength={maxLength}
          onChange={handleChange}
          aria-describedby={`${id}-description`}
        />
        <div
          id={`${id}-description`}
          className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums text-muted-foreground peer-disabled:opacity-50"
          aria-live="polite"
          role="status"
        >
          {characterCount}/{limit}
        </div>
      </div>
    </div>
  );
}

export { Component };
```

Copy-paste these files for dependencies:

```tsx
shadcn / input;
import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
```

```tsx
originui / label;
("use client");

import * as React from "react";

import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-4 text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
```

Implementation Guidelines

1.  Analyze the component structure and identify all required dependencies
2.  Review the component's argumens and state
3.  Identify any required context providers or hooks and install them
4.  Questions to Ask

- What data/props will be passed to this component?
- Are there any specific state management requirements?
- Are there any required assets (images, icons, etc.)?
- What is the expected responsive behavior?
- What is the best place to use this component in the app?

Steps to integrate 0. Copy paste all the code above in the correct directories

1.  Install external dependencies
2.  Fill image assets with Unsplash stock images you know exist
3.  Use lucide-react icons for svgs or logos if component requires them

# Notification Display:

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:

```tsx
alert.tsx;
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "./utils";

const alertVariants = cva(
  "relative grid w-full items-start gap-x-2 gap-y-0.5 rounded-xl border px-3.5 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] [&>svg]:h-[1lh] [&>svg]:w-4",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default:
          "bg-transparent text-card-foreground dark:bg-muted/30 [&>svg]:text-muted-foreground",
        error:
          "border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-400 [&>svg]:text-red-500",
        info: "border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-500",
        success:
          "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 [&>svg]:text-emerald-500",
        warning:
          "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-500",
      },
    },
  },
);

export function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants>): React.ReactElement {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...props}
    />
  );
}

export function AlertTitle({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn("font-medium [svg~&]:col-start-2", className)}
      data-slot="alert-title"
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 text-muted-foreground [svg~&]:col-start-2",
        className,
      )}
      data-slot="alert-description"
      {...props}
    />
  );
}

export function AlertAction({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(
        "flex gap-1 max-sm:col-start-2 max-sm:mt-2 sm:row-start-1 sm:row-end-3 sm:self-center",
        className,
      )}
      data-slot="alert-action"
      {...props}
    />
  );
}

demo.tsx;
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function AlertDefault() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-background p-8">
      <div className="w-full max-w-xl">
        <Alert>
          <Terminal className="size-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components and dependencies to your app using the CLI.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
```

Install NPM dependencies:

```bash
class-variance-authority
```

Implementation Guidelines

1.  Analyze the component structure and identify all required dependencies
2.  Review the component's argumens and state
3.  Identify any required context providers or hooks and install them
4.  Questions to Ask

- What data/props will be passed to this component?
- Are there any specific state management requirements?
- Are there any required assets (images, icons, etc.)?
- What is the expected responsive behavior?
- What is the best place to use this component in the app?

Steps to integrate 0. Copy paste all the code above in the correct directories

1.  Install external dependencies
2.  Fill image assets with Unsplash stock images you know exist
3.  Use lucide-react icons for svgs or logos if component requires them

# Notification LOgo:

You are given a task to integrate an existing React component in the codebase

The codebase should support:

- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:

```tsx
warning - graphic.tsx;
("use client");

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WarningGraphicProps {
  /** Width of the graphic */
  width?: number;
  /** Height of the graphic */
  height?: number;
  /** Additional CSS classes */
  className?: string;
  /** Control animation enable/disable */
  enableAnimations?: boolean;
  /** Animation speed multiplier */
  animationSpeed?: number;
  /** Color override for all elements */
  color?: string;
}

export function WarningGraphic({
  width = 354, // Default 2x size of original 176.958
  height = 115, // Default 2x size of original 57.531
  className,
  enableAnimations = true,
  animationSpeed = 1,
  color = "#FDC221",
}: WarningGraphicProps = {}) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;
  const speedMultiplier = 1 / animationSpeed;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldAnimate ? 0.15 * speedMultiplier : 0,
        delayChildren: shouldAnimate ? 0.1 * speedMultiplier : 0,
      },
    },
  };

  // First: Path lines (corner/background elements) draw from inside out
  const pathLineVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0.3, // Keep opacity constant for visibility
    },
    visible: {
      pathLength: 1,
      opacity: 0.3,
      transition: {
        pathLength: { duration: 1.2 * speedMultiplier, ease: "easeOut" },
        delay: shouldAnimate ? 0.0 : 0,
      },
    },
  };

  // Second: Triangle outline draws
  const triangleVariants = {
    hidden: {
      opacity: 0,
      pathLength: 0,
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      transition: {
        pathLength: { duration: 0.8 * speedMultiplier, ease: "easeOut" },
        opacity: { duration: 0.3 * speedMultiplier },
        delay: shouldAnimate ? 0.6 * speedMultiplier : 0,
      },
    },
  };

  // Corner rectangles - fade in last
  const elementVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      y: 10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: shouldAnimate ? 2.5 * speedMultiplier : 0, // Fade in last
      },
    },
  };

  // Third: Interior stripes animate from center outward
  const leftStripeVariants = {
    hidden: {
      opacity: 0,
      scaleX: 0,
      transformOrigin: "right center", // Scale from right (center) going left
    },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        delay: shouldAnimate ? 1.4 * speedMultiplier : 0,
      },
    },
  };

  const rightStripeVariants = {
    hidden: {
      opacity: 0,
      scaleX: 0,
      transformOrigin: "left center", // Scale from left (center) going right
    },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        delay: shouldAnimate ? 1.4 * speedMultiplier : 0,
      },
    },
  };

  const stripesContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldAnimate ? 0.08 * speedMultiplier : 0,
        delayChildren: shouldAnimate ? 1.4 * speedMultiplier : 0,
      },
    },
  };

  // Fourth: Exclamation with overshoot
  const exclamationVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: [0, 1.3, 1], // Overshoot: 0 -> 1.3 -> 1
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20,
        scale: {
          times: [0, 0.6, 1],
          duration: 0.6 * speedMultiplier,
        },
        delay: shouldAnimate ? 2.0 * speedMultiplier : 0,
      },
    },
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 176.958 57.531"
      className={cn("", className)}
      variants={shouldAnimate ? containerVariants : {}}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.g>
        {/* Corner rectangles */}
        <motion.rect
          y="25.128"
          width="0.538"
          height="0.538"
          transform="translate(-25.128 25.666) rotate(-90)"
          fill={color}
          variants={elementVariants}
        />
        <motion.rect
          y="22.449"
          width="0.538"
          height="0.538"
          transform="translate(-22.449 22.987) rotate(-90)"
          fill={color}
          variants={elementVariants}
        />
        <motion.rect
          x="176.42"
          y="25.128"
          width="0.538"
          height="0.538"
          transform="translate(151.292 202.086) rotate(-90)"
          fill={color}
          variants={elementVariants}
        />
        <motion.rect
          x="176.42"
          y="22.449"
          width="0.538"
          height="0.538"
          transform="translate(153.971 199.408) rotate(-90)"
          fill={color}
          variants={elementVariants}
        />

        {/* First: Background/corner path lines draw from inside out */}
        <motion.g variants={containerVariants}>
          <motion.path
            d="M25.949,24.432H5.565a.375.375,0,0,1,0-.75H25.52l8.068-13.7H59.015a.375.375,0,0,1,0,.75h-25Z"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            strokeLinecap="round"
            variants={pathLineVariants}
          />
          <motion.path
            d="M171.393,24.432H151.009l-8.068-13.7h-25a.375.375,0,0,1,0-.75H143.37l8.068,13.7h19.955a.375.375,0,0,1,0,.75Z"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            strokeLinecap="round"
            variants={pathLineVariants}
          />
          <motion.path
            d="M57.3,57.531a.375.375,0,0,1-.321-.182L47.147,41.043H18.507l-7.71-7.71H7.66a.375.375,0,1,1,0-.75h3.448l7.709,7.71H47.571L57.623,56.962a.376.376,0,0,1-.127.515A.382.382,0,0,1,57.3,57.531Z"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            strokeLinecap="round"
            variants={pathLineVariants}
          />
          <motion.path
            d="M119.656,57.531a.376.376,0,0,1-.321-.569l10.052-16.669h28.754l7.709-7.71H169.3a.375.375,0,0,1,0,.75h-3.137l-7.71,7.71h-28.64l-9.833,16.306A.377.377,0,0,1,119.656,57.531Z"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            strokeLinecap="round"
            variants={pathLineVariants}
          />
        </motion.g>

        {/* Second: Main warning triangle outline draws */}
        <motion.path
          d="M93.582,1l26.746,46.327-5.1,8.828H61.737L56.63,47.326,83.377,1h10.2m.577-1H82.8L55.475,47.327l5.685,9.828h54.648l5.675-9.828L94.159,0Z"
          fill={color}
          variants={triangleVariants}
        />

        {/* Third: Interior stripes animate from center outward */}
        <motion.g variants={stripesContainerVariants}>
          {/* Left side stripes (animate from center going left) */}
          <motion.polygon
            points="51.838 37.309 61.852 37.309 75.448 13.85 65.434 13.85 51.838 37.309"
            fill={color}
            variants={leftStripeVariants}
          />
          <motion.polygon
            points="37.422 37.309 47.436 37.309 61.033 13.85 51.019 13.85 37.422 37.309"
            fill={color}
            variants={leftStripeVariants}
          />
          <motion.polygon
            points="23.007 37.309 33.021 37.309 46.617 13.85 36.603 13.85 23.007 37.309"
            fill={color}
            variants={leftStripeVariants}
          />

          {/* Right side stripes (animate from center going right) */}
          <motion.polygon
            points="125.121 37.309 115.107 37.309 101.51 13.85 111.524 13.85 125.121 37.309"
            fill={color}
            variants={rightStripeVariants}
          />
          <motion.polygon
            points="139.536 37.309 129.522 37.309 115.926 13.85 125.94 13.85 139.536 37.309"
            fill={color}
            variants={rightStripeVariants}
          />
          <motion.polygon
            points="153.951 37.309 143.937 37.309 130.341 13.85 140.355 13.85 153.951 37.309"
            fill={color}
            variants={rightStripeVariants}
          />
        </motion.g>

        {/* Fourth: Exclamation mark with overshoot */}
        <motion.path
          d="M88.469,38.939a3.158,3.158,0,0,1,2.29.838,3.058,3.058,0,0,1,0,4.269,3.521,3.521,0,0,1-4.56,0,2.827,2.827,0,0,1-.868-2.125,2.858,2.858,0,0,1,.868-2.134A3.11,3.11,0,0,1,88.469,38.939Zm2.339-3.079H86.13l-.662-19.666h6Z"
          fill={color}
          variants={exclamationVariants}
        />
      </motion.g>
    </motion.svg>
  );
}

demo.tsx;
("use client");

import { WarningGraphic } from "@/components/ui/warning-graphic";

export default function Demo() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <WarningGraphic
        width={600}
        height={230}
        enableAnimations={true}
        animationSpeed={1.5}
        className="drop-shadow-lg"
      />
    </div>
  );
}
```

Install NPM dependencies:

```bash
framer-motion
```

Implementation Guidelines

1.  Analyze the component structure and identify all required dependencies
2.  Review the component's argumens and state
3.  Identify any required context providers or hooks and install them
4.  Questions to Ask

- What data/props will be passed to this component?
- Are there any specific state management requirements?
- Are there any required assets (images, icons, etc.)?
- What is the expected responsive behavior?
- What is the best place to use this component in the app?

Steps to integrate 0. Copy paste all the code above in the correct directories

1.  Install external dependencies
2.  Fill image assets with Unsplash stock images you know exist
3.  Use lucide-react icons for svgs or logos if component requires them

# NB: for color lets use Eve Frontier colors

Installation 📦
To install the library, run the following command:

pnpm install @eveworld/ui-components
Usage 🔧
To use a component from this library, import it into your project:

import { SmartAssemblyInfo } from "@eveworld/ui-components";
Then use it in your React component:

<SmartAssemblyInfo />
Styling with Tailwind CSS 🎨
This library utilizes Tailwind CSS for styling. To ensure that the styles are properly applied, the tailwind.config.js file must be configured to include the path to this component library.

Configuring Tailwind
Add the path to the UI component library in the content array of tailwind.config.js:

module.exports = {
content: [
// ...other file paths
"./node_modules/@eveworld/ui-components/**/*.{js,ts,jsx,tsx}",
],
// ...other Tailwind configurations
};
This step is necessary for Tailwind to process the classes used in the library.

Components 🧩
The library includes a variety of components designed for EVE Frontier dApps. Some of the key components are:

<ClickToCopy />
<ConnectWallet />
<ErrorNotice />
<EveAlert />
<EveButton />
<EveLayout />
<EveLinearBar />
<EveLoadingAnimation />
<EveScroll />
<Header />
<SmartAssemblyInfo />
<EveInput />
Component Props and Types
Some components require props that are defined using types from the @eveworld/types package. To use these components, ensure you import the necessary types.

Example:

import { SmartAssemblyInfo } from "@eveworld/ui-components";
import { SmartAssembly } from "@eveworld/types";

const smartAssemblyData: SmartAssembly = {
// populate with required data
};

const App = () => (

  <div>
    <SmartAssemblyInfo {...smartAssemblyData} />
  </div>
);
Static Assets 🖼️
The library also includes static SVG assets that can be accessed from @eveworld/ui-components/assets. These assets can be used for icons, logos, and other visual elements in your application.

To use an SVG asset, import it into your project like this:

import { Logo } from '@eveworld/ui-components/assets';

const App = () => (

  <div>
    <Logo />
  </div>
);
