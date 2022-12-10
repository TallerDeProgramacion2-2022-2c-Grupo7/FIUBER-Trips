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
    try {
      const dogstatsd = new StatsD({ host: 'dd-agent', port: 8125 });
      dogstatsd.event(
        `${req.method} ${req.baseUrl}${req.url} ${this.statusCode}`,
        '',
        {
          alert_type: this.statusCode >= 500 ? 'error' : 'info',
        },
        ['app_name:fiuber-trips']
      );
    } catch (error) {
      console.log(error);
    }
  });
  return next();
};

export default datadogEvent;
