# 🚀 Vercel Deployment Guide - Al-Badar Lyceum

## ✅ **Issue Fixed: Vercel Configuration**

The invalid `vercel.json` file has been removed. Vercel will auto-detect the Next.js framework and use optimal default settings. Environment variables should be added directly in the Vercel dashboard.

## 🔧 **Step-by-Step Vercel Deployment**

### **Step 1: Import Project to Vercel**

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Repository**:
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose `zikwan-lab/Albadarlyceum`

3. **Configure Project Settings**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./school-management-system`
   - **Build Command**: `npm run build` (auto-configured)
   - **Output Directory**: `.next` (auto-configured)
   - **Install Command**: `npm install` (auto-configured)

### **Step 2: Add Environment Variables**

In the Vercel project settings, add these environment variables:

#### **Required Environment Variables**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### **Optional Environment Variables**
```env
DEMO_SETUP_KEY=demo-setup-key-123
```

### **Step 3: Deploy**

1. Click "Deploy" button
2. Wait for build completion (2-3 minutes)
3. Vercel will provide a deployment URL

## 🗄️ **Supabase Setup (Required)**

### **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and enter project details:
   - **Name**: Al-Badar Lyceum
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location

### **Step 2: Set Up Database Schema**

1. Wait for project initialization (2-3 minutes)
2. Go to **SQL Editor** in Supabase dashboard
3. Copy the entire contents of `supabase-schema.sql` from the repository
4. Paste and execute the SQL script
5. Verify all tables are created:
   - profiles
   - schools
   - students
   - teachers
   - classes
   - subjects
   - lectures
   - attendance
   - announcements
   - student_classes
   - teacher_subjects

### **Step 3: Get API Keys**

1. Go to **Settings** → **API** in Supabase dashboard
2. Copy the following values:
   - **Project URL** (for `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role secret** key (for `SUPABASE_SERVICE_ROLE_KEY`)

### **Step 4: Update Vercel Environment Variables**

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Update the environment variables with your actual Supabase credentials
4. **Important**: Update `NEXT_PUBLIC_APP_URL` with your actual Vercel deployment URL

### **Step 5: Redeploy**

1. Go to **Deployments** tab in Vercel
2. Click "Redeploy" to apply the new environment variables

## 🎯 **Post-Deployment Testing**

### **Step 1: Basic Functionality Test**

1. Visit your deployed application URL
2. You should see the setup page if Supabase is not configured
3. If Supabase is configured, you should be redirected to sign-in

### **Step 2: Configuration Test**

1. Visit `/setup` page
2. Verify that Supabase configuration is detected
3. All checkmarks should be green if properly configured

### **Step 3: Demo Data Setup (Optional)**

1. Visit `/setup-demo` page
2. Click "Create Demo Data"
3. This will create sample users and data for testing

### **Step 4: Authentication Test**

1. Try to access `/dashboard` directly
2. Should redirect to sign-in page
3. Create a test account or use demo credentials

## 🔒 **Security Configuration**

### **Supabase Auth Settings**

1. Go to **Authentication** → **Settings** in Supabase
2. Update **Site URL** to your Vercel deployment URL
3. Add your Vercel URL to **Redirect URLs**

### **Row Level Security**

The database schema includes RLS policies that are automatically applied. Verify they're enabled:

1. Go to **Database** → **Tables** in Supabase
2. Check that RLS is enabled for all tables
3. Verify policies are in place for each table

## 🎉 **Success Checklist**

After successful deployment, verify:

- [ ] **Application loads** without errors
- [ ] **Environment variables** are properly configured
- [ ] **Database connection** is working
- [ ] **Authentication flow** functions correctly
- [ ] **Role-based access** is enforced
- [ ] **All pages** load and navigate properly
- [ ] **API routes** respond correctly
- [ ] **Responsive design** works on mobile

## 🚨 **Troubleshooting**

### **Common Issues and Solutions**

#### **Build Errors**
- Check that `school-management-system` is set as root directory
- Verify all dependencies are in `package.json`
- Check build logs for specific error messages

#### **Environment Variable Issues**
- Ensure all required variables are set in Vercel dashboard
- Check that Supabase URLs and keys are correct
- Verify `NEXT_PUBLIC_APP_URL` matches your deployment URL

#### **Database Connection Issues**
- Verify Supabase project is active
- Check that database schema has been applied
- Ensure RLS policies are enabled

#### **Authentication Issues**
- Update Supabase Auth settings with correct URLs
- Check that redirect URLs include your Vercel domain
- Verify user creation is working in Supabase dashboard

## 📞 **Support**

If you encounter issues:

1. Check Vercel deployment logs
2. Check Supabase logs and metrics
3. Verify all environment variables are correct
4. Test locally with the same environment variables

## 🎊 **Deployment Complete!**

Once all steps are completed, your Al-Badar Lyceum School Management System will be live and ready to serve your educational institution's needs!

**Live Application**: Your Vercel deployment URL
**Admin Panel**: `/dashboard` (after authentication)
**Setup Guide**: `/setup` (for configuration verification)
**Demo Data**: `/setup-demo` (for testing purposes)

---

**Built with ❤️ by Zikwan Lab for Al-Badar Lyceum**
