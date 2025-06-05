import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  getSettings,
  updateSetting
} from '@/services/supabase';
import {
  Settings,
  Shield,
  Mail,
  Globe,
  Database,
  Save,
  RefreshCw,
  Upload,
  Eye,
  EyeOff,
} from 'lucide-react';

const SettingsPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Batik Kenanga',
    siteDescription: 'Identitas batik Indonesia, menghadirkan keindahan tradisi dalam setiap helai kain.',
    siteUrl: 'https://batikenanga.com',
    adminEmail: 'admin@batikenanga.com',
    maintenanceMode: false,
    allowRegistration: true,
    enableNotifications: true,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    fromName: 'Batik Kenanga',
    fromEmail: 'noreply@batikenanga.com',
    enableEmailNotifications: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    enableTwoFactor: false,
    passwordMinLength: 8,
    requireStrongPassword: true,
  });

  const [apiSettings, setApiSettings] = useState({
    enablePublicApi: false,
    rateLimitPerHour: 1000,
    apiKey: '',
    webhookUrl: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // In a real app, fetch from Supabase
      // For demo, we'll use the default values
      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Gagal memuat pengaturan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (settingsType, data) => {
    try {
      setSaving(true);
      
      // In a real app, save to Supabase
      // const { error } = await db.from('settings').upsert({
      //   type: settingsType,
      //   data: data
      // });
      
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Berhasil",
        description: "Pengaturan berhasil disimpan",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGeneralSave = () => {
    saveSettings('general', generalSettings);
  };

  const handleEmailSave = () => {
    saveSettings('email', emailSettings);
  };

  const handleSecuritySave = () => {
    saveSettings('security', securitySettings);
  };

  const handleApiSave = () => {
    saveSettings('api', apiSettings);
  };

  const generateApiKey = () => {
    const key = Math.random().toString(36).substr(2, 32);
    setApiSettings(prev => ({ ...prev, apiKey: key }));
  };

  const testEmailConnection = async () => {
    try {
      setSaving(true);
      // Simulate email test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Test Berhasil",
        description: "Koneksi email berhasil ditest",
      });
    } catch (error) {
      toast({
        title: "Test Gagal",
        description: "Koneksi email gagal ditest",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Pengaturan Sistem</h1>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Umum
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Keamanan
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              API
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Umum</CardTitle>
                <CardDescription>
                  Konfigurasi dasar untuk website dan aplikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Nama Website</Label>
                    <Input
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings(prev => ({
                        ...prev,
                        siteName: e.target.value
                      }))}
                      placeholder="Nama website"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">URL Website</Label>
                    <Input
                      id="siteUrl"
                      value={generalSettings.siteUrl}
                      onChange={(e) => setGeneralSettings(prev => ({
                        ...prev,
                        siteUrl: e.target.value
                      }))}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Deskripsi Website</Label>
                  <Textarea
                    id="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      siteDescription: e.target.value
                    }))}
                    placeholder="Deskripsi singkat website"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email Admin</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={generalSettings.adminEmail}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      adminEmail: e.target.value
                    }))}
                    placeholder="admin@example.com"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pengaturan Fitur</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mode Maintenance</Label>
                      <p className="text-sm text-muted-foreground">
                        Aktifkan untuk menampilkan halaman maintenance
                      </p>
                    </div>
                    <Switch
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(checked) => setGeneralSettings(prev => ({
                        ...prev,
                        maintenanceMode: checked
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Izinkan Registrasi</Label>
                      <p className="text-sm text-muted-foreground">
                        Pengguna baru dapat mendaftar akun
                      </p>
                    </div>
                    <Switch
                      checked={generalSettings.allowRegistration}
                      onCheckedChange={(checked) => setGeneralSettings(prev => ({
                        ...prev,
                        allowRegistration: checked
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifikasi</Label>
                      <p className="text-sm text-muted-foreground">
                        Aktifkan notifikasi sistem
                      </p>
                    </div>
                    <Switch
                      checked={generalSettings.enableNotifications}
                      onCheckedChange={(checked) => setGeneralSettings(prev => ({
                        ...prev,
                        enableNotifications: checked
                      }))}
                    />
                  </div>
                </div>

                <Button onClick={handleGeneralSave} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Pengaturan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Email</CardTitle>
                <CardDescription>
                  Konfigurasi SMTP untuk pengiriman email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings(prev => ({
                        ...prev,
                        smtpHost: e.target.value
                      }))}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings(prev => ({
                        ...prev,
                        smtpPort: e.target.value
                      }))}
                      placeholder="587"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">Username</Label>
                    <Input
                      id="smtpUsername"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings(prev => ({
                        ...prev,
                        smtpUsername: e.target.value
                      }))}
                      placeholder="username@gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings(prev => ({
                        ...prev,
                        smtpPassword: e.target.value
                      }))}
                      placeholder="Password atau App Password"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromName">Nama Pengirim</Label>
                    <Input
                      id="fromName"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings(prev => ({
                        ...prev,
                        fromName: e.target.value
                      }))}
                      placeholder="Batik Kenanga"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">Email Pengirim</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings(prev => ({
                        ...prev,
                        fromEmail: e.target.value
                      }))}
                      placeholder="noreply@example.com"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifikasi Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan pengiriman notifikasi melalui email
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.enableEmailNotifications}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({
                      ...prev,
                      enableEmailNotifications: checked
                    }))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleEmailSave} disabled={saving}>
                    {saving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Pengaturan
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={testEmailConnection} disabled={saving}>
                    <Mail className="mr-2 h-4 w-4" />
                    Test Koneksi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Keamanan</CardTitle>
                <CardDescription>
                  Konfigurasi keamanan dan autentikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Timeout Sesi (jam)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="1"
                      max="168"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        sessionTimeout: parseInt(e.target.value)
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Maksimal Percobaan Login</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      min="3"
                      max="10"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        maxLoginAttempts: parseInt(e.target.value)
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Panjang Minimum Password</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    min="6"
                    max="20"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings(prev => ({
                      ...prev,
                      passwordMinLength: parseInt(e.target.value)
                    }))}
                    className="w-full md:w-64"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pengaturan Password</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Aktifkan autentikasi dua faktor untuk admin
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.enableTwoFactor}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({
                        ...prev,
                        enableTwoFactor: checked
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Password Kuat</Label>
                      <p className="text-sm text-muted-foreground">
                        Wajibkan penggunaan password yang kuat
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.requireStrongPassword}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({
                        ...prev,
                        requireStrongPassword: checked
                      }))}
                    />
                  </div>
                </div>

                <Button onClick={handleSecuritySave} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Pengaturan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Settings */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan API</CardTitle>
                <CardDescription>
                  Konfigurasi API dan integrasi eksternal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>API Publik</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan akses API untuk aplikasi eksternal
                    </p>
                  </div>
                  <Switch
                    checked={apiSettings.enablePublicApi}
                    onCheckedChange={(checked) => setApiSettings(prev => ({
                      ...prev,
                      enablePublicApi: checked
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rateLimitPerHour">Rate Limit (per jam)</Label>
                  <Input
                    id="rateLimitPerHour"
                    type="number"
                    min="100"
                    max="10000"
                    value={apiSettings.rateLimitPerHour}
                    onChange={(e) => setApiSettings(prev => ({
                      ...prev,
                      rateLimitPerHour: parseInt(e.target.value)
                    }))}
                    className="w-full md:w-64"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="apiKey"
                        type={showApiKeys ? "text" : "password"}
                        value={apiSettings.apiKey}
                        onChange={(e) => setApiSettings(prev => ({
                          ...prev,
                          apiKey: e.target.value
                        }))}
                        placeholder="Klik generate untuk membuat API key baru"
                        readOnly
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowApiKeys(!showApiKeys)}
                      >
                        {showApiKeys ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button variant="outline" onClick={generateApiKey}>
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    type="url"
                    value={apiSettings.webhookUrl}
                    onChange={(e) => setApiSettings(prev => ({
                      ...prev,
                      webhookUrl: e.target.value
                    }))}
                    placeholder="https://example.com/webhook"
                  />
                  <p className="text-sm text-muted-foreground">
                    URL untuk menerima notifikasi webhook dari sistem
                  </p>
                </div>

                <Button onClick={handleApiSave} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Pengaturan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>        </Tabs>
      </div>
    );
  };

  export default SettingsPage;
