# Manual Bucket Creation Guide - RLS Safe Method

## Problem: Row-Level Security Policy Violation
When creating buckets programmatically, you might encounter:
```
ERROR: 42501: new row violates row-level security policy for table "buckets"
```

## Solution: Manual Creation via Supabase Dashboard

### Step 1: Access Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Select your project: `qojlgridoruusocgwsdw`
3. Navigate to: **Storage** → **Buckets**

### Step 2: Create Each Bucket Manually

#### Bucket 1: images
- **Name:** `images`
- **Public:** ✅ Yes
- **File size limit:** `50 MB`
- **Allowed MIME types:** `image/jpeg, image/png, image/gif, image/webp`

#### Bucket 2: documents
- **Name:** `documents`
- **Public:** ✅ Yes
- **File size limit:** `10 MB`
- **Allowed MIME types:** `application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document`

#### Bucket 3: products
- **Name:** `products`
- **Public:** ✅ Yes
- **File size limit:** `50 MB`
- **Allowed MIME types:** `image/jpeg, image/png, image/gif, image/webp`

#### Bucket 4: company
- **Name:** `company`
- **Public:** ✅ Yes
- **File size limit:** `50 MB`
- **Allowed MIME types:** `image/jpeg, image/png, image/gif, image/webp`

### Step 3: Verify Bucket Creation
After creating all buckets, you should be able to access:
- https://qojlgridoruusocgwsdw.supabase.co/storage/v1/object/public/images/
- https://qojlgridoruusocgwsdw.supabase.co/storage/v1/object/public/documents/
- https://qojlgridoruusocgwsdw.supabase.co/storage/v1/object/public/products/
- https://qojlgridoruusocgwsdw.supabase.co/storage/v1/object/public/company/

### Step 4: Test Upload
1. Open admin panel: http://localhost:5173/admin
2. Go to Media Library
3. Try uploading a small test image
4. Verify the public URL is generated correctly

### Why Manual Creation Works Better
- No RLS policy conflicts
- Proper permissions set automatically
- UI validates settings before creation
- Immediate feedback if there are issues

### Alternative: Use Supabase CLI
If you prefer command line:
```bash
supabase storage create images --public
supabase storage create documents --public
supabase storage create products --public
supabase storage create company --public
```

### Troubleshooting
If you still get errors after manual creation:
1. Check bucket permissions in Supabase Dashboard
2. Verify your API keys in .env file
3. Check network connectivity
4. Try uploading through Supabase Dashboard first
