import { execSync } from 'child_process';

console.log('🚀 Starting CRM Database Setup...\n');

try {
  // Run the setup script
  console.log('📋 Setting up MongoDB collections...');
  execSync('node setup-collections.js', { stdio: 'inherit' });
  
  console.log('\n✅ Setup completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Run: npm start');
  console.log('2. Login with: admin / admin123');
  console.log('3. Start managing your restaurant data');
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}