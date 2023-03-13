import { FormEvent, useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { Checkbox } from "../../components/Checkbox";
import { Heading } from "../../components/Heading";
import { Logo } from "../../components/Logo";
import { Text } from "../../components/Text";
import { TextInput } from "../../components/TextInput";
import { ArrowRight, Lock, UserCircle } from "phosphor-react";
import { Box } from "../../components/Box";
import { MultiStep } from "../../components/MultiStep";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { api } from "../../lib/axios";
import { AxiosError } from "axios";
import { NextSeo } from "next-seo";

const registerFormSchema = z.object({
    username: z
        .string()
        .min(3, { message: "mínimo 3 caracteres" })
        .regex(/^([a-z\\-]+)$/i, {
            message: "Permitido apenas letras e hifens",
        })
        .transform((username) => username.toLowerCase()),
    name: z.string().min(5, { message: "Digite seu nome completo" }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
    const router = useRouter();

    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
    });

    useEffect(() => {
        if (router.query.username) {
            setValue("username", String(router.query.username));
        }
    }, [router.query.username, setValue]);

    async function handleRegister(data: RegisterFormData) {
        try {
            const user = await api.post("/users", {
                name: data.name,
                username: data.username,
            });

            await router.push("/register/conect-calendar");
        } catch (error) {
            if (error instanceof AxiosError && error?.response?.data?.message) {
                setError(error.response.data.message);
                return;
            }

            console.log(error);
        }
    }
    return (
        <>
            <NextSeo
                title="Cria uma conta | Ignite Call"
                description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre"
            />

            <div className="h-screen  max-w-lg w-full m-auto p-4 flex-col flex justify-center text-gray-100 items-center bg-gray-900">
                <header className="flex flex-col items-center">
                    <Heading as="strong" className="mt-4 text-3xl">
                        Bem-vindo ao Ignite Call!
                    </Heading>

                    <Text className="text-gray-400 mt-2 mb-8">
                        Precisamos de algumas informações para criar seu perfil!
                        Ah, você pode editar essas informações depois.
                    </Text>
                </header>

                <MultiStep size={4} currentStep={1} />

                <Box className="w-full mt-8 flex  flex-col items-center">
                    <form
                        onSubmit={handleSubmit(handleRegister)}
                        className="flex flex-col items-stretch w-full gap-4"
                    >
                        <label htmlFor="email" className="flex flex-col gap-2">
                            <Text className="text-sm">Nome de usuário</Text>
                            <TextInput.Root>
                                <TextInput.Icon>
                                    <UserCircle />
                                </TextInput.Icon>
                                <TextInput.Input
                                    placeholder="usuario-desejado"
                                    {...register("username")}
                                />
                            </TextInput.Root>
                            <Text className="text-xs text-red-900">
                                {errors.username?.message}
                            </Text>
                        </label>

                        <label
                            htmlFor="password"
                            className="flex flex-col gap-2"
                        >
                            <Text className="text-sm">Nome Completo</Text>
                            <TextInput.Root>
                                <TextInput.Icon>
                                    <Lock />
                                </TextInput.Icon>
                                <TextInput.Input
                                    placeholder="Joseph Oliveira"
                                    {...register("name")}
                                />
                            </TextInput.Root>
                            <Text className="text-xs text-red-900">
                                {errors.name?.message}
                            </Text>
                        </label>

                        <Text className="text-md text-red-900">{error}</Text>

                        <Button
                            className="mt-4"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Próximo Passo <ArrowRight />
                        </Button>
                    </form>
                </Box>
            </div>
        </>
    );
}
