import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { liveClassValidationSchema } from 'validationSchema/live-classes';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getLiveClasses();
    case 'POST':
      return createLiveClass();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getLiveClasses() {
    const data = await prisma.live_class
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'live_class'));
    return res.status(200).json(data);
  }

  async function createLiveClass() {
    await liveClassValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.live_class.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
