import { Heading } from "../components/Heading";
import { Text } from "../components/Text";

import previewImage from "../assets/app-preview.png";
import Image from "next/image";
import { ClaimUsernameForm } from "../components/structure/ClaimUsernameForm";
import { MultiStep } from "../components/MultiStep";
import { NextSeo } from "next-seo";

export default function Home() {
    return (
        <>
            <NextSeo
                title="Descomplique sua agenda | Ignite Call"
                description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre"
            />
            <div className="flex flex-col md:flex-row h-screen items-center ml-auto gap-5 w-screen justify-center ">
                <div className="md:max-w-lg p-10 flex flex-col gap-5">
                    <Heading className="md:text-6xl text-4xl">
                        Agendamento descomplicado
                    </Heading>
                    <Text className="md:text-xl text-lg ">
                        Conecte seu calendário e permita que as pessoas marquem
                        agendamentos no seu tempo livre.
                    </Text>
                    <ClaimUsernameForm />
                </div>
                <div className="p-4 ">
                    <Image
                        src={previewImage}
                        alt="Calendário simbolizando aplicação em funcionamento"
                        height={400}
                        quality={100}
                        priority={true}
                    />
                </div>
            </div>
        </>
    );
}
