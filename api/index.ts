import type { Request, Response } from 'express';
import app, { serverReady } from '../server';

export default async function handler(req: Request, res: Response) {
  await serverReady;
  return (app as any)(req, res);
}
