import { prisma } from "@/src/lib/prisma"
import dayjs from "dayjs"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') {
        return res.status(405).end()
    }


    const username = String(req.query.username)
    const { date } = req.query // http://localhost:3333/api/users/devmaicon/availability?date=2022-12-20


    if (!date) {
        return res.status(400).json({ message: 'Date not provided' })
    }


    const user = await prisma.user.findUnique({
        where: {
            username
        }
    })

    if (!user) {
        return res.status(400).json({ message: 'User does not exist.' })

    }

    const referenceDate = dayjs(String(date))
    const isPastDate = referenceDate.endOf("day").isBefore(new Date())

    if (isPastDate) {
        return res.json({ availability: [], possibleTimes: [] })
    }

    const userAvailability = await prisma.userTimeInterval.findFirst({
        where: {
            user_id: user.id,
            week_day: referenceDate.get('day')
        }
    })

    if (!userAvailability) {
        return res.json({ availability: [], possibleTimes: [] })
    }

    const { time_start_in_minutes, time_end_in_minutes } = userAvailability

    const startHour = time_start_in_minutes / 60;
    const endHour = time_end_in_minutes / 60;

    const possibleTimes = Array.from({ length: endHour - startHour }).map((_, i) => {
        return startHour + i
    })


    const blockedTimes = await prisma.scheduling.findMany({
        select: {
            date: true
        },
        where: {
            user_id: user.id,
            date: {
                gte: referenceDate.set('hour', startHour).toDate(),  // maior ou igual a 
                lte: referenceDate.set('hour', endHour).toDate(),  // menor ou igual a 
            }
        }
    })

    


    const availableTimes = possibleTimes.filter(time => {

        const isTimeBlocked = blockedTimes.some(blockedTime => blockedTime.date.getHours() === time)

        const isTimeInPast = referenceDate.set('hour', time).isBefore(new Date())

        return !isTimeBlocked && !isTimeInPast;
    })


    return res.json({ possibleTimes, availableTimes })
}
