import { FormEvent, useState } from "react";
import { Button } from "../components/Button";
import { Checkbox } from "../components/Checkbox";
import { Heading } from "../components/Heading";
import { Logo } from "../components/Logo";
import { Text } from "../components/Text";
import { TextInput } from "../components/TextInput";
import { Envelope, Lock } from "phosphor-react";
import { Box } from "../components/Box";

export default function Home() {
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);

    function handleSignIn(event: FormEvent) {
        event.preventDefault();

        setIsUserSignedIn(true);
    }

    return (
        <div className="h-screen w-screen p-4 flex-col flex justify-center text-gray-100 items-center bg-gray-900">
            <Box className="max-w-md w-full flex  flex-col items-center">
                <header className="flex flex-col items-center">
                    <Logo className="" />

                    <Heading className="mt-4 text-4xl">
                        Ignite Lab
                    </Heading>
                    <Text className="text-gray-400 mt-1">
                        Faça login e comece a usar
                    </Text>
                </header>

                <form
                    onSubmit={handleSignIn}
                    className="flex flex-col items-stretch w-full max-w-sm mt-10 gap-4"
                >
                    {isUserSignedIn && <Text>Login Realizado</Text>}

                    <label htmlFor="email" className="flex flex-col gap-1">
                        <Text className="text-sm">
                            Seu e-mail
                        </Text>
                        <TextInput.Root>
                            <TextInput.Icon>
                                <Envelope />
                            </TextInput.Icon>
                            <TextInput.Input
                                id="email"
                                placeholder="Digite seu e-mail"
                            />
                        </TextInput.Root>
                    </label>

                    <label htmlFor="password" className="flex flex-col gap-1">
                        <Text className="text-sm">Sua senha</Text>
                        <TextInput.Root>
                            <TextInput.Icon>
                                <Lock />
                            </TextInput.Icon>
                            <TextInput.Input
                                type="password"
                                id="password"
                                placeholder="******"
                            />
                        </TextInput.Root>
                    </label>

                    <label
                        htmlFor="remember"
                        className="flex items-center gap-2"
                    >
                        <Checkbox id="remember" />
                        <Text className="text-gray-200">
                            Lembrar de mim por 30 dias
                        </Text>
                    </label>

                    <Button className="mt-4" type="submit">
                        Entrar na plataforma
                    </Button>
                </form>

                <footer className="flex flex-col items-center gap-4 mt-8">
                    <Text asChild>
                        <a
                            href=""
                            className="text-gray-400 hover:underline hover:text-gray-200"
                        >
                            Esqueceu sua senha?
                        </a>
                    </Text>

                    <Text asChild>
                        <a
                            href=""
                            className="text-gray-400 hover:underline hover:text-gray-200"
                        >
                            Não possuí conta? crie uma agora!
                        </a>
                    </Text>
                </footer>
            </Box>
        </div>
    );
}
