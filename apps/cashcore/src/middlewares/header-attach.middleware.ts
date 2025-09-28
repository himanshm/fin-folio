import { readJsonFile } from '@fin-folio/config';
import type { NextFunction, Response } from 'express';
import type { CustomRequest } from 'types/logger.types.ts';
import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware to attach a unique session ID to the request and response headers.
 */

export const attachRequestId = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): void => {
    req.sessionId =
        (Array.isArray(req.headers['x-session-id'])
            ? req.headers['x-session-id'][0]
            : req.headers['x-session-id']) || uuidv4();

    res.setHeader('x-session-id', req.sessionId);
    next();
};

/**
 * Middleware to attach the application version to the request and response headers.
 */
export const attachAppVersion = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): void => {
    const { version } = readJsonFile<{ version: string }>(
        import.meta.url,
        '../../package.json'
    );

    req.appVersion =
        (Array.isArray(req.headers['app-version'])
            ? req.headers['app-version'][0]
            : req.headers['app-version']) || version;

    res.setHeader('app-version', req.appVersion as string);
    next();
};
