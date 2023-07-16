import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routers from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

//Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application route
app.use('/api/v1', routers);

app.get('/', async (req: Request, res: Response) => {
  res.send('Server is Working');
});

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

// Global Error handler
app.use(globalErrorHandler);

export default app;
