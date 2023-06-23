import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { recordedClassValidationSchema } from 'validationSchema/recorded-classes';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.recorded_class
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getRecordedClassById();
    case 'PUT':
      return updateRecordedClassById();
    case 'DELETE':
      return deleteRecordedClassById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRecordedClassById() {
    const data = await prisma.recorded_class.findFirst(convertQueryToPrismaUtil(req.query, 'recorded_class'));
    return res.status(200).json(data);
  }

  async function updateRecordedClassById() {
    await recordedClassValidationSchema.validate(req.body);
    const data = await prisma.recorded_class.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteRecordedClassById() {
    const data = await prisma.recorded_class.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
