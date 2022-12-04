/* eslint-disable import/no-unresolved */
import { Request, Response, NextFunction } from 'express';
import { StatsD } from 'hot-shots';

import config from '../config';

const datadogEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (config.enviroment === 'development') {
    return next();
  }
  res.on('finish', function() {
    const dogstatsd = new StatsD();
    dogstatsd.event(`${req.method} ${req.url} ${this.statusCode}`, '', {
      alert_type: this.statusCode >= 500 ? 'error' : 'info',
    });
  });
  return next();
};

export default datadogEvent;
