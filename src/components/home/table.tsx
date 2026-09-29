import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { DataTableCard, Table, THead, Th, TRow, Td, MobileDetail } from '@/components/ui/data-table'
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
    <DataTableCard>
      <div className="hidden md:block">
        <Table>
          <THead>
            <Th>Remito</Th>
            <Th>Remitente</Th>
            <Th>Destinatario</Th>
            <Th>Depósito</Th>
            <Th className="text-right">Bultos</Th>
            <Th className="text-right">Peso (kg)</Th>
            <Th className="text-right">Valor declarado</Th>
            <Th>Fecha de recepción</Th>
            <Th>Observaciones</Th>
          </THead>
          <tbody>
            {items.map((item) => (
              <TRow key={`${item.remito_number}-${item.deposit_number}`}>
                <Td className="font-mono text-xs text-muted-foreground">{item.remito_number}</Td>
                <Td className="font-medium text-foreground">{item.sender}</Td>
                <Td className="text-muted-foreground">{item.recipient.name}</Td>
                <Td className="font-mono text-xs text-muted-foreground">{item.deposit_number}</Td>
                <Td className="text-right tabular-nums">{item.packages}</Td>
                <Td className="text-right tabular-nums">{item.weight_kg}</Td>
                <Td className="text-right tabular-nums">{item.declared_value}</Td>
                <Td className="whitespace-nowrap text-xs text-muted-foreground tabular-nums">
                  {new Date(item.received_datetime).toLocaleString('es-AR')}
                </Td>
                <Td className="max-w-xs text-muted-foreground">{item.observations || '—'}</Td>
              </TRow>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="divide-y divide-border md:hidden">
        {items.map((item) => {
          const rowKey = `${item.remito_number}-${item.deposit_number}`
          const isExpanded = !!expandedRows[rowKey]

          return (
            <div key={rowKey} className="bg-card">
              <button
                type="button"
                onClick={() => toggleRow(rowKey)}
                aria-expanded={isExpanded}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Remito</p>
                  <p className="truncate font-mono text-sm text-foreground">{item.remito_number}</p>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Remitente</p>
                  <p className="truncate text-sm text-foreground">{item.sender}</p>
                </div>

                <div className="min-w-0 flex-1 text-right">
                  <p className="text-xs text-muted-foreground">Fecha</p>
                  <p className="truncate text-xs text-muted-foreground tabular-nums">
                    {new Date(item.received_datetime).toLocaleString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 text-muted-foreground transition-transform',
                    isExpanded && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>

              {isExpanded && (
                <div className="grid grid-cols-2 gap-3 border-t border-border bg-muted/20 px-4 py-3 text-sm">
                  <MobileDetail label="Destinatario" value={item.recipient.name} />
                  <MobileDetail label="Depósito" value={item.deposit_number} mono />
                  <MobileDetail label="Bultos" value={String(item.packages)} />
                  <MobileDetail label="Peso" value={`${item.weight_kg} kg`} />
                  <MobileDetail label="Valor declarado" value={String(item.declared_value)} />
                  <MobileDetail label="Fecha de recepción" value={new Date(item.received_datetime).toLocaleString('es-AR')} />
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Observaciones</p>
                    <p className="mt-1 text-foreground">{item.observations || '—'}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </DataTableCard>
  )
}
