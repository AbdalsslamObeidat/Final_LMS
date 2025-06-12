import dotenv from 'dotenv';
import app from './app.js';


dotenv.config();

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`Server running in ${ENV} mode on port ${PORT}`);
});