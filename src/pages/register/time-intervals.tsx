import { Button } from "../../components/Button";
import { Heading } from "../../components/Heading";
import { Text } from "../../components/Text";
import { TextInput } from "../../components/TextInput";
import { ArrowRight, Hourglass, Lock, UserCircle } from "phosphor-react";
import { Box } from "../../components/Box";
import { MultiStep } from "../../components/MultiStep";
import { z } from "zod";
import { useRouter } from "next/router";
import { Checkbox } from "@/src/components/Checkbox";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { getWeekDays } from "@/src/utils/get-week-day";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertTimeStringToMinutes } from "../../utils/convert-time-string-to-minutes";
import { api } from "@/src/lib/axios";
import { NextSeo } from "next-seo";

const timeIntervalsFormSchema = z.object({
    intervals: z
        .array(
            z.object({
                weekDay: z.number().min(0).max(6),
                enabled: z.boolean(),
                startTime: z.string(),
                endTime: z.string(),
            })
        )
        .length(7)
        .transform((intervals) =>
            intervals.filter((interval) => interval.enabled)
        )
        .refine((intervals) => intervals.length > 0, {
            message: "Selecione pelo menos um dia da semana!",
        })
        .transform((intervals) => {
            return intervals.map((interval) => {
                return {
                    weekDay: interval.weekDay,
                    startTimeInMinutes: convertTimeStringToMinutes(
                        interval.startTime
                    ),
                    endTimeInMinutes: convertTimeStringToMinutes(
                        interval.endTime
                    ),
                };
            });
        })
        .refine(
            (intervals) => {
                return intervals.every(
                    (interval) =>
                        interval.endTimeInMinutes -
                            interval.startTimeInMinutes >=
                        60
                );
            },
            {
                message:
                    "O horáro de término deve ter no mínimo 1h do horário de ínicio",
            }
        ),
});

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>;
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>;

export default function TimeIntervals() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { isSubmitting, errors },
    } = useForm<TimeIntervalsFormInput>({
        resolver: zodResolver(timeIntervalsFormSchema),
        defaultValues: {
            intervals: [
                {
                    weekDay: 0,
                    enabled: false,
                    startTime: "09:00",
                    endTime: "18:00",
                },
                {
                    weekDay: 1,
                    enabled: true,
                    startTime: "09:00",
                    endTime: "18:00",
                },
                {
                    weekDay: 2,
                    enabled: true,
                    startTime: "09:00",
                    endTime: "18:00",
                },
                {
                    weekDay: 3,
                    enabled: true,
                    startTime: "09:00",
                    endTime: "18:00",
                },
                {
                    weekDay: 4,
                    enabled: true,
                    startTime: "09:00",
                    endTime: "18:00",
                },
                {
                    weekDay: 5,
                    enabled: true,
                    startTime: "09:00",
                    endTime: "18:00",
                },
                {
                    weekDay: 6,
                    enabled: false,
                    startTime: "09:00",
                    endTime: "18:00",
                },
            ],
        },
    });

    const weekDays = getWeekDays();

    const { fields } = useFieldArray({
        control,
        name: "intervals",
    });

    const intervals = watch("intervals");

    async function handleSetTimeIntervals(data: any) {
        const { intervals } = data as TimeIntervalsFormOutput;

        await api.post("/users/time-intervals", {
            intervals,
        });

        await router.push("/register/update-profile");
    }

    return (
        <>
            <NextSeo
                title="Selecione sua disponibilidade | Ignite Call"
                noindex
            />
            <div className="h-screen  max-w-lg w-full m-auto p-4 flex-col flex justify-center text-gray-100 items-center bg-gray-900">
                <header className="flex flex-col items-center">
                    <Heading as="strong" className="mt-4 text-3xl">
                        Quase lá
                    </Heading>

                    <Text className="text-gray-400 mt-2 mb-8">
                        Defina o intervalo de horários que você está disponível
                        em cada dia da semana.
                    </Text>
                </header>

                <MultiStep size={4} currentStep={3} />

                <Box className="w-full mt-8 flex flex-col items-center">
                    <form
                        onSubmit={handleSubmit(handleSetTimeIntervals)}
                        className="flex flex-col items-stretch w-full gap-4"
                    >
                        {fields.map((field, index) => {
                            return (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-[1fr,auto] p-2 items-center border rounded-md border-gray-600"
                                >
                                    <div className=" gap-2 items-center  flex">
                                        <Controller
                                            name={`intervals.${index}.enabled`}
                                            control={control}
                                            render={({ field }) => {
                                                return (
                                                    <Checkbox
                                                        onCheckedChange={(
                                                            checked
                                                        ) => {
                                                            field.onChange(
                                                                checked === true
                                                            );
                                                        }}
                                                        checked={field.value}
                                                    />
                                                );
                                            }}
                                        />
                                        {weekDays[field.weekDay]}
                                    </div>
                                    <div className="flex gap-2">
                                        <TextInput.Root>
                                            <TextInput.Input
                                                disabled={
                                                    !intervals[index].enabled
                                                }
                                                type="time"
                                                step={60}
                                                {...register(
                                                    `intervals.${index}.startTime`
                                                )}
                                            />
                                        </TextInput.Root>
                                        <TextInput.Root>
                                            <TextInput.Input
                                                disabled={
                                                    !intervals[index].enabled
                                                }
                                                type="time"
                                                step={60}
                                                {...register(
                                                    `intervals.${index}.endTime`
                                                )}
                                            />
                                        </TextInput.Root>
                                    </div>
                                </div>
                            );
                        })}

                        {errors.intervals && (
                            <Text className="text-xs text-red-200">
                                {errors.intervals.message}
                            </Text>
                        )}

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
