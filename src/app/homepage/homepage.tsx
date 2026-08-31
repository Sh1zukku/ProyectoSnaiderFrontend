import { ItemsTable } from '@/components/table'
import CustomFullScreenLoading from '@/components/CustomFullScreenLoading'
import { getUserAction } from '@/app/auth/actions/getuser.action'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

export default function HomePage() {
  const { id: dniCuit } = useParams<{ id: string }>()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user', dniCuit],
    queryFn: () => getUserAction(dniCuit!),
    enabled: Boolean(dniCuit),
    retry: false,
  })

  if (isLoading) return <CustomFullScreenLoading />

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-10 lg:py-14">
      <div className="flex flex-col gap-3 border-b border-border pb-8">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Pedidos
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-balance text-foreground lg:text-4xl">
          Listado de Pedidos Despachados
        </h1>
        <p className="max-w-xxl text-pretty leading-relaxed text-muted-foreground">
          Detalle de los pedidos despachdos en su nombre registradas por Nro de Remito, Remitente, Nro.Deposito, Bultos, Peso, Valor, Tipo y Observaciones, y Fecha y Hora Recibido 
        </p>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          DNI/CUIT: {dniCuit} · {data?.count ?? 0} registros
        </p>
      </div>

      {isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive" role="alert">
          No se pudo cargar la información del usuario. Verifica el DNI/CUIT e inténtalo nuevamente.
        </div>
      ) : data?.results.length ? (
        <ItemsTable items={data.results} />
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No hay operaciones registradas para este DNI/CUIT.
        </div>
      )}
    </main>
  )
}
