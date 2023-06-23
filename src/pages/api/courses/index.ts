import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { courseValidationSchema } from 'validationSchema/courses';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getCourses();
    case 'POST':
      return createCourse();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCourses() {
    const data = await prisma.course
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'course'));
    return res.status(200).json(data);
  }

  async function createCourse() {
    await courseValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.live_class?.length > 0) {
      const create_live_class = body.live_class;
      body.live_class = {
        create: create_live_class,
      };
    } else {
      delete body.live_class;
    }
    if (body?.recorded_class?.length > 0) {
      const create_recorded_class = body.recorded_class;
      body.recorded_class = {
        create: create_recorded_class,
      };
    } else {
      delete body.recorded_class;
    }
    if (body?.subscription?.length > 0) {
      const create_subscription = body.subscription;
      body.subscription = {
        create: create_subscription,
      };
    } else {
      delete body.subscription;
    }
    const data = await prisma.course.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
