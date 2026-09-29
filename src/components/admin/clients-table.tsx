import { KeyRound, LoaderCircle } from "lucide-react";

import type { Result as Client } from "@/app/admin/interface/clientes.response";
import { Button } from "@/components/ui/button";
import { DataTableCard, Table, THead, Th, TRow, Td } from "@/components/ui/data-table";

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
	return (
		<DataTableCard>
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
							<Td className="text-right">
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
							</Td>
						</TRow>
					))}
				</tbody>
			</Table>
		</DataTableCard>
	);
}
