import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import ModuleRoutes from './routes/moduleRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import QuizRoutes from './routes/quizRoutes.js';
import questionRoutes from './routes/questionRoutes.js';

import { notFound, errorHandler } from './middleware/error.js';
import './config/db.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes); 
app.use('/api/categories', categoryRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/modules', ModuleRoutes);
app.use('/api/lessons',lessonRoutes);
app.use('/api/quizzes',QuizRoutes);
app.use('/api/questions', questionRoutes);


// Health check
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;