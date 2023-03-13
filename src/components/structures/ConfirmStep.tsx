import { Box } from "@/src/components/Box";
import { Button } from "@/src/components/Button";
import { Text } from "@/src/components/Text";
import { TextInput } from "@/src/components/TextInput";
import { api } from "@/src/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { Calendar, Clock } from "phosphor-react";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const confirmFormSchema = z.object({
    name: z.string().min(3, { message: "Digite o nome corretamente" }),
    email: z.string().email({ message: "Digite um e-mail válido" }),
    observations: z.string().nullable(),
});

type ConfirmFormData = z.infer<typeof confirmFormSchema>;

interface ConfirmStepProps {
    schedulingDate: Date;
    onClearDateTime: () => void;
}
export function ConfirmStep({
    schedulingDate,
    onClearDateTime,
}: ConfirmStepProps) {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<ConfirmFormData>({
        resolver: zodResolver(confirmFormSchema),
    });

    const router = useRouter();
    const username = String(router.query.username);

    async function handleConfirmSchedule(data: ConfirmFormData) {
        const { name, email, observations } = data;

        await api.post(`/users/${username}/schedule`, {
            name,
            email,
            observations,
            date: schedulingDate,
        });

        onClearDateTime()
    }

    const describeDate = dayjs(schedulingDate).format("DD[ de ]MMMM[ de ]YYYY");
    const describeTime = dayjs(schedulingDate).format("HH:mm[h]");

    return (
        <Box className="max-w-lg w-full border-4 m-auto">
            <div className="flex items-center gap-4 mt-2">
                <Calendar className="w-5 h-5 opacity-50" /> {describeDate}{" "}
                <Clock className="w-5 h-5 opacity-50" /> {describeTime}
            </div>

            <hr className="border-t my-6 border-gray-600" />
            <form
                className="flex flex-col gap-2 my-4"
                onSubmit={handleSubmit(handleConfirmSchedule)}
            >
                <Text className="text-sm">Seu nome</Text>
                <TextInput.Root>
                    <TextInput.Input
                        placeholder="digite seu nome"
                        {...register("name")}
                    />
                </TextInput.Root>
                <Text className="text-xs text-red-300">
                    {errors.name?.message}
                </Text>

                <Text className="text-sm">E-mail</Text>
                <TextInput.Root>
                    <TextInput.Input
                        placeholder="exemplo@exemplo.com"
                        {...register("email")}
                    />
                </TextInput.Root>
                <Text className="text-xs text-red-300">
                    {errors.email?.message}
                </Text>

                <Text className="text-sm">Observações</Text>
                <TextInput.Root>
                    <TextInput.Area
                        rows={5}
                        placeholder="alguma observação ou comentário?"
                        {...register("observations")}
                    />
                </TextInput.Root>

                <div className="flex justify-end w-full gap-2 mt-4">
                    <Button
                        type="button"
                        onClick={onClearDateTime}
                        className="max-w-[120px] bg-transparent hover:bg-transparent hover:underline"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="max-w-[120px]"
                        disabled={isSubmitting}
                    >
                        Confirmar
                    </Button>
                </div>
            </form>
        </Box>
    );
}
