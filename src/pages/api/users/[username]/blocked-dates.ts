import { prisma } from "@/src/lib/prisma"
import dayjs from "dayjs"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') {
        return res.status(405).end()
    }


    const username = String(req.query.username)
    const year = String(req.query.year) // http://localhost:3333/api/users/devmaicon/availability?date=2022-12-20
    const month = String(req.query.month).padStart(2, "0") // 03 (março)

    if (!year || !month) {
        return res.status(400).json({ message: 'Year or month not specified' })
    }


    const user = await prisma.user.findUnique({
        where: {
            username
        }
    })

    if (!user) {
        return res.status(400).json({ message: 'User does not exist.' })

    }

    const availableWeekDays = await prisma.userTimeInterval.findMany({
        select: {
            week_day: true,
        },
        where: {
            user_id: user.id
        }
    })

    const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter(weekDay => {
        return !availableWeekDays.some(availableWeekDays => availableWeekDays.week_day === weekDay)
    })





    const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
        SELECT 
            EXTRACT(DAY FROM S.date) as date,
            COUNT(S.date) as amount,
            ((UTI.time_end_in_minutes - UTI.time_start_in_minutes)/60) as size

        FROM schedulings S

        LEFT JOIN user_time_intervals UTI
            ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))

        WHERE S.user_id = ${user.id}
            AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`}

        GROUP BY EXTRACT(DAY FROM S.date),
        ((UTI.time_end_in_minutes - UTI.time_start_in_minutes)/60)

        HAVING amount >= size
    `
    const blockedDates = blockedDatesRaw.map(item => item.date)

    return res.json({ blockedWeekDays, blockedDates })
}
