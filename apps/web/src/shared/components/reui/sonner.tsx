"use client"

// PATCH Scout: tema propio ([data-theme]) en vez de next-themes.
import { useTheme } from "@/shared/theme"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

/** Variables de sonner (`--{type}-bg/-text/-border`) mapeadas a un token de estado. */
function statusColors(type: string, token: string): Record<string, string> {
  return {
    [`--${type}-bg`]: `var(--color-${token})`,
    [`--${type}-border`]: `var(--color-${token})`,
    [`--${type}-text`]: "var(--color-surface)",
  }
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { mode: theme } = useTheme()

  return (
    <Sonner
      theme={theme}
      richColors
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          // PATCH Scout: tokens de marca (shadcn usa --popover/--border sin prefijo).
          "--normal-bg": "var(--color-surface-raised)",
          "--normal-text": "var(--color-ink)",
          "--normal-border": "var(--color-border)",
          "--border-radius": "var(--radius-lg)",
          // PATCH Scout: richColors con fondo sólido de estado; `surface` como tinta contrasta en claro y oscuro.
          ...statusColors("success", "success"),
          ...statusColors("error", "danger"),
          ...statusColors("warning", "warning"),
          ...statusColors("info", "info"),
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
