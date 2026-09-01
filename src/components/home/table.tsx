import { cn } from '@/lib/utils'
import type { Result } from '@/app/auth/interfaces/user.response'

export function ItemsTable({ items }: { items: Result[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
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
