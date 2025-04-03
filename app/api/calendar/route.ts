"use server";

import { authenticateRequest } from '@/utils/auth';

export async function GET(request: Request): Promise<Response> {
  const { user, error, status } = await authenticateRequest(request);

  if (error) {
    return Response.json({ error }, { status });
  }

  return Response.json({ message: 'Authenticated!', user });
}
