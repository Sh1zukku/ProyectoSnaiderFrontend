import { useId, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleAlert, LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { manualDelete } from "@/app/admin/action/manualDelete.action";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MS_PER_DAY = 86_400_000;

const isValidDays = (value: string) => {
	const parsed = Number(value);
	return value.trim() !== "" && Number.isInteger(parsed) && parsed >= 1;
};

const getCutoff = (days: number) => new Date(Date.now() - days * MS_PER_DAY);

export function DeleteOldShipmentsDialog() {
	const queryClient = useQueryClient();
	const formId = useId();
	const inputId = useId();
	const [open, setOpen] = useState(false);
	const [days, setDays] = useState("");
	const [cutoff, setCutoff] = useState<Date | null>(null);

	const parsedDays = Number(days);
	const isEmpty = days.trim() === "";
	const canSubmit = isValidDays(days);
	const hasError = !isEmpty && !canSubmit;

	const resetInput = () => {
		setDays("");
		setCutoff(null);
	};

	const handleDaysChange = (value: string) => {
		setDays(value);
		setCutoff(isValidDays(value) ? getCutoff(Number(value)) : null);
	};

	const deleteOld = useMutation({
		mutationFn: manualDelete,
		onSuccess: async ({ deleted_count }, deletedDays) => {
			setOpen(false);
			resetInput();
			toast.success(
				`Se eliminaron ${deleted_count} ${deleted_count === 1 ? "envío" : "envíos"} de más de ${deletedDays} días.`,
			);
			await queryClient.invalidateQueries({ queryKey: ["admin-shipments"] });
		},
		onError: () => {
			toast.error("No se pudieron eliminar los envíos antiguos.");
		},
	});

	const handleOpenChange = (nextOpen: boolean) => {
		if (deleteOld.isPending) return;
		setOpen(nextOpen);
		if (!nextOpen) resetInput();
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!canSubmit || deleteOld.isPending) return;
		deleteOld.mutate(parsedDays);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger render={<Button variant="outline" />}>
				<Trash2 />
				Eliminar antiguos
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Eliminar envíos antiguos</DialogTitle>
					<DialogDescription>
						{canSubmit
							? `Se eliminarán los envíos con más de ${parsedDays} días de antigüedad. Esta acción no se puede deshacer.`
							: "Indicá cuántos días de antigüedad debe tener un envío para eliminarse."}
					</DialogDescription>
				</DialogHeader>

				<form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-2">
					<Label htmlFor={inputId}>Antigüedad mínima</Label>
					<div className="flex items-center gap-2">
						<Input
							id={inputId}
							type="number"
							inputMode="numeric"
							min={1}
							step={1}
							placeholder="10"
							autoFocus
							value={days}
							aria-invalid={hasError || undefined}
							aria-describedby={hasError ? `${inputId}-error` : undefined}
							onChange={(event) => handleDaysChange(event.target.value)}
						/>
						<span className="shrink-0 text-sm text-muted-foreground">días</span>
					</div>
					{hasError ? (
						<p
							id={`${inputId}-error`}
							role="alert"
							className="flex items-start gap-2 text-xs text-destructive"
						>
							<CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
							Ingresá un número entero de 1 día o más.
						</p>
					) : cutoff ? (
						<p className="text-xs text-muted-foreground">
							Fecha de corte:{" "}
							<span className="font-mono tabular-nums text-foreground">
								{cutoff.toLocaleDateString("es-AR")}
							</span>
						</p>
					) : null}
				</form>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						disabled={deleteOld.isPending}
						onClick={() => handleOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						form={formId}
						variant="destructive"
						disabled={!canSubmit || deleteOld.isPending}
					>
						{deleteOld.isPending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
						{deleteOld.isPending ? "Eliminando…" : "Eliminar"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
