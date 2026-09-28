import { useQuery } from "@tanstack/react-query";
import { getShipmentAction } from "@/app/admin/action/getallShipments.action";
import CustomFullScreenLoading from "@/components/CustomFullScreenLoading";
import { ItemsTable } from "@/components/home/table";

export function ShipmentPage() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["admin-shipments"],
		queryFn: getShipmentAction,
		retry: false,
	});

	if (isLoading) return <CustomFullScreenLoading />;

	return (
		<main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-10">
			<header className="border-b border-border pb-6">
				<p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
					Administración
				</p>
				<h2 className="mt-2 text-3xl font-semibold text-foreground">Todos los envíos</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					{data?.count ?? 0} registros
				</p>
			</header>

			{isError ? (
				<div
					className="rounded-md border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive"
					role="alert"
				>
					No se pudieron cargar los envíos. Inténtalo nuevamente.
				</div>
			) : data?.results.length ? (
				<ItemsTable items={data.results} />
			) : (
				<div className="rounded-md border border-border p-5 text-sm text-muted-foreground">
					No hay envíos registrados.
				</div>
			)}
		</main>
	);
}
