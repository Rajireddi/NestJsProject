import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Payment } from './payments/entities/payment.entity';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testConnection() {
  console.log('Testing database connection...');
  
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Manohar@141',
    database: process.env.DB_NAME || 'poc',
    entities: [User, Payment],
    synchronize: process.env.DB_SYNC === 'true',
    logging: process.env.DB_LOGGING === 'true',
  });

  try {
    // Attempt to connect to the database
    await dataSource.initialize();
    console.log('✅ Database connection successful!');
    
    // Get repository instances
    const userRepository = dataSource.getRepository(User);
    const paymentRepository = dataSource.getRepository(Payment);
    
    // Fetch all users
    console.log('\n--- Fetching Users ---');
    const users = await userRepository.find();
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
    });
    
    // Fetch all payments
    console.log('\n--- Fetching Payments ---');
    const payments = await paymentRepository.find();
    console.log(`Found ${payments.length} payments:`);
    payments.forEach(payment => {
      console.log(`  - ID: ${payment.id}, Amount: ${payment.amount}, Currency: ${payment.currency}`);
    });
    
    // Close the connection
    await dataSource.destroy();
    console.log('\n✅ Database connection closed.');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Tip: Check your database credentials in the .env file');
      console.log('   Make sure the password for the postgres user is correct');
    } else if (error.message.includes('connect ECONNREFUSED')) {
      console.log('\n💡 Tip: PostgreSQL server might not be running');
      console.log('   Make sure PostgreSQL is installed and running on your system');
    }
  }
}

testConnection();