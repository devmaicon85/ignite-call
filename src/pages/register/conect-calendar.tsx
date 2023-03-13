import { Button } from "../../components/Button";
import { Heading } from "../../components/Heading";
import { Text } from "../../components/Text";
import { ArrowRight, Check } from "phosphor-react";
import { Box } from "../../components/Box";
import { MultiStep } from "../../components/MultiStep";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";

export default function Register() {
    const router = useRouter();

    const hasAuthError = !!router.query.error;

    const session = useSession();
    console.log(
        "🚀 ~ file: conect-calendar.tsx:16 ~ Register ~ session:",
        session
    );

    const isSignedIn = session.status === "authenticated";

    async function signInGoogle() {
        await router.push({
            query: "", // clean erros
        });

        signIn("google");
    }

    async function handleNavigatorToNextStep() {
        await router.push("/register/time-intervals");
    }

    return (
        <>
            <NextSeo
                title="Conecte a sua agenda do google | Ignite Call"
                noindex
            />

            <div className="h-screen  max-w-lg w-full m-auto p-4 flex-col flex justify-center text-gray-100 items-center bg-gray-900">
                <header className="flex flex-col items-center">
                    <Heading as="strong" className="mt-4 text-3xl">
                        Conecte o sua agenda!
                    </Heading>

                    <Text className="text-gray-400 mt-2 mb-8">
                        Conecte o seu calendário para verificar automaticamente
                        as horas ocupadas e os novos eventos à media em que são
                        agendados.
                    </Text>
                </header>

                <MultiStep size={4} currentStep={2} />

                <Box className="w-full mt-8 flex  flex-col items-center">
                    <div className="flex flex-col items-stretch w-full gap-4">
                        <Box className="grid sm:grid-cols-[1fr,auto]">
                            <Text className="flex items-center">
                                Google Calendar
                            </Text>
                            <Button
                                className="border border-red-500 bg-transparent"
                                type="button"
                                onClick={signInGoogle}
                            >
                                {isSignedIn ? `Conectado` : `Conectar`}
                                {isSignedIn ? <Check /> : <ArrowRight />}
                            </Button>
                        </Box>

                        {isSignedIn && hasAuthError && (
                            <Text className="text-sm text-red-700">
                                Falha ao se conectar ao Google, verifique se
                                você habilitou as permissões de acesso ao Google
                                Calendar
                            </Text>
                        )}

                        {isSignedIn && !hasAuthError && (
                            <Text className="text-sm text-red-200">
                                Conectado como {session.data.user?.email}
                            </Text>
                        )}
                        <Button
                            className="mt-4"
                            type="submit"
                            onClick={handleNavigatorToNextStep}
                            disabled={!isSignedIn || hasAuthError}
                        >
                            Próximo Passo <ArrowRight />
                        </Button>
                    </div>
                </Box>
            </div>
        </>
    );
}
