import { useState } from "react";
import { ChevronDown, KeyRound, LoaderCircle } from "lucide-react";

import type { Result as Client } from "@/app/admin/interface/clientes.response";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DataTableCard, Table, THead, Th, TRow, Td, MobileDetail } from "@/components/ui/data-table";

interface ClientsTableProps {
	clients: Client[];
	isResetting: boolean;
	resettingClientId?: number;
	onResetPassword: (clientId: number) => void;
}

export function ClientsTable({
	clients,
	isResetting,
	resettingClientId,
	onResetPassword,
}: ClientsTableProps) {
	const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

	const toggleRow = (id: number) => {
		setExpandedRows((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const renderResetButton = (client: Client) => (
		<Button
			type="button"
			size="sm"
			variant="outline"
			disabled={isResetting}
			onClick={() => onResetPassword(client.id)}
			aria-label={`Restablecer contraseña de ${client.name}`}
		>
			{isResetting && resettingClientId === client.id ? (
				<LoaderCircle className="animate-spin" />
			) : (
				<KeyRound />
			)}
			Restablecer
		</Button>
	);

	return (
		<DataTableCard>
			<div className="hidden md:block">
				<Table>
					<THead>
						<Th>Nombre</Th>
						<Th>DNI / CUIT</Th>
						<Th>Alta</Th>
						<Th>Última actualización</Th>
						<Th className="text-right">Contraseña</Th>
					</THead>
					<tbody>
						{clients.map((client) => (
							<TRow key={client.id}>
								<Td className="font-medium text-foreground">{client.name}</Td>
								<Td className="font-mono text-xs text-muted-foreground">{client.dni_cuit}</Td>
								<Td className="whitespace-nowrap text-muted-foreground tabular-nums">
									{new Date(client.created_at).toLocaleDateString("es-AR")}
								</Td>
								<Td className="whitespace-nowrap text-muted-foreground tabular-nums">
									{new Date(client.updated_at).toLocaleDateString("es-AR")}
								</Td>
								<Td className="text-right">{renderResetButton(client)}</Td>
							</TRow>
						))}
					</tbody>
				</Table>
			</div>

			<div className="divide-y divide-border md:hidden">
				{clients.map((client) => {
					const isExpanded = !!expandedRows[client.id];

					return (
						<div key={client.id} className="bg-card">
							<button
								type="button"
								onClick={() => toggleRow(client.id)}
								aria-expanded={isExpanded}
								className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
							>
								<div className="min-w-0 flex-1">
									<p className="text-xs text-muted-foreground">Nombre</p>
									<p className="truncate text-sm text-foreground">{client.name}</p>
								</div>

								<div className="min-w-0 flex-1 text-right">
									<p className="text-xs text-muted-foreground">DNI / CUIT</p>
									<p className="truncate font-mono text-xs text-foreground">{client.dni_cuit}</p>
								</div>

								<ChevronDown
									className={cn(
										"size-4 shrink-0 text-muted-foreground transition-transform",
										isExpanded && "rotate-180",
									)}
									aria-hidden="true"
								/>
							</button>

							{isExpanded && (
								<div className="grid grid-cols-2 gap-3 border-t border-border bg-muted/20 px-4 py-3 text-sm">
									<MobileDetail
										label="Alta"
										value={new Date(client.created_at).toLocaleDateString("es-AR")}
									/>
									<MobileDetail
										label="Última actualización"
										value={new Date(client.updated_at).toLocaleDateString("es-AR")}
									/>
									<div className="col-span-2">
										<p className="text-xs text-muted-foreground">Contraseña</p>
										<div className="mt-1">{renderResetButton(client)}</div>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</DataTableCard>
	);
}
