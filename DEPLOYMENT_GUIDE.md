# Deployment Guide

## Overview
The Diversified Psychological Services website is built with Next.js and is ready for deployment to multiple platforms.

## Pre-Deployment Checklist

- ✅ Supabase project created and configured
- ✅ Database schema deployed
- ✅ Environment variables configured
- ✅ Admin accounts created
- ✅ Public pages tested
- ✅ Admin panel tested
- ✅ All content reviewed and approved

---

## Option 1: Deploy to Vercel (Recommended)

Vercel is the official Next.js hosting platform with zero-config deployments.

### Prerequisites
- GitHub account with the project repository
- Supabase project configured

### Steps

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/diversified-psych.git
git push -u origin main
```

2. **Connect to Vercel**
   - Visit https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Click "Continue"

3. **Configure Environment Variables**
   - In Vercel dashboard, go to "Settings" → "Environment Variables"
   - Add these variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```
   - Click "Add"

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your site is now live at `your-project.vercel.app`

5. **Set Custom Domain** (Optional)
   - In Vercel dashboard, go to "Domains"
   - Add your custom domain (e.g., `diversifiedpsy.com`)
   - Follow DNS instructions to connect domain
   - SSL certificate auto-provisioned (free)

### Automatic Deployments
Every push to `main` branch automatically deploys to production.

---

## Option 2: Deploy to AWS Amplify

### Prerequisites
- AWS account
- GitHub repository

### Steps

1. **Open AWS Amplify**
   - Go to https://console.aws.amazon.com/amplify
   - Click "Create app" → "Host web app"

2. **Connect GitHub**
   - Select "GitHub"
   - Authorize AWS
   - Select your repository
   - Select `main` branch

3. **Build Settings**
   - Framework: Next.js
   - Accept default settings
   - Click "Next"

4. **Environment Variables**
   - Add the same Supabase variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     ```

5. **Save and Deploy**
   - Click "Save and deploy"
   - Amplify builds and deploys your app

### Custom Domain
- In Amplify dashboard, click "Domain management"
- Add your custom domain
- Follow instructions to configure DNS

---

## Option 3: Deploy with Docker

For custom servers or containerized deployments.

### Create Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### Build and Run Docker Image

```bash
# Build image
docker build -t diversified-psych:latest .

# Run container
docker run -p 3000:80 \
  -e NEXT_PUBLIC_SUPABASE_URL="your-url" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="your-key" \
  diversified-psych:latest
```

### Deploy to Dockerized Platform
- **Docker Hub**: Push to registry
- **AWS ECS**: Container Orchestration Service
- **Google Cloud Run**: Serverless containers
- **Azure Container Instances**: Quick container deployment

---

## Option 4: Deploy to DigitalOcean App Platform

### Steps

1. **Connect GitHub**
   - Visit https://cloud.digitalocean.com/apps
   - Click "Create App"
   - Connect GitHub account
   - Select repository

2. **Detect Configuration**
   - DigitalOcean detects Next.js
   - Accepts default settings

3. **Environment Variables**
   - Add Supabase variables in "Environment" tab:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     ```

4. **Deploy**
   - Click "Deploy"
   - App is live at `project-name.ondigitalocean.app`

5. **Custom Domain**
   - Add domain in "Domains" section
   - Point DNS to DigitalOcean nameservers

---

## Post-Deployment Configuration

### 1. Update Supabase CORS Settings
In Supabase Dashboard → Settings → API:
- Add your production domain to CORS whitelist:
  ```
  https://yourdomain.com
  ```

### 2. Enable HTTPS
- All platforms provide free SSL/TLS certificates
- Enable auto-renewal

### 3. Set Up Monitoring
- **Vercel**: Built-in analytics and error tracking
- **AWS Amplify**: CloudWatch for monitoring
- **Docker**: Add Prometheus/Grafana for metrics

### 4. Database Backups
In Supabase Dashboard → Project Settings → Backups:
- Enable automated backups
- Recommended: Daily backups, 7-day retention

### 5. Email Configuration
For contact form functionality:
- Configure SendGrid or AWS SES
- Set up email templates
- Test email sending before going live

---

## Environment Variables for Production

Create `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Security Note**: Never commit `.env.local` to git. Use platform-specific environment variable management instead.

---

## Performance Optimization

### Before Deployment

1. **Image Optimization**
   - Compress all image assets
   - Use WebP format where supported
   - Implement next/image for auto optimization

2. **Database Indexes**
   - Add indexes on frequently queried columns
   - In Supabase: Run these queries:
     ```sql
     CREATE INDEX idx_therapists_active ON therapists(is_active);
     CREATE INDEX idx_therapists_order ON therapists(order_index);
     CREATE INDEX idx_services_active ON services(is_active);
     CREATE INDEX idx_services_order ON services(order_index);
     ```

3. **Caching**
   - Content is cached on CDN
   - Cache headers set automatically

4. **Minification**
   - Next.js minifies automatically in production
   - Verify with `npm run build`

---

## Monitoring & Maintenance

### Regular Checks
- ✅ Weekly: Test admin panel login
- ✅ Weekly: Check Supabase database health
- ✅ Monthly: Review error logs
- ✅ Monthly: Check SSL certificate expiration

### Alerts to Set Up
- Database connection errors
- High API response times
- Low disk space (if using self-hosted)
- Failed deployments

---

## Rollback Procedure

### Vercel
- Click deployment in "Deployments" tab
- Click "Redeploy" next to previous working version

### AWS Amplify
- Go to "Deployments"
- Click "Redeploy" on previous version

### Docker
- Tag images with version numbers
- Restart container with previous image version

---

## Scaling Considerations

### When traffic increases:

1. **Database**
   - Monitor active connections
   - Add replicas if needed
   - Optimize slow queries

2. **API**
   - Enable query caching
   - Add rate limiting
   - Implement pagination

3. **Storage**
   - Monitor image storage usage
   - Implement CDN for faster delivery
   - Archive old unused images

---

## Support & Troubleshooting

### Common Issues

**"502 Bad Gateway" Error**
- Check database connection
- Verify environment variables
- Review application logs

**Site Very Slow**
- Check database query performance
- Monitor network latency
- Review CDN cache hit rate

**Admin Panel Not Loading**
- Clear browser cache
- Check Supabase credentials
- Verify session token

### Getting Help
- Vercel Support: https://vercel.com/support
- Supabase Docs: https://supabase.com/docs
- Next.js Community: https://www.reddit.com/r/nextjs

---

## Success! 🎉

Your website is now live and accessible to clients. Continue to:
1. Monitor performance metrics
2. Regularly backup your database
3. Keep dependencies updated
4. Add new therapists/services as needed
5. Gather client feedback and iterate
