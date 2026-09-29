import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UsersRound } from "lucide-react";
import { toast } from "sonner";

import { getAllUserAction } from "@/app/admin/action/getAllUserInfo.action";
import { regenerateClientPasswordAction } from "@/app/admin/action/regenerateClientPassword.action";
import CustomFullScreenLoading from "@/components/CustomFullScreenLoading";
import { ClientsTable } from "@/components/admin/clients-table";
import { PageShell, CountLabel } from "@/components/layout/page-shell";
import { EmptyState, ErrorState } from "@/components/ui/state-panel";

export function ClientPage() {
	const queryClient = useQueryClient();
	const { data, isLoading, isError } = useQuery({
		queryKey: ["admin-clients"],
		queryFn: getAllUserAction,
		retry: false,
	});

	const resetPassword = useMutation({
		mutationFn: regenerateClientPasswordAction,
		onSuccess: async ({ blob, filename }) => {
			const downloadUrl = URL.createObjectURL(blob);
			const downloadLink = document.createElement("a");
			downloadLink.href = downloadUrl;
			downloadLink.download = filename;
			document.body.appendChild(downloadLink);
			downloadLink.click();
			downloadLink.remove();
			window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
			toast.success("La contraseña fue restablecida y el archivo se descargó.");
			await queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
		},
		onError: () => {
			toast.error("No se pudo restablecer la contraseña.");
		},
	});

	if (isLoading) return <CustomFullScreenLoading />;

	return (
		<PageShell
			title="Clientes"
			description="Cuentas habilitadas para consultar envíos. Podés restablecer la contraseña de un cliente cuando sea necesario."
			meta={<CountLabel count={data?.count ?? 0} noun="cliente" />}
		>
			{isError ? (
				<ErrorState>No pudimos cargar los clientes. Intentalo nuevamente.</ErrorState>
			) : data?.results.length ? (
				<ClientsTable
					clients={data.results}
					isResetting={resetPassword.isPending}
					resettingClientId={resetPassword.variables}
					onResetPassword={(clientId) => resetPassword.mutate(clientId)}
				/>
			) : (
				<EmptyState icon={UsersRound} title="Sin clientes">
					Todavía no hay clientes registrados.
				</EmptyState>
			)}
		</PageShell>
	);
}
