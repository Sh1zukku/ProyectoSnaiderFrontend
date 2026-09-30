import { PackageOpen } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { ItemsTable } from '@/components/home/table'
import CustomFullScreenLoading from '@/components/CustomFullScreenLoading'
import { PageShell, CountLabel } from '@/components/layout/page-shell'
import { EmptyState, ErrorState } from '@/components/ui/state-panel'
import { getUserAction } from '@/app/auth/actions/getuser.action'
import { ChangePasswordDialog } from '@/app/homepage/change-password-dialog'

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
    <PageShell
      title="Pedidos despachados"
      description={
        <>
          Detalle de los pedidos despachados al DNI/CUIT{' '}
          <span className="font-mono text-foreground">{dniCuit}</span>.
        </>
      }
      meta={<CountLabel count={data?.count ?? 0} noun="registro" />}
      actions={<ChangePasswordDialog />}
    >
      {isError ? (
        <ErrorState>
          No pudimos cargar la información. Verificá el DNI/CUIT e intentalo nuevamente.
        </ErrorState>
      ) : data?.results.length ? (
        <ItemsTable items={data.results} />
      ) : (
        <EmptyState icon={PackageOpen} title="Sin operaciones">
          No hay operaciones registradas para este DNI/CUIT.
        </EmptyState>
      )}
    </PageShell>
  )
}
