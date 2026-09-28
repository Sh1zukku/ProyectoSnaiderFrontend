import { KeyRound, LoaderCircle } from "lucide-react";

import type { Result as Client } from "@/app/admin/interface/clientes.response";
import { Button } from "@/components/ui/button";

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
		<div className="overflow-hidden rounded-md border border-border bg-card">
			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-sm">
					<thead>
						<tr className="border-b border-border bg-muted/40 text-left">
							<th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground">Nombre</th>
							<th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground">DNI / CUIT</th>
							<th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground">Alta</th>
							<th className="px-4 py-3 text-xs font-medium uppercase text-muted-foreground">Última actualización</th>
							<th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Contraseña</th>
						</tr>
					</thead>
					<tbody>
						{clients.map((client) => (
							<tr
								key={client.id}
								className="border-b border-border/60 last:border-0 hover:bg-muted/40"
							>
								<td className="px-4 py-3.5 font-medium text-foreground">{client.name}</td>
								<td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">
									{client.dni_cuit}
								</td>
								<td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
									{new Date(client.created_at).toLocaleDateString("es-AR")}
								</td>
								<td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
									{new Date(client.updated_at).toLocaleDateString("es-AR")}
								</td>
								<td className="px-4 py-3.5 text-right">
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
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}