import { useId, useState } from 'react'
import { useForm, useWatch, type UseFormRegisterReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Check, CircleAlert, Eye, EyeOff, KeyRound, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { userChangePassword } from '@/app/homepage/action/changePassword.action'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * Single source of truth for the rules: the zod validator and the live
 * checklist below are both derived from this list, so they cannot drift apart.
 */
const PASSWORD_RULES = [
  { label: 'al menos 8 caracteres', test: (value: string) => value.length >= 8 },
  {
    label: 'una mayúscula y una minúscula',
    test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value),
  },
  { label: 'un número', test: (value: string) => /\d/.test(value) },
  { label: 'un símbolo', test: (value: string) => /[^A-Za-z0-9\s]/.test(value) },
] as const

const newPasswordField = z.string().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({ code: 'custom', message: 'Ingresá una contraseña nueva.' })
    return
  }

  for (const rule of PASSWORD_RULES) {
    if (!rule.test(value)) {
      ctx.addIssue({
        code: 'custom',
        message: `Usá una contraseña que tenga ${rule.label}.`,
      })
    }
  }
})

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Ingresá tu contraseña actual.' }),
    newPassword: newPasswordField,
    confirmPassword: z.string().min(1, { message: 'Repetí la contraseña nueva.' }),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    message: 'La contraseña nueva tiene que ser distinta de la actual.',
    path: ['newPassword'],
  })

type ChangePasswordForm = z.infer<typeof changePasswordSchema>

interface PasswordFieldProps {
  id: string
  label: string
  autoComplete: string
  registration: UseFormRegisterReturn
  revealed: boolean
  onToggleRevealed: () => void
  error?: string
}

function PasswordField({
  id,
  label,
  autoComplete,
  registration,
  revealed,
  onToggleRevealed,
  error,
}: PasswordFieldProps) {
  const toggleLabel = `${revealed ? 'Ocultar' : 'Mostrar'} ${label.toLowerCase()}`

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={revealed ? 'text' : 'password'}
          autoComplete={autoComplete}
          className="pr-8"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...registration}
        />
        <button
          type="button"
          onClick={onToggleRevealed}
          aria-label={toggleLabel}
          aria-pressed={revealed}
          className="absolute inset-y-0 right-0 flex w-8 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {revealed ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-start gap-1.5 text-xs text-destructive"
        >
          <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function ChangePasswordDialog() {
  const formId = useId()
  const currentPasswordId = useId()
  const newPasswordId = useId()
  const confirmPasswordId = useId()
  const [open, setOpen] = useState(false)
  const [revealed, setRevealed] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const newPasswordValue = useWatch({ control: form.control, name: 'newPassword' })
  const { errors } = form.formState

  const changePassword = useMutation({
    mutationFn: ({ currentPassword, newPassword }: ChangePasswordForm) =>
      userChangePassword(currentPassword, newPassword),
    onSuccess: ({ message }) => {
      setOpen(false)
      form.reset()
      toast.success(message || 'Contraseña actualizada correctamente.')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const toggleRevealed = (field: keyof typeof revealed) => {
    setRevealed((previous) => ({ ...previous, [field]: !previous[field] }))
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (changePassword.isPending) return
    setOpen(nextOpen)
    if (!nextOpen) form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <KeyRound aria-hidden="true" />
        Cambiar contraseña
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar contraseña</DialogTitle>
          <DialogDescription>
            Ingresá tu contraseña actual y elegí una nueva.
          </DialogDescription>
        </DialogHeader>

        <form
          id={formId}
          onSubmit={form.handleSubmit((values) => changePassword.mutate(values))}
          className="space-y-4"
          noValidate
        >
          <PasswordField
            id={currentPasswordId}
            label="Contraseña actual"
            autoComplete="current-password"
            registration={form.register('currentPassword')}
            revealed={revealed.currentPassword}
            onToggleRevealed={() => toggleRevealed('currentPassword')}
            error={errors.currentPassword?.message}
          />

          <div className="space-y-2">
            <PasswordField
              id={newPasswordId}
              label="Contraseña nueva"
              autoComplete="new-password"
              registration={form.register('newPassword')}
              revealed={revealed.newPassword}
              onToggleRevealed={() => toggleRevealed('newPassword')}
              error={errors.newPassword?.message}
            />

            <ul
              aria-label="Requisitos de la contraseña nueva"
              className="space-y-1.5 rounded-lg border border-border bg-muted/40 p-2.5"
            >
              {PASSWORD_RULES.map((rule) => {
                const met = rule.test(newPasswordValue)

                return (
                  <li key={rule.label} className="flex items-center gap-2 text-xs">
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex size-3.5 shrink-0 items-center justify-center rounded-full border transition-colors',
                        met
                          ? 'border-primary/40 bg-primary/15 text-primary'
                          : 'border-border text-transparent',
                      )}
                    >
                      <Check className="size-2.5" />
                    </span>
                    <span className={met ? 'text-foreground' : 'text-muted-foreground'}>
                      {rule.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          <PasswordField
            id={confirmPasswordId}
            label="Confirmar contraseña"
            autoComplete="new-password"
            registration={form.register('confirmPassword')}
            revealed={revealed.confirmPassword}
            onToggleRevealed={() => toggleRevealed('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={changePassword.isPending}
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" form={formId} disabled={changePassword.isPending}>
            {changePassword.isPending ? <LoaderCircle className="animate-spin" /> : null}
            {changePassword.isPending ? 'Guardando…' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}