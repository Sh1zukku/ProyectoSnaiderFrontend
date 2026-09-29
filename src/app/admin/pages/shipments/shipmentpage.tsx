import { useQuery } from "@tanstack/react-query";
import { PackageSearch } from "lucide-react";

import { getShipmentAction } from "@/app/admin/action/getallShipments.action";
import CustomFullScreenLoading from "@/components/CustomFullScreenLoading";
import { ItemsTable } from "@/components/home/table";
import { PageShell, CountLabel } from "@/components/layout/page-shell";
import { EmptyState, ErrorState } from "@/components/ui/state-panel";

export function ShipmentPage() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["admin-shipments"],
		queryFn: getShipmentAction,
		retry: false,
	});

	if (isLoading) return <CustomFullScreenLoading />;

	return (
		<PageShell
			title="Envíos"
			description="Todos los despachos registrados en el sistema."
			meta={<CountLabel count={data?.count ?? 0} noun="registro" />}
		>
			{isError ? (
				<ErrorState>No pudimos cargar los envíos. Intentalo nuevamente.</ErrorState>
			) : data?.results.length ? (
				<ItemsTable items={data.results} />
			) : (
				<EmptyState icon={PackageSearch} title="Sin envíos">
					Todavía no hay envíos registrados.
				</EmptyState>
			)}
		</PageShell>
	);
}
