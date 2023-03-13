import { prisma } from '@/src/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { setCookie } from 'nookies'
import { buildNextAuthOptions } from '../auth/[...nextauth]';
import { number, z } from 'zod';


const TimeIntervalsBodySchema = z.object({
    intervals: z.array(z.object({
        weekDay: z.number(),
        startTimeInMinutes: number(),
        endTimeInMinutes: number()
    }))
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(405).end()
    }


    const session = await getServerSession(req, res, buildNextAuthOptions(req, res))

    if (!session) {
        return res.status(401).end();
    }

    const { intervals } = TimeIntervalsBodySchema.parse(req.body);


    await prisma.userTimeInterval.deleteMany({
        where: {
            user_id: session.user.id
        }
    })


    await Promise.all(intervals.map(intervals => {
        return prisma.userTimeInterval.create({
            data: {
                week_day: intervals.weekDay,
                time_start_in_minutes: intervals.startTimeInMinutes,
                time_end_in_minutes: intervals.endTimeInMinutes,
                user_id: session.user.id
            }
        })
    }))

    return res.status(201).end()
}
