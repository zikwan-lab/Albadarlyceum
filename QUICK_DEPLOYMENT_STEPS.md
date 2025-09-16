# ⚡ Quick Deployment Steps - Al-Badar Lyceum

## 🚀 **5-Minute Setup Guide**

### **Step 1: Supabase Setup (2 minutes)**
1. Go to [supabase.com](https://supabase.com) → Create project
2. Name: `Al-Badar Lyceum`, choose region, set password
3. Wait for initialization
4. **Settings** → **API** → Copy URL and keys

### **Step 2: Database Schema (1 minute)**
1. **SQL Editor** → New query
2. Copy entire `supabase-schema.sql` content
3. Paste and **Run**
4. Verify 11 tables created

### **Step 3: Vercel Environment Variables (1 minute)**
1. Vercel project → **Settings** → **Environment Variables**
2. Add these:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
DEMO_SETUP_KEY=demo-setup-key-123
```

### **Step 4: Deploy & Test (1 minute)**
1. **Redeploy** in Vercel
2. Visit your app URL
3. Go to `/setup-demo` → **Create Demo Data**
4. Sign in with: `admin@school.com` / `admin123`

## 🎯 **Essential URLs**
- **Supabase**: [supabase.com](https://supabase.com)
- **Vercel**: [vercel.com](https://vercel.com)
- **Your App**: `https://your-app.vercel.app`
- **Setup Page**: `https://your-app.vercel.app/setup`
- **Demo Setup**: `https://your-app.vercel.app/setup-demo`

## 🔑 **Demo Credentials**
After running demo setup:
- **Admin**: admin@school.com / admin123
- **Teacher**: teacher@school.com / teacher123
- **Student**: student@school.com / student123
- **Parent**: parent@school.com / parent123

## 📋 **Verification Checklist**
- [ ] Supabase project active
- [ ] 11 database tables created
- [ ] Environment variables set in Vercel
- [ ] App deployed and accessible
- [ ] Demo data created
- [ ] Admin login working
- [ ] Dashboard accessible

## 🆘 **Quick Troubleshooting**
- **"Failed to fetch"**: Check environment variables
- **"Permission denied"**: Run database schema
- **"Invalid credentials"**: Use demo setup first
- **Build errors**: Verify all env vars in Vercel

---
**Ready in 5 minutes! 🎉**
