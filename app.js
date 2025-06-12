import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import './config/passport.js';
import passport from 'passport';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import ModuleRoutes from './routes/moduleRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import QuizRoutes from './routes/quizRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';


import { notFound, errorHandler } from './middleware/error.js';
import './config/db.js';

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // max requests per IP
  message: 'Too many requests, please try again later',
});

app.use(limiter);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  //allow credentials (cookies, authorization headers)
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax'
}
 // true only with HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes); 
app.use('/api/categories', categoryRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/modules', ModuleRoutes);
app.use('/api/lessons',lessonRoutes);
app.use('/api/quizzes',QuizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);



// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    authenticated: !!req.user,
    user: req.user || null,
  });
});
// passport flow track
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log('Session:', req.session);
    console.log('User:', req.user);
    next();
  });
}


// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;