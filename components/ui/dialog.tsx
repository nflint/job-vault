"use client"

/**
 * Dialog Component Module
 * 
 * A modal dialog component that provides:
 * - Accessible modal dialogs
 * - Focus management
 * - Keyboard interaction handling
 * - Customizable content and styling
 * - Backdrop overlay
 */

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Root dialog component that manages the modal's open state
 * @param {DialogPrimitive.DialogProps} props - Dialog primitive props
 * @returns {JSX.Element} Dialog root component
 */
const Dialog = DialogPrimitive.Root

/**
 * Trigger element that opens the dialog when clicked
 * @param {DialogPrimitive.DialogTriggerProps} props - Dialog trigger props
 * @returns {JSX.Element} Dialog trigger component
 */
const DialogTrigger = DialogPrimitive.Trigger

/**
 * Portal component that renders the dialog content in a portal
 * @param {DialogPrimitive.DialogPortalProps} props - Dialog portal props
 * @returns {JSX.Element} Dialog portal component
 */
const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

/**
 * Overlay component that provides the backdrop for the dialog
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & { className?: string }} props - Overlay props
 * @returns {JSX.Element} Dialog overlay component
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * Content component that contains the main dialog content
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { className?: string }} props - Content props
 * @returns {JSX.Element} Dialog content component
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

/**
 * Header component for the dialog content
 * @param {React.HTMLAttributes<HTMLDivElement> & { className?: string }} props - Header props
 * @returns {JSX.Element} Dialog header component
 */
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

/**
 * Footer component for the dialog content
 * @param {React.HTMLAttributes<HTMLDivElement> & { className?: string }} props - Footer props
 * @returns {JSX.Element} Dialog footer component
 */
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

/**
 * Title component for the dialog
 * @param {DialogPrimitive.DialogTitleProps} props - Title props
 * @returns {JSX.Element} Dialog title component
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

/**
 * Description component for the dialog
 * @param {DialogPrimitive.DialogDescriptionProps} props - Description props
 * @returns {JSX.Element} Dialog description component
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
