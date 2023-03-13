import { CaretLeft, CaretRight } from "phosphor-react";
import { Text } from "./Text";
import { getWeekDays } from "@/src/utils/get-week-day";
import { ButtonHTMLAttributes, ReactNode, useMemo, useState } from "react";
import { Box } from "@/src/components/Box";
import dayjs from "dayjs";
import { api } from "../lib/axios";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

interface CalendarWeek {
    week: number;
    days: Array<{
        date: dayjs.Dayjs;
        disabled: boolean;
    }>;
}

type CalendarWeeks = CalendarWeek[];

interface CalendarProps {
    selectedDate?: Date | null;
    blockedDates?: BlockedDates;
    onDateSelected: (date: Date) => void;
    onSelectDateTime: (date: Date) => void;
}

interface Availability {
    possibleTimes: number[];
    availableTimes: number[];
}

interface BlockedDates {
    blockedWeekDays: number[];
    blockedDates: number[];
}

export function Calendar({
    onDateSelected,
    selectedDate,
    blockedDates,
    onSelectDateTime,
}: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(() => {
        return dayjs().set("date", 1);
    });

    // const [availability, setAvailability] = useState<Availability | null>(null);
    const router = useRouter();

    const username = String(router.query.username);

    const isDateSelected = !!selectedDate;

    const shortWeekDays = getWeekDays({ short: true });

    const currentMonth = currentDate.format("MMMM");
    const currentYear = currentDate.format("YYYY");

    const calendarWeeks = useMemo(() => {
        if (!blockedDates) {
            return [];
        }
        const daysInMonthArray = Array.from({
            length: currentDate.daysInMonth(),
        }).map((_, i) => {
            return currentDate.set("date", i + 1);
        });

        const firstWeekDay = currentDate.get("day");

        const previousMonth = Array.from({
            length: firstWeekDay,
        })
            .map((_, i) => {
                return currentDate.subtract(i + 1, "day");
            })
            .reverse();

        const lastDayInCurrentMoth = currentDate.set(
            "date",
            currentDate.daysInMonth()
        );

        const lastWeekDay = lastDayInCurrentMoth.get("day");

        const nextMothFillArray = Array.from({
            length: 7 - (lastWeekDay + 1),
        }).map((_, i) => {
            return lastDayInCurrentMoth.add(i + 1, "day");
        });

        const disabledDays = (date: dayjs.Dayjs) =>
            date.endOf("day").isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(date.get("day")) === true ||
            blockedDates.blockedDates.includes(date.get("date")) === true;

        const calendarDay = [
            ...previousMonth.map((date) => {
                return { date, disabled: true };
            }),
            ...daysInMonthArray.map((date) => {
                return {
                    date,
                    disabled: disabledDays(date),
                };
            }),
            ...nextMothFillArray.map((date) => {
                return { date, disabled: true };
            }),
        ];

        const calendarWeeks = calendarDay.reduce<CalendarWeeks>(
            (weeks, _, i, original) => {
                const isNewWeek = i % 7 === 0;

                if (isNewWeek) {
                    weeks.push({
                        week: i / 7 + 1,
                        days: original.slice(i, i + 7),
                    });
                }

                return weeks;
            },
            []
        );

        return calendarWeeks;
    }, [blockedDates, currentDate]);

    function handlePreviousMonth() {
        const previousMonthDate = currentDate.subtract(1, "M");
        setCurrentDate(previousMonthDate);
    }
    function handleNextMonth() {
        const previousMonthDate = currentDate.add(1, "M");
        setCurrentDate(previousMonthDate);
    }

    function handleSelectTime(hour: number) {
        const dateWithTime = dayjs(selectedDate)
            .set("hour", hour)
            .startOf("hour")
            .toDate();

        onSelectDateTime(dateWithTime);
    }

    const selectedDateWithoutTime = selectedDate
        ? dayjs(selectedDate).format("YYYY-MM-DD")
        : null;

    const { data: availability } = useQuery<Availability>(
        ["availability", selectedDateWithoutTime],
        async () => {
            const response = await api.get(`/users/${username}/availability`, {
                params: {
                    date: selectedDateWithoutTime,
                },
            });

            return response.data;
        },
        {
            enabled: !!selectedDate,
        }
    );
    // useEffect(() => {
    //     if (!selectedDate) {
    //         return;
    //     }

    //     api.get(`/users/${username}/availability`, {
    //         params: {
    //             date: dayjs(selectedDate).format("YYYY-MM-DD"),
    //         },
    //     }).then((response) => {
    //         setAvailability(response.data);
    //     });
    // }, [selectedDate, username]);

    const weekDay = selectedDate ? dayjs(selectedDate).format("dddd") : null;
    const describedDate = selectedDate
        ? dayjs(selectedDate).format("DD[ de ]MMMM")
        : null;

    return (
        <Box
            className={`max-w-lg  m-auto mt-4 flex flex-col items-center 
            ${isDateSelected && "md:max-w-[792px]"} `}
        >
            <div className="grid grid-cols-1 max-w-lg md:grid-cols-[1fr,auto] md:max-w-4xl relative">
                <div className="flex flex-col gap-6 sm:p-3">
                    <div className="flex items-end justify-between">
                        <Text className="font-medium capitalize">
                            {currentMonth}{" "}
                            <span className="text-gray-200">{currentYear}</span>
                        </Text>
                        <div className="flex gap-2 text-gray-200">
                            <button
                                onClick={handlePreviousMonth}
                                className="cursor-pointer leading-none rounded-sm hover:text-gray-100 border border-transparent focus:border-gray-100 "
                            >
                                <CaretLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleNextMonth}
                                className="cursor-pointer leading-none rounded-sm hover:text-gray-100 border border-transparent focus:border-gray-100"
                            >
                                <CaretRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <table className="w-full border-spacing-1 table-fixed">
                        <thead className="text-gray-200 font-medium text-sm border-b-[0.75rem] border-gray-800 ">
                            <tr className="">
                                {shortWeekDays.map((weekDay) => (
                                    <th key={weekDay}>{weekDay}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {calendarWeeks.map(({ week, days }) => {
                                return (
                                    <tr key={week}>
                                        {days.map(({ date, disabled }) => {
                                            return (
                                                <td key={date.get("D")}>
                                                    <ButtonDay
                                                        onClick={() =>
                                                            onDateSelected(
                                                                date.toDate()
                                                            )
                                                        }
                                                        disabled={disabled}
                                                    >
                                                        {date.get("D")}
                                                    </ButtonDay>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {isDateSelected && (
                    <div className="md:w-[280px] sm:p-3 border-l border-gray-600 bg-gray-800">
                        <div className="text-gray-200 font-bold">
                            {weekDay} {" • "}
                            <span className="font-normal">{describedDate}</span>
                        </div>
                        <div className="overflow-y-scroll flex w-[280px] flex-col absolute top-10 gap-2 p-1 bottom-0">
                            {availability?.possibleTimes.map((hour) => {
                                return (
                                    <TimePickerItem
                                        onClick={() => handleSelectTime(hour)}
                                        key={hour}
                                        disabled={
                                            !availability.availableTimes.includes(
                                                hour
                                            )
                                        }
                                    >
                                        {String(hour).padStart(2, "0")}:00h
                                    </TimePickerItem>
                                );
                            })}
                            {}
                        </div>
                    </div>
                )}
            </div>
        </Box>
    );
}

interface TimePickerItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    disabled?: boolean;
}
function TimePickerItem({ children, disabled, ...rest }: TimePickerItemProps) {
    return (
        <button
            disabled={disabled}
            {...rest}
            className="w-full h-10 rounded-md py-2 disabled:cursor-default disabled:bg-transparent disabled:opacity-30 hover:disabled:bg-none hover:bg-gray-500 aspect-square bg-gray-600 text-center cursor-pointer border border-gray-600 focus:border-gray-100"
        >
            {children}
        </button>
    );
}

interface ButtonDayProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}
function ButtonDay({ children, ...rest }: ButtonDayProps) {
    return (
        <button
            {...rest}
            className="w-full rounded-lg disabled:cursor-default disabled:bg-transparent disabled:opacity-30 hover:disabled:bg-none hover:bg-gray-500 aspect-square bg-gray-600 text-center cursor-pointer focus:border focus:border-gray-100"
        >
            {children}
        </button>
    );
}
