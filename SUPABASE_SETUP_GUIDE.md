# 🗄️ Supabase Setup & Vercel Integration Guide

## 📋 **Complete Setup Process**

### **Phase 1: Create Supabase Project**

#### **Step 1: Sign Up/Login to Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign In"
3. Sign up with GitHub (recommended) or email

#### **Step 2: Create New Project**
1. Click "New Project" in your dashboard
2. **Select Organization**: Choose your organization or create new one
3. **Project Settings**:
   - **Name**: `Al-Badar Lyceum`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location (e.g., `US East (N. Virginia)`)
   - **Pricing Plan**: Start with Free tier

4. Click "Create new project"
5. **Wait 2-3 minutes** for project initialization

#### **Step 3: Get Project Credentials**
1. Once project is ready, go to **Settings** → **API**
2. **Copy these values** (you'll need them later):
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role secret** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### **Phase 2: Set Up Database Schema**

#### **Step 1: Access SQL Editor**
1. In your Supabase project, go to **SQL Editor**
2. Click "New query"

#### **Step 2: Run Database Schema**
1. Open the `supabase-schema.sql` file from your repository
2. **Copy the entire contents** (all ~300+ lines)
3. **Paste into SQL Editor**
4. Click **"Run"** button

#### **Step 3: Verify Tables Created**
1. Go to **Database** → **Tables**
2. You should see these tables:
   - `profiles` (user profiles with roles)
   - `schools` (school information)
   - `students` (student records)
   - `teachers` (teacher profiles)
   - `classes` (class management)
   - `subjects` (subject definitions)
   - `lectures` (lecture scheduling)
   - `attendance` (attendance tracking)
   - `announcements` (communication)
   - `student_classes` (student-class relationships)
   - `teacher_subjects` (teacher-subject assignments)

#### **Step 4: Verify Row Level Security (RLS)**
1. Check that **RLS is enabled** for all tables
2. Go to each table → **Settings** → verify "Enable RLS" is checked
3. Check **Policies** tab to see security policies

### **Phase 3: Configure Authentication**

#### **Step 1: Authentication Settings**
1. Go to **Authentication** → **Settings**
2. **Site URL**: Set to your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
3. **Redirect URLs**: Add your Vercel URL + `/auth/callback`
   - Example: `https://your-app.vercel.app/auth/callback`

#### **Step 2: Email Templates (Optional)**
1. Go to **Authentication** → **Email Templates**
2. Customize confirmation and reset password emails if needed

### **Phase 4: Connect to Vercel**

#### **Step 1: Update Vercel Environment Variables**
1. Go to your **Vercel project dashboard**
2. Navigate to **Settings** → **Environment Variables**
3. **Add/Update these variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
DEMO_SETUP_KEY=demo-setup-key-123
```

#### **Step 2: Redeploy Application**
1. Go to **Deployments** tab in Vercel
2. Click **"Redeploy"** on the latest deployment
3. Wait for deployment to complete (~2-3 minutes)

### **Phase 5: Test the Integration**

#### **Step 1: Basic Connection Test**
1. Visit your deployed application URL
2. You should see the **setup page** if everything is configured correctly
3. Go to `/setup` to verify Supabase connection

#### **Step 2: Create Demo Data (Recommended)**
1. Visit `/setup-demo` on your deployed app
2. Click **"Create Demo Data"**
3. This creates:
   - Sample school with classes and subjects
   - 4 demo user accounts with different roles
   - Sample announcements and data

#### **Step 3: Test Authentication**
1. Try to access `/dashboard` (should redirect to sign-in)
2. Create a new account or use demo credentials:
   - **Admin**: admin@school.com / admin123
   - **Teacher**: teacher@school.com / teacher123
   - **Student**: student@school.com / student123
   - **Parent**: parent@school.com / parent123

### **Phase 6: Create Your First Admin User**

#### **Option 1: Through Demo Setup**
- Use the `/setup-demo` page to create demo users including an admin

#### **Option 2: Manual Creation**
1. **Sign up** through your app with your email
2. Go to **Supabase** → **Authentication** → **Users**
3. Find your user and **copy the UUID**
4. Go to **SQL Editor** and run:
```sql
INSERT INTO profiles (id, email, full_name, role)
VALUES ('your-user-uuid-here', 'your-email@example.com', 'Your Name', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

### **Phase 7: Production Configuration**

#### **Step 1: Security Settings**
1. **Database Settings**:
   - Go to **Settings** → **Database**
   - Ensure **SSL enforcement** is enabled
   - Review **Connection pooling** settings

2. **API Settings**:
   - Go to **Settings** → **API**
   - Review **CORS settings**
   - Ensure **JWT expiry** is appropriate

#### **Step 2: Backup Configuration**
1. Go to **Settings** → **Database**
2. Enable **Point-in-time Recovery** (PITR) for production
3. Set up **automated backups**

#### **Step 3: Monitoring**
1. Go to **Reports** to monitor:
   - Database performance
   - API usage
   - Authentication metrics
   - Storage usage

## 🔧 **Troubleshooting Common Issues**

### **Connection Issues**
- **Error**: "Failed to fetch"
  - **Solution**: Check environment variables are correct
  - Verify Supabase project is active and running

### **Authentication Issues**
- **Error**: "Invalid login credentials"
  - **Solution**: Check Site URL and Redirect URLs in Supabase Auth settings
  - Ensure user exists in Authentication → Users

### **Database Issues**
- **Error**: "Permission denied"
  - **Solution**: Verify RLS policies are correctly applied
  - Check user role in profiles table

### **Build Issues**
- **Error**: Environment variables not found
  - **Solution**: Ensure all required env vars are set in Vercel
  - Redeploy after adding environment variables

## ✅ **Success Checklist**

After completing setup, verify:

- [ ] **Supabase project** created and active
- [ ] **Database schema** applied successfully (11 tables)
- [ ] **RLS policies** enabled and working
- [ ] **Environment variables** set in Vercel
- [ ] **Application deployed** and accessible
- [ ] **Authentication** working (sign up/sign in)
- [ ] **Role-based access** functioning
- [ ] **Demo data** created (optional)
- [ ] **Admin user** created and accessible

## 🎯 **Final Verification**

1. **Visit your app**: `https://your-app.vercel.app`
2. **Sign in** with admin credentials
3. **Access dashboard** and verify all features work
4. **Test different roles** (admin, teacher, student, parent)
5. **Verify data operations** (create, read, update, delete)

## 🎉 **Congratulations!**

Your Al-Badar Lyceum School Management System is now fully deployed with:
- ✅ **Live application** on Vercel
- ✅ **Secure database** on Supabase
- ✅ **Multi-role authentication** system
- ✅ **Production-ready** configuration

**Your school management system is ready to serve Al-Badar Lyceum!** 🏫

---
**Setup Guide by Zikwan Lab**
