import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getAllUserAction } from "@/app/admin/action/getAllUserInfo.action";
import { regenerateClientPasswordAction } from "@/app/admin/action/regenerateClientPassword.action";
import CustomFullScreenLoading from "@/components/CustomFullScreenLoading";
import { ClientsTable } from "@/components/admin/clients-table";

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
		<main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-10">
			<header className="border-b border-border pb-6">
				<p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
					Administración
				</p>
				<h2 className="mt-2 text-3xl font-semibold text-foreground">Clientes</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					{data?.count ?? 0} clientes registrados
				</p>
			</header>

			{isError ? (
				<div
					className="rounded-md border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive"
					role="alert"
				>
					No se pudieron cargar los clientes. Inténtalo nuevamente.
				</div>
			) : data?.results.length ? (
				<ClientsTable
					clients={data.results}
					isResetting={resetPassword.isPending}
					resettingClientId={resetPassword.variables}
					onResetPassword={(clientId) => resetPassword.mutate(clientId)}
				/>
			) : (
				<div className="rounded-md border border-border p-5 text-sm text-muted-foreground">
					No hay clientes registrados.
				</div>
			)}
		</main>
	);
}
