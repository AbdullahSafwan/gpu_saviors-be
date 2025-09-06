interface RequiredEnvVars {
  JWT_ACCESS_KEY_SECRET: string;
  JWT_REFRESH_KEY_SECRET: string;
  DATABASE_URL: string;
  EMAIL_USERNAME: string;
  EMAIL_PASSWORD: string;
  NODE_ENV: string;
  PORT: string;
}

const requiredEnvVars: (keyof RequiredEnvVars)[] = [
  'JWT_ACCESS_KEY_SECRET',
  'JWT_REFRESH_KEY_SECRET', 
  'DATABASE_URL',
  'EMAIL_USERNAME',
  'EMAIL_PASSWORD',
  'NODE_ENV',
  'PORT'
];

export const validateEnvironment = (): void => {
  const missingVars: string[] = [];
  
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  });

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    process.exit(1);
  }

  // Additional validation for specific vars
  if (process.env.JWT_ACCESS_KEY_SECRET!.length < 32) {
    console.error('JWT_ACCESS_KEY_SECRET must be at least 32 characters long');
    process.exit(1);
  }

  if (!process.env.DATABASE_URL!.startsWith('mysql://')) {
    console.error('DATABASE_URL must be a valid MySQL connection string');
    process.exit(1);
  }

  console.log('Environment variables validated successfully');
};