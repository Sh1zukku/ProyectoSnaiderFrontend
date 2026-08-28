import { LoaderCircle } from "lucide-react";

type CustomFullScreenLoadingProps = {
	title?: string;
	message?: string;
	ariaLabel?: string;
};

export default function CustomFullScreenLoading({
	title = "Un momento",
	message = "Estamos verificando tu sesion",
	ariaLabel = "Comprobando autenticacion",
}: CustomFullScreenLoadingProps) {
	return (
		<main
			className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground"
			role="status"
			aria-live="polite"
			aria-label={ariaLabel}
		>
			<div className="flex flex-col items-center gap-4 text-center">
				<div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
					<LoaderCircle className="size-8 animate-spin text-primary" aria-hidden="true" />
				</div>
				<div className="space-y-1">
					<p className="text-base font-semibold tracking-tight">{title}</p>
					<p className="text-sm text-muted-foreground">{message}</p>
				</div>
			</div>
		</main>
	);
}
