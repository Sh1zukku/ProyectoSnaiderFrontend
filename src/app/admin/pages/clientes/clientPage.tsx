import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, UsersRound, X } from "lucide-react";
import { toast } from "sonner";

import { getAllUserAction } from "@/app/admin/action/getAllUserInfo.action";
import { regenerateClientPasswordAction } from "@/app/admin/action/regenerateClientPassword.action";
import CustomFullScreenLoading from "@/components/CustomFullScreenLoading";
import { ClientsTable } from "@/components/admin/clients-table";
import { PageShell, CountLabel } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, ErrorState } from "@/components/ui/state-panel";
import { downloadTextFile } from "@/lib/download";
import { cn } from "@/lib/utils";

export function ClientPage() {
	const queryClient = useQueryClient();
	const { data, isLoading, isError } = useQuery({
		queryKey: ["admin-clients"],
		queryFn: getAllUserAction,
		retry: false,
	});

	const [search, setSearch] = useState("");
	const query = search.trim().toLowerCase();

	const clients = useMemo(() => data?.results ?? [], [data?.results]);

	const filteredClients = useMemo(() => {
		if (!query) return clients;

		return clients.filter(
			(client) =>
				client.name.toLowerCase().includes(query) ||
				client.dni_cuit.toLowerCase().includes(query),
		);
	}, [clients, query]);

	const resetPassword = useMutation({
		mutationFn: regenerateClientPasswordAction,
		onSuccess: async ({ content, filename }) => {
			downloadTextFile(content, filename);
			toast.success("La contraseña fue restablecida y el archivo se descargó.");
			await queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
		},
		onError: (error) => {
			toast.error(error instanceof Error ? error.message : "No se pudo restablecer la contraseña.");
		},
	});

	if (isLoading) return <CustomFullScreenLoading />;

	return (
		<PageShell
			title="Clientes"
			description="Cuentas habilitadas para consultar envíos. Podés restablecer la contraseña de un cliente cuando sea necesario."
			meta={
				query ? (
					<>
						<span className="font-mono tabular-nums text-foreground">
							{filteredClients.length}
						</span>{" "}
						de{" "}
						<span className="font-mono tabular-nums text-foreground">
							{data?.count ?? 0}
						</span>{" "}
						clientes
					</>
				) : (
					<CountLabel count={data?.count ?? 0} noun="cliente" />
				)
			}
		>
			{isError ? (
				<ErrorState>No pudimos cargar los clientes. Intentalo nuevamente.</ErrorState>
			) : clients.length ? (
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
								placeholder="Buscar por nombre o DNI/CUIT"
								aria-label="Buscar clientes por nombre o DNI/CUIT"
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
								Mostrando {filteredClients.length} de {data?.count ?? 0} clientes.
							</p>
						) : null}
					</div>

					{filteredClients.length ? (
						<ClientsTable
							clients={filteredClients}
							isResetting={resetPassword.isPending}
							resettingClientId={resetPassword.variables}
							onResetPassword={(clientId) => resetPassword.mutate(clientId)}
						/>
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
							Ningún cliente coincide con “{search.trim()}”. Buscá por nombre o DNI/CUIT.
						</EmptyState>
					)}
				</div>
			) : (
				<EmptyState icon={UsersRound} title="Sin clientes">
					Todavía no hay clientes registrados.
				</EmptyState>
			)}
		</PageShell>
	);
}
