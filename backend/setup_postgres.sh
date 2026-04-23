#!/bin/bash
# Setup PostgreSQL database for Air Quality Prediction System

echo "🔧 Setting up PostgreSQL database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed!"
    echo "Install with: sudo apt install postgresql postgresql-contrib"
    exit 1
fi

# Check if PostgreSQL service is running
if ! sudo systemctl is-active --quiet postgresql; then
    echo "⚠️  PostgreSQL service is not running. Starting..."
    sudo systemctl start postgresql
fi

echo "✅ PostgreSQL is running"

# Create database and user
echo "📦 Creating database and user..."

sudo -u postgres psql << EOF
-- Create database
DROP DATABASE IF EXISTS airquality_db;
CREATE DATABASE airquality_db;

-- Create user (if not exists)
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'postgres') THEN
        CREATE USER postgres WITH PASSWORD 'password';
    END IF;
END
\$\$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE airquality_db TO postgres;

-- Connect to database and grant schema privileges
\c airquality_db
GRANT ALL ON SCHEMA public TO postgres;

EOF

echo "✅ Database 'airquality_db' created successfully!"
echo "✅ User 'postgres' configured with password 'password'"
echo ""
echo "📝 Database connection string:"
echo "   postgresql://postgres:password@localhost/airquality_db"
echo ""
echo "🚀 You can now start the backend server!"
echo "   cd backend && source venv/bin/activate && python run.py"
