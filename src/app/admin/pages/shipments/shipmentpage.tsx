import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PackageSearch, Search, X } from "lucide-react";

import { getShipmentAction } from "@/app/admin/action/getallShipments.action";
import { DeleteOldShipmentsDialog } from "@/app/admin/pages/shipments/delete-old-shipments-dialog";
import CustomFullScreenLoading from "@/components/CustomFullScreenLoading";
import { ItemsTable } from "@/components/home/table";
import { PageShell, CountLabel } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, ErrorState } from "@/components/ui/state-panel";
import { cn } from "@/lib/utils";

export function ShipmentPage() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["admin-shipments"],
		queryFn: getShipmentAction,
		retry: false,
	});

	const [search, setSearch] = useState("");
	const query = search.trim().toLowerCase();

	const shipments = useMemo(() => data?.results ?? [], [data?.results]);

	const filteredShipments = useMemo(() => {
		if (!query) return shipments;

		return shipments.filter((shipment) =>
			[
				shipment.remito_number,
				shipment.deposit_number,
				shipment.sender,
				shipment.recipient?.name,
				shipment.recipient?.dni_cuit,
			].some((field) => String(field ?? "").toLowerCase().includes(query)),
		);
	}, [shipments, query]);

	if (isLoading) return <CustomFullScreenLoading />;

	return (
		<PageShell
			title="Envíos"
			description="Todos los despachos registrados en el sistema."
			meta={
				query ? (
					<>
						<span className="font-mono tabular-nums text-foreground">
							{filteredShipments.length}
						</span>{" "}
						de{" "}
						<span className="font-mono tabular-nums text-foreground">
							{data?.count ?? 0}
						</span>{" "}
						envíos
					</>
				) : (
					<CountLabel count={data?.count ?? 0} noun="registro" />
				)
			}
			actions={<DeleteOldShipmentsDialog />}
		>
			{isError ? (
				<ErrorState>No pudimos cargar los envíos. Intentalo nuevamente.</ErrorState>
			) : shipments.length ? (
				<div className="flex flex-col gap-4">
					<div className="flex flex-wrap items-center gap-3">
						<div className="relative w-full sm:max-w-xs">
							<Search
								className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
								aria-hidden="true"
							/>
							<Input
								type="search"
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								placeholder="Buscar por remito, depósito, remitente o destinatario"
								aria-label="Buscar envíos por remito, depósito, remitente o destinatario"
								className={cn(
									"h-9 appearance-none pl-8 [&::-webkit-search-cancel-button]:hidden",
									search && "pr-8",
								)}
							/>
							{search ? (
								<button
									type="button"
									onClick={() => setSearch("")}
									aria-label="Limpiar búsqueda"
									className="absolute right-0 top-0 flex size-9 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
								>
									<X className="size-4" aria-hidden="true" />
								</button>
							) : null}
						</div>

						{query ? (
							<p className="sr-only" aria-live="polite">
								Mostrando {filteredShipments.length} de {data?.count ?? 0} envíos.
							</p>
						) : null}
					</div>

					{filteredShipments.length ? (
						<ItemsTable items={filteredShipments} />
					) : (
						<EmptyState
							icon={Search}
							title="Sin resultados"
							action={
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setSearch("")}
								>
									<X />
									Limpiar búsqueda
								</Button>
							}
						>
							Ningún envío coincide con “{search.trim()}”. Buscá por remito, depósito,
							remitente o destinatario.
						</EmptyState>
					)}
				</div>
			) : (
				<EmptyState icon={PackageSearch} title="Sin envíos">
					Todavía no hay envíos registrados.
				</EmptyState>
			)}
		</PageShell>
	);
}
