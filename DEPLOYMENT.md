# Deployment Guide

Complete guide for deploying the Moodle LMS Wrapper to production.

## 🚀 Quick Production Deployment

### Prerequisites
- Docker and Docker Compose installed
- Domain name configured
- SSL certificates (Let's Encrypt recommended)
- Production Moodle instance with API access

### 1. Clone and Configure

```bash
# Clone repository
git clone https://github.com/your-org/Moodle-LMS.git
cd Moodle-LMS

# Copy production environment template
cp .env.prod.example .env

# Edit with production values
nano .env
```

### 2. Configure Environment Variables

Edit `.env` with your production values:

```env
# Strong database password
DB_PASSWORD=your_strong_db_password_here

# Strong JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_at_least_32_chars

# Your production Moodle instance
MOODLE_BASE_URL=https://moodle.yourdomain.com
MOODLE_WS_TOKEN=your_production_token

# Your frontend domain
CORS_ORIGIN=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com/api
```

### 3. SSL Certificates

```bash
# Create SSL directory
mkdir -p nginx/ssl

# Option A: Let's Encrypt (recommended)
certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com

# Copy certificates
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem

# Option B: Self-signed (development only)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem
```

### 4. Deploy with Docker Compose

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check health
docker-compose -f docker-compose.prod.yml ps
```

### 5. Verify Deployment

```bash
# Check backend health
curl https://api.yourdomain.com/health

# Check frontend
curl https://yourdomain.com/health

# Test API
curl https://api.yourdomain.com/api/health
```

## 🔒 Security Checklist

### Before Going Live

- [ ] Change all default passwords
- [ ] Generate strong JWT secret (32+ characters)
- [ ] Configure SSL/TLS certificates
- [ ] Enable HTTPS only (no HTTP)
- [ ] Set up firewall rules
- [ ] Configure rate limiting
- [ ] Enable CORS for specific domains only
- [ ] Set secure session cookies
- [ ] Disable development features
- [ ] Enable logging and monitoring
- [ ] Set up automated backups
- [ ] Configure intrusion detection
- [ ] Review and limit API permissions
- [ ] Enable database connection encryption
- [ ] Set up DDoS protection (Cloudflare, AWS Shield)

### Backend Security

```env
# .env production settings
NODE_ENV=production
LOG_LEVEL=warn
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Security

```bash
# Create database with secure settings
psql -U postgres << EOF
CREATE DATABASE moodle_wrapper_prod;
CREATE USER moodle_prod WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE moodle_wrapper_prod TO moodle_prod;
EOF

# Enable SSL connections
# Edit postgresql.conf:
ssl = on
ssl_cert_file = '/path/to/cert.pem'
ssl_key_file = '/path/to/key.pem'
```

## 🌐 DNS Configuration

### Setup DNS Records

```
# A Records
yourdomain.com          A    your.server.ip.address
api.yourdomain.com      A    your.server.ip.address

# Optional: WWW redirect
www.yourdomain.com      CNAME    yourdomain.com
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/moodle-lms
            git pull origin main
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml up -d --build
```

## 📊 Monitoring & Logging

### Setup Logging

```bash
# View real-time logs
docker-compose -f docker-compose.prod.yml logs -f

# Backend logs only
docker-compose -f docker-compose.prod.yml logs -f backend

# Export logs
docker-compose -f docker-compose.prod.yml logs --no-color > logs.txt
```

### Monitoring Tools

**Recommended:**
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry, Rollbar
- **Performance**: New Relic, DataDog
- **Logs**: ELK Stack, Papertrail

### Health Checks

```bash
# Create monitoring script
cat > /usr/local/bin/check-health.sh << 'EOF'
#!/bin/bash
curl -f https://yourdomain.com/health || exit 1
curl -f https://api.yourdomain.com/health || exit 1
EOF

chmod +x /usr/local/bin/check-health.sh

# Add to crontab
*/5 * * * * /usr/local/bin/check-health.sh || mail -s "LMS Health Check Failed" admin@yourdomain.com
```

## 💾 Backup Strategy

### Automated Backups

```bash
# Create backup script
cat > /usr/local/bin/backup-lms.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/moodle-lms"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker exec moodle_wrapper_postgres_prod pg_dump -U moodle_prod moodle_wrapper_prod | \
  gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup uploads
docker cp moodle_wrapper_backend_prod:/app/uploads $BACKUP_DIR/uploads_$DATE

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

# Upload to S3 (optional)
# aws s3 sync $BACKUP_DIR s3://your-backup-bucket/moodle-lms/
EOF

chmod +x /usr/local/bin/backup-lms.sh

# Schedule daily backups
crontab -e
0 2 * * * /usr/local/bin/backup-lms.sh
```

### Restore from Backup

```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Restore database
gunzip < /backups/moodle-lms/db_20260228_020000.sql.gz | \
  docker exec -i moodle_wrapper_postgres_prod psql -U moodle_prod moodle_wrapper_prod

# Restore uploads
docker cp /backups/moodle-lms/uploads_20260228_020000 \
  moodle_wrapper_backend_prod:/app/uploads

# Restart services
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Performance Optimization

### Database Optimization

```sql
-- Create indexes for common queries
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_role ON "user"(role);
CREATE INDEX idx_student_log_timestamp ON student_log(timestamp);
CREATE INDEX idx_student_log_action ON student_log(action);
CREATE INDEX idx_payment_user ON payment(user_id);

-- Enable query logging for slow queries
ALTER DATABASE moodle_wrapper_prod SET log_min_duration_statement = 1000;
```

### Nginx Caching

Add to `nginx.conf`:

```nginx
# Cache configuration
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m;

location /api {
    proxy_cache api_cache;
    proxy_cache_valid 200 10m;
    proxy_cache_valid 404 1m;
    proxy_cache_bypass $http_cache_control;
    add_header X-Cache-Status $upstream_cache_status;
    
    proxy_pass http://backend:5000;
}
```

### CDN Integration

Use Cloudflare or AWS CloudFront for:
- Static asset caching
- DDoS protection
- SSL termination
- Global distribution

## 🚨 Troubleshooting

### Common Issues

**Container won't start:**
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs backend

# Rebuild
docker-compose -f docker-compose.prod.yml up -d --build
```

**Database connection errors:**
```bash
# Check database is running
docker-compose -f docker-compose.prod.yml ps postgres

# Test connection
docker exec -it moodle_wrapper_postgres_prod psql -U moodle_prod moodle_wrapper_prod
```

**SSL certificate issues:**
```bash
# Verify certificates
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Test SSL connection
openssl s_client -connect yourdomain.com:443
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Scale backend if needed
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

## 📱 Mobile App (Optional)

For a React Native mobile app:

```bash
# Clone mobile app template
# npx react-native init MoodleLMSApp

# Configure API endpoint
# Edit .env in mobile app:
API_URL=https://api.yourdomain.com/api
```

## 🔄 Updates & Maintenance

### Rolling Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart with zero downtime
docker-compose -f docker-compose.prod.yml up -d --build --no-deps backend
docker-compose -f docker-compose.prod.yml up -d --build --no-deps frontend
```

### Database Migrations

```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npm run migration:run

# Rollback if needed
docker-compose -f docker-compose.prod.yml exec backend npm run migration:revert
```

## 🎯 Scaling

### Horizontal Scaling

```yaml
# docker-compose.prod.yml
services:
  backend:
    # ... existing config
    deploy:
      mode: replicated
      replicas: 3
```

### Load Balancer

Add nginx load balancer:

```nginx
upstream backend_servers {
    least_conn;
    server backend_1:5000;
    server backend_2:5000;
    server backend_3:5000;
}

server {
    location /api {
        proxy_pass http://backend_servers;
    }
}
```

## 📧 Support

For deployment issues:
- Check logs: `docker-compose logs`
- Review documentation
- Open GitHub issue
- Contact: support@yourdomain.com

---

**🎉 Congratulations! Your Moodle LMS Wrapper is now deployed!**
