import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold uppercase tracking-wider ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-brand-black dark:border-brand-white",
  {
    variants: {
      variant: {
        default: "bg-brand-black text-brand-white hover:bg-brand-white hover:text-brand-black dark:bg-brand-white dark:text-brand-black dark:hover:bg-brand-black dark:hover:text-brand-white",
        destructive:
          "bg-brand-coral text-brand-white border-brand-coral hover:bg-brand-white hover:text-brand-coral dark:border-brand-coral",
        outline:
          "bg-transparent text-brand-black hover:bg-brand-black hover:text-brand-white dark:text-brand-white dark:hover:bg-brand-white dark:hover:text-brand-black",
        secondary:
          "bg-brand-purple text-brand-white border-brand-purple hover:bg-brand-white hover:text-brand-purple dark:border-brand-purple",
        ghost: "border-transparent hover:bg-brand-black/5 hover:text-brand-black dark:hover:bg-brand-white/10 dark:hover:text-brand-white",
        link: "text-brand-black underline-offset-4 hover:underline border-none dark:text-brand-white",
        navy: "bg-brand-navy text-brand-white border-brand-navy hover:bg-brand-white hover:text-brand-navy dark:border-brand-navy",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
