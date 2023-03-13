import { ArrowRight, Envelope } from "phosphor-react";
import { Text } from "../Text";
import { TextInput } from "../TextInput";
import { Button } from "../Button";
import { Box } from "../Box";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

export function ClaimUsernameForm() {
    const router = useRouter();
    const claimUsernameFormSchema = z.object({
        username: z
            .string()
            .min(3, { message: "mínimo 3 caracteres" })
            .regex(/^([a-z\\-]+)$/i, {
                message: "Permitido apenas letras e hifens",
            })
            .transform((username) => username.toLowerCase()),
    });

    type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ClaimUsernameFormData>({
        resolver: zodResolver(claimUsernameFormSchema),
    });

    async function handleClaimUsername(data: ClaimUsernameFormData) {
        const { username } = data;
        await router.push(`/register?username=${username}`);
    }

    return (
        <form onSubmit={handleSubmit(handleClaimUsername)}>
            <Box className="grid grid-cols-[1fr,auto]">
                <TextInput.Root>
                    <TextInput.Input
                        placeholder="seu-usuario"
                        {...register("username")}
                    />
                </TextInput.Root>
                <Button type="submit" disabled={isSubmitting}>
                    Reservar
                    <ArrowRight />
                </Button>
            </Box>
            <div className="mt-2 text-gray-400 text-sm">
                {errors.username?.message ??
                    "Digite o nome do usuário desejado"}
            </div>
        </form>
    );
}
