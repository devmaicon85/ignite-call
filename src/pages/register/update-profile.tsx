import { useState } from "react";
import { Button } from "../../components/Button";
import { Heading } from "../../components/Heading";
import { Text } from "../../components/Text";
import { TextInput } from "../../components/TextInput";
import { ArrowRight, Check, Lock, UserCircle } from "phosphor-react";
import { Box } from "../../components/Box";
import { MultiStep } from "../../components/MultiStep";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOptions } from "../api/auth/[...nextauth]";
import { Avatar } from "../../components/Avatar";
import { api } from "@/src/lib/axios";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

const updateProfileSchema = z.object({
    bio: z.string(),
});

type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export default function UpdateProfile() {
    const session = useSession();

    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProfileData>({
        resolver: zodResolver(updateProfileSchema),
    });

    async function handleUpdateProfile(data: UpdateProfileData) {
        await api.put("/users/update-profile", {
            bio: data.bio,
        });

        await router.push(`/schedule/${session.data?.user.username}`);
    }
    return (
        <>
            <NextSeo title="Atualize seu perfil | Ignite Call" noindex />

            <div className="h-screen  max-w-lg w-full m-auto p-4 flex-col flex justify-center text-gray-100 items-center bg-gray-900">
                <header className="flex flex-col items-center">
                    <Heading as="strong" className="mt-4 text-3xl">
                        Finalizando
                    </Heading>

                    <Text className="text-gray-400 mt-2 mb-8">
                        Por último, uma breve descrição e uma foto do seu perfil
                    </Text>
                </header>

                <MultiStep size={4} currentStep={4} />

                <Box className="w-full mt-8 flex  flex-col items-center">
                    <form
                        onSubmit={handleSubmit(handleUpdateProfile)}
                        className="flex flex-col items-stretch w-full gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <Avatar
                                avatar_url={session.data?.user.avatar_url}
                                alt={session.data?.user.name}
                            />

                            <div className="flex flex-col">
                                <Text>{session.data?.user.name}</Text>
                                <Text className="text-sm">
                                    {session.data?.user.email}
                                </Text>
                            </div>
                        </div>
                        <label htmlFor="about" className="flex flex-col gap-2">
                            <Text className="text-sm">Sobre você</Text>
                            <TextInput.Root>
                                <TextInput.Area {...register("bio")} rows={5} />
                            </TextInput.Root>
                        </label>

                        <Text className="text-xs">
                            Fale um pouco sobre você. Isto será exibido em sua
                            página pessoal
                        </Text>

                        <Button
                            className="mt-4"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Finalizar <ArrowRight />
                        </Button>
                    </form>
                </Box>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(
        req,
        res,
        buildNextAuthOptions(req, res)
    );

    return {
        props: {
            session,
        },
    };
};
