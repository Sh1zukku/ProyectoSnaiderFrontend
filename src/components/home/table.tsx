import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Result } from '@/app/auth/interfaces/user.response'

export function ItemsTable({ items }: { items: Result[] }) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              <Th>Remito</Th>
              <Th>Remitente</Th>
              <Th>Destinatario</Th>
              <Th>Depósito</Th>
              <Th className="text-right">Bultos</Th>
              <Th className="text-right">Peso (kg)</Th>
              <Th className="text-right">Valor declarado</Th>
              <Th>Fecha de recepción</Th>
              <Th>Observaciones</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              return (
                <tr
                  key={`${item.remito_number}-${item.deposit_number}`}
                  className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
                >
                  <Td className="font-mono text-xs text-muted-foreground">{item.remito_number}</Td>
                  <Td className="font-medium text-foreground">{item.sender}</Td>
                  <Td className="text-muted-foreground">{item.recipient.name}</Td>
                  <Td className="font-mono text-xs text-muted-foreground">{item.deposit_number}</Td>
                  <Td className="text-right font-mono tabular-nums">{item.packages}</Td>
                  <Td className="text-right font-mono tabular-nums">{item.weight_kg}</Td>
                  <Td className="text-right font-mono tabular-nums">{item.declared_value}</Td>
                  <Td className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                    {new Date(item.received_datetime).toLocaleString('es-AR')}
                  </Td>
                  <Td className="text-muted-foreground">{item.observations || 'Sin observaciones'}</Td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-border">
        {items.map((item) => {
          const rowKey = `${item.remito_number}-${item.deposit_number}`
          const isExpanded = !!expandedRows[rowKey]

          return (
            <div key={rowKey} className="bg-card">
              <button
                type="button"
                onClick={() => toggleRow(rowKey)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Remito</p>
                  <p className="truncate font-mono text-sm text-foreground">{item.remito_number}</p>
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Remitente</p>
                  <p className="truncate text-sm text-foreground">{item.sender}</p>
                </div>

                <div className="min-w-0 flex-1 text-right">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Fecha</p>
                  <p className="truncate font-mono text-[11px] text-muted-foreground">
                    {new Date(item.received_datetime).toLocaleString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <span className={cn('text-xs text-muted-foreground transition-transform', isExpanded && 'rotate-180')}>
                  ▾
                </span>
              </button>

              {isExpanded && (
                <div className="grid grid-cols-2 gap-3 border-t border-border bg-muted/20 px-4 py-3 text-sm">
                  <MobileDetail label="Destinatario" value={item.recipient.name} />
                  <MobileDetail label="Depósito" value={item.deposit_number} />
                  <MobileDetail label="Bultos" value={String(item.packages)} />
                  <MobileDetail label="Peso" value={`${item.weight_kg} kg`} />
                  <MobileDetail label="Valor" value={String(item.declared_value)} />
                  <div className="col-span-2">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Observaciones</p>
                    <p className="mt-1 text-foreground">{item.observations || 'Sin observaciones'}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MobileDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-foreground">{value}</p>
    </div>
  )
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={cn(
        'px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground',
        className,
      )}
    >
      {children}
    </th>
  )
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn('px-4 py-3.5 align-middle', className)}>{children}</td>
}
