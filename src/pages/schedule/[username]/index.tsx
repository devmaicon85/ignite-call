import { Avatar } from "@/src/components/Avatar";
import { Heading } from "@/src/components/Heading";
import { Text } from "@/src/components/Text";
import { GetStaticPaths, GetStaticProps } from "next";
import { prisma } from "@/src/lib/prisma";
import { Calendar } from "@/src/components/Calendar";
import { ConfirmStep } from "@/src/components/structures/ConfirmStep";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { api } from "@/src/lib/axios";
import { NextSeo } from "next-seo";

interface ScheduleProps {
    user: {
        name: string;
        bio: string;
        avatarUrl: string;
    };
}

interface BlockedDates {
    blockedWeekDays: number[];
    blockedDates: number[];
}

export default function Schedule({ user }: ScheduleProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

    const router = useRouter();

    const username = String(router.query.username);

    const [currentDate, setCurrentDate] = useState(() => {
        return dayjs().set("date", 1);
    });

    const currentMonth = currentDate.format("MMMM");
    const currentYear = currentDate.format("YYYY");

    const { data: blockedDates } = useQuery<BlockedDates>(
        ["blocked-dates", currentDate.get("year"), currentDate.get("month")],
        async () => {
            const response = await api.get(`/users/${username}/blocked-dates`, {
                params: {
                    year: currentDate.get("year"),
                    month: currentDate.get("month") + 1,
                },
            });

            return response.data;
        }
    );

    function handleClearSelectedDateTime() {
        setSelectedDateTime(null);
    }

    return (
        <>
            <NextSeo title={`Agendar com ${user.name} | Ignite Call`} />

            <div className="h-screen max-w-6xl w-full m-auto p-4 flex-col flex justify-center text-gray-100  bg-gray-900">
                <header className="flex flex-col items-center">
                    <Avatar avatar_url={user.avatarUrl} />
                    <Heading as="strong" className="mt-4 text-center text-3xl">
                        {user.name}
                    </Heading>

                    <Text className="text-gray-400 mt-2 mb-8">{user.bio}</Text>
                </header>

                {!selectedDateTime ? (
                    <Calendar
                        onDateSelected={setSelectedDate}
                        selectedDate={selectedDate}
                        blockedDates={blockedDates}
                        onSelectDateTime={setSelectedDateTime}
                    />
                ) : (
                    <ConfirmStep
                        schedulingDate={selectedDateTime}
                        onClearDateTime={handleClearSelectedDateTime}
                    />
                )}
            </div>
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const username = String(params?.username);

    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    if (!user) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            user: {
                name: user.name,
                bio: user.bio,
                avatarUrl: user.avatar_url,
            },
        },
        revalidate: 60 * 60 * 24, // 1 day
    };
};
