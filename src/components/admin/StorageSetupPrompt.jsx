import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AlertTriangle, ExternalLink, Database, Settings } from 'lucide-react';

const StorageSetupPrompt = ({ onRetry }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <CardTitle className="text-orange-800">Storage Setup Required</CardTitle>
          </div>
          <CardDescription className="text-orange-700">
            Supabase storage buckets need to be configured before using the media library.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Required Buckets
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">images</span>
                  <span className="text-gray-600">Company images</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">documents</span>
                  <span className="text-gray-600">PDF files</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">products</span>
                  <span className="text-gray-600">Product images</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">company</span>
                  <span className="text-gray-600">Company assets</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Setup Methods
              </h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-3 bg-white">
                  <div className="font-medium text-sm mb-1">Method 1: Manual (Recommended)</div>
                  <div className="text-xs text-gray-600 mb-2">Create buckets via Supabase Dashboard</div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Supabase Dashboard
                  </Button>
                </div>

                <div className="border rounded-lg p-3 bg-white">
                  <div className="font-medium text-sm mb-1">Method 2: SQL Script</div>
                  <div className="text-xs text-gray-600 mb-2">Run SQL in Supabase SQL Editor</div>
                  <div className="font-mono text-xs bg-gray-100 p-2 rounded mb-2">
                    supabase/storage-setup-safe.sql
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Quick Setup Steps:</h4>
            <ol className="text-sm space-y-1 text-gray-700">
              <li>1. Go to <span className="font-mono bg-gray-100 px-1 rounded">Storage → Buckets</span> in Supabase Dashboard</li>
              <li>2. Create each bucket with <span className="font-semibold">Public = Yes</span></li>
              <li>3. Set appropriate file size limits (10MB for images, 5MB for documents)</li>
              <li>4. Click the retry button below to test the setup</li>
            </ol>
          </div>

          <div className="flex space-x-3">
            <Button onClick={onRetry} className="flex-1">
              Retry Connection
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open('/docs/MANUAL_BUCKET_SETUP.md', '_blank')}
            >
              View Setup Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageSetupPrompt;
