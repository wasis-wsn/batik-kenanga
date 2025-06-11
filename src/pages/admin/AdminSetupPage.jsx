import React, { useState } from 'react';
import { supabase } from '@/services/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AdminSetupPage = () => {
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const { toast } = useToast();
  const createDefaultAdmin = async () => {
    setLoading(true);
    try {
      // Create admin user with Supabase Auth - with email confirmation bypassed
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@batikkenanga.com',
        password: 'admin123',
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
          data: {
            name: 'Admin Batik Kenanga',
            role: 'super_admin'
          }
        }
      });

      if (error) {
        // If user already exists, try to sign in instead
        if (error.message.includes('already registered')) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: 'admin@batikkenanga.com',
            password: 'admin123'
          });
          
          if (signInError) {
            throw new Error('Admin user exists but password is different. Please contact support.');
          }
          
          toast({
            title: 'Admin user already exists',
            description: 'You can login with the existing credentials',
          });
          setSetupComplete(true);
          return;
        }
        throw error;
      }

      toast({
        title: 'Admin user created successfully!',
        description: 'Please check your email to confirm your account, or check if auto-confirmation is enabled.',
      });

      setSetupComplete(true);
    } catch (error) {
      console.error('Error creating admin user:', error);
      toast({
        title: 'Error creating admin user',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (setupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">Setup Complete!</CardTitle>
            <CardDescription>
              Admin user has been created successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Login Credentials:</h3>
              <p className="text-green-700">Email: admin@batikkenanga.com</p>
              <p className="text-green-700">Password: admin123</p>
            </div>
            <Button 
              onClick={() => window.location.href = '/admin/login'} 
              className="w-full"
            >
              Go to Admin Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Batik Kenanga Admin Setup</CardTitle>
          <CardDescription>
            Create the first admin user to get started with the admin panel.
          </CardDescription>
        </CardHeader>        <CardContent className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800">Manual Setup Required</h3>
            <p className="text-yellow-700 mb-2">
              Due to email confirmation requirements, please create admin user manually:
            </p>
            <ol className="text-yellow-700 text-sm space-y-1 list-decimal list-inside">
              <li>Go to your Supabase project dashboard</li>
              <li>Navigate to Authentication → Users</li>
              <li>Click "Add user" and use these credentials:</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Admin User Credentials:</h3>
            <p className="text-blue-700">Email: admin@batikkenanga.com</p>
            <p className="text-blue-700">Password: admin123</p>
            <p className="text-sm text-blue-600 mt-2">
              Make sure to check "Auto Confirm User" when creating the user.
            </p>
          </div>
          
          <Button 
            onClick={() => window.open(VITE_SUPABASE_URL, '_blank')}
            className="w-full"
            variant="outline"
          >
            Open Supabase Dashboard
          </Button>

          <Button 
            onClick={() => window.location.href = '/admin/login'} 
            className="w-full"
          >
            Go to Admin Login
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            After creating the user in Supabase dashboard, you can login directly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetupPage;
