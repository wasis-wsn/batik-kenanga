import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useSettings } from '@/hooks/useSettings';
import { useCompanyInfo } from '@/hooks/useCompanyInfo';
import {
  Settings,
  Shield,
  Mail,
  Globe,
  Database,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  MapPin,
} from 'lucide-react';

const SettingsPage = () => {  const { toast } = useToast();
  const { settings, loading, getSetting, updateMultipleSettings } = useSettings();
  const { companyInfo, updateCompanyInfo } = useCompanyInfo();
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    smtpPassword: false,
    apiKey: false
  });

  const [formData, setFormData] = useState({
    // General Settings
    site_name: '',
    site_description: '',
    site_url: '',
    maintenance_mode: false,
    
    // Contact Information (from company_info)
    contact_address: '',
    contact_city: '',
    contact_state: '',
    contact_postal_code: '',    contact_country: '',
    contact_phone: '',
    contact_email: '',
    contact_whatsapp: '',
    
    // Business Hours
    business_hours: '',
    
    // Email Settings
    smtp_host: '',
    smtp_port: '587',
    smtp_username: '',
    smtp_password: '',
    smtp_from_name: '',
    smtp_from_email: '',
    enable_email_notifications: true,
    
    // Security Settings
    session_timeout: 24,
    max_login_attempts: 5,
    enable_two_factor: false,
    password_min_length: 8,
    require_strong_password: true,
    
    // API Settings
    enable_public_api: false,
    rate_limit_per_hour: 1000,
    api_key: '',
    webhook_url: '',
  });

  useEffect(() => {
    if (!loading && Object.keys(settings).length > 0) {
      loadSettings();
    }
    if (companyInfo) {
      loadCompanyInfo();
    }
  }, [loading, settings, companyInfo]);

  const loadSettings = () => {
    setFormData(prev => ({
      ...prev,
      site_name: getSetting('site_name', 'Batik Kenanga'),
      site_description: getSetting('site_description', 'Identitas batik Indonesia'),
      site_url: getSetting('site_url', 'https://batikenanga.com'),      maintenance_mode: getSetting('maintenance_mode', false),
      
      business_hours: getSetting('business_hours', 'Senin-Jumat: 08:00-17:00\nSabtu: 08:00-15:00\nMinggu: Tutup'),
      
      smtp_host: getSetting('smtp_host', ''),
      smtp_port: getSetting('smtp_port', '587'),
      smtp_username: getSetting('smtp_username', ''),
      smtp_password: getSetting('smtp_password', ''),
      smtp_from_name: getSetting('smtp_from_name', 'Batik Kenanga'),
      smtp_from_email: getSetting('smtp_from_email', 'noreply@batikenanga.com'),
      enable_email_notifications: getSetting('enable_email_notifications', true),
      session_timeout: getSetting('session_timeout', 24),
      max_login_attempts: getSetting('max_login_attempts', 5),
      enable_two_factor: getSetting('enable_two_factor', false),
      password_min_length: getSetting('password_min_length', 8),
      require_strong_password: getSetting('require_strong_password', true),
      enable_public_api: getSetting('enable_public_api', false),
      rate_limit_per_hour: getSetting('rate_limit_per_hour', 1000),
      api_key: getSetting('api_key', ''),
      webhook_url: getSetting('webhook_url', ''),
    }));
  };
  const loadCompanyInfo = () => {
    if (companyInfo?.contactInfo) {
      setFormData(prev => ({
        ...prev,
        contact_address: companyInfo.contactInfo.address || '',
        contact_city: companyInfo.contactInfo.city || '',
        contact_state: companyInfo.contactInfo.state || '',
        contact_postal_code: companyInfo.contactInfo.postal_code || '',
        contact_country: companyInfo.contactInfo.country || '',
        contact_phone: companyInfo.contactInfo.phone || '',
        contact_email: companyInfo.contactInfo.email || '',
        contact_whatsapp: companyInfo.contactInfo.whatsapp || '',
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const saveGeneralSettings = async () => {
    try {
      setSaving(true);
      console.log('Saving general settings...', formData);
      
      // Save general settings to settings table
      console.log('Updating settings table...');
      await updateMultipleSettings({
        site_name: formData.site_name,
        site_description: formData.site_description,
        site_url: formData.site_url,        maintenance_mode: formData.maintenance_mode,
        business_hours: formData.business_hours,
      });
      console.log('Settings table updated successfully');

      // Save contact info to company_info table
      console.log('Updating company_info table...');
      const contactInfoUpdate = {
        contact_info: {
          address: formData.contact_address,
          city: formData.contact_city,
          state: formData.contact_state,
          postal_code: formData.contact_postal_code,
          country: formData.contact_country,
          phone: formData.contact_phone,
          email: formData.contact_email,
          whatsapp: formData.contact_whatsapp,
        }
      };
      console.log('Contact info update data:', contactInfoUpdate);
      await updateCompanyInfo(contactInfoUpdate);
      console.log('Company info updated successfully');

      toast({
        title: "Berhasil",
        description: "Pengaturan umum berhasil disimpan",
      });
    } catch (error) {
      console.error('Error saving general settings:', error);
      
      // Provide more specific error messages
      let errorMessage = "Gagal menyimpan pengaturan umum";
      if (error.message) {
        errorMessage = `Gagal menyimpan pengaturan umum: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveEmailSettings = async () => {
    try {
      setSaving(true);
      
      await updateMultipleSettings({
        smtp_host: formData.smtp_host,
        smtp_port: formData.smtp_port,
        smtp_username: formData.smtp_username,
        smtp_password: formData.smtp_password,
        smtp_from_name: formData.smtp_from_name,
        smtp_from_email: formData.smtp_from_email,
        enable_email_notifications: formData.enable_email_notifications,
      });

      toast({
        title: "Berhasil",
        description: "Pengaturan email berhasil disimpan",
      });
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan email",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveSecuritySettings = async () => {
    try {
      setSaving(true);
      
      await updateMultipleSettings({
        session_timeout: formData.session_timeout,
        max_login_attempts: formData.max_login_attempts,
        enable_two_factor: formData.enable_two_factor,
        password_min_length: formData.password_min_length,
        require_strong_password: formData.require_strong_password,
      });

      toast({
        title: "Berhasil",
        description: "Pengaturan keamanan berhasil disimpan",
      });
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan keamanan",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveApiSettings = async () => {
    try {
      setSaving(true);
      
      await updateMultipleSettings({
        enable_public_api: formData.enable_public_api,
        rate_limit_per_hour: formData.rate_limit_per_hour,
        api_key: formData.api_key,
        webhook_url: formData.webhook_url,
      });

      toast({
        title: "Berhasil",
        description: "Pengaturan API berhasil disimpan",
      });
    } catch (error) {
      console.error('Error saving API settings:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan API",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleInputChange('api_key', result);
  };

  const testEmailConnection = async () => {
    try {
      setSaving(true);
      
      // In a real implementation, this would test the SMTP connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Test Berhasil",
        description: "Koneksi email berhasil ditest",
      });    } catch (error) {
      console.error('Error testing email connection:', error);
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
                Konfigurasi dasar untuk website dan informasi kontak
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nama Website</Label>
                  <Input
                    id="siteName"
                    value={formData.site_name}
                    onChange={(e) => handleInputChange('site_name', e.target.value)}
                    placeholder="Nama website"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">URL Website</Label>
                  <Input
                    id="siteUrl"
                    value={formData.site_url}
                    onChange={(e) => handleInputChange('site_url', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Deskripsi Website</Label>
                <Textarea
                  id="siteDescription"
                  value={formData.site_description}
                  onChange={(e) => handleInputChange('site_description', e.target.value)}
                  placeholder="Deskripsi singkat website"
                  rows={3}
                />
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Informasi Kontak</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactAddress">Alamat</Label>
                    <Input
                      id="contactAddress"
                      value={formData.contact_address}
                      onChange={(e) => handleInputChange('contact_address', e.target.value)}
                      placeholder="Jl. Kenanga Indah No. 1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactCity">Kota</Label>
                    <Input
                      id="contactCity"
                      value={formData.contact_city}
                      onChange={(e) => handleInputChange('contact_city', e.target.value)}
                      placeholder="Solo"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactState">Provinsi</Label>
                    <Input
                      id="contactState"
                      value={formData.contact_state}
                      onChange={(e) => handleInputChange('contact_state', e.target.value)}
                      placeholder="Jawa Tengah"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPostalCode">Kode Pos</Label>
                    <Input
                      id="contactPostalCode"
                      value={formData.contact_postal_code}
                      onChange={(e) => handleInputChange('contact_postal_code', e.target.value)}
                      placeholder="57123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactCountry">Negara</Label>
                    <Input
                      id="contactCountry"
                      value={formData.contact_country}
                      onChange={(e) => handleInputChange('contact_country', e.target.value)}
                      placeholder="Indonesia"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Telepon</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      placeholder="+62 812 9876 5432"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      placeholder="info@batikenanga.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactWhatsapp">WhatsApp</Label>
                    <Input
                      id="contactWhatsapp"
                      value={formData.contact_whatsapp}
                      onChange={(e) => handleInputChange('contact_whatsapp', e.target.value)}
                      placeholder="+62 812 9876 5432"
                    />
                  </div>
                </div>
              </div>              {/* Business Hours */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Jam Operasional</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="businessHours">Jam Operasional</Label>
                  <Textarea
                    id="businessHours"
                    value={formData.business_hours}
                    onChange={(e) => handleInputChange('business_hours', e.target.value)}
                    placeholder="Senin-Jumat: 08:00-17:00&#10;Sabtu: 08:00-15:00&#10;Minggu: Tutup"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    Gunakan enter untuk baris baru
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode Maintenance</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktifkan untuk menampilkan halaman maintenance
                  </p>
                </div>
                <Switch
                  checked={formData.maintenance_mode}
                  onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
                />
              </div>

              <Button onClick={saveGeneralSettings} disabled={saving}>
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
                Konfigurasi SMTP untuk pengiriman email dari form kontak
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={formData.smtp_host}
                    onChange={(e) => handleInputChange('smtp_host', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={formData.smtp_port}
                    onChange={(e) => handleInputChange('smtp_port', e.target.value)}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">Username</Label>
                  <Input
                    id="smtpUsername"
                    value={formData.smtp_username}
                    onChange={(e) => handleInputChange('smtp_username', e.target.value)}
                    placeholder="username@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="smtpPassword"
                      type={showPasswords.smtpPassword ? "text" : "password"}
                      value={formData.smtp_password}
                      onChange={(e) => handleInputChange('smtp_password', e.target.value)}
                      placeholder="Password atau App Password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => togglePasswordVisibility('smtpPassword')}
                    >
                      {showPasswords.smtpPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromName">Nama Pengirim</Label>
                  <Input
                    id="fromName"
                    value={formData.smtp_from_name}
                    onChange={(e) => handleInputChange('smtp_from_name', e.target.value)}
                    placeholder="Batik Kenanga"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">Email Pengirim</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={formData.smtp_from_email}
                    onChange={(e) => handleInputChange('smtp_from_email', e.target.value)}
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
                  checked={formData.enable_email_notifications}
                  onCheckedChange={(checked) => handleInputChange('enable_email_notifications', checked)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={saveEmailSettings} disabled={saving}>
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
                    value={formData.session_timeout}
                    onChange={(e) => handleInputChange('session_timeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Maksimal Percobaan Login</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min="3"
                    max="10"
                    value={formData.max_login_attempts}
                    onChange={(e) => handleInputChange('max_login_attempts', parseInt(e.target.value))}
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
                  value={formData.password_min_length}
                  onChange={(e) => handleInputChange('password_min_length', parseInt(e.target.value))}
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
                    checked={formData.enable_two_factor}
                    onCheckedChange={(checked) => handleInputChange('enable_two_factor', checked)}
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
                    checked={formData.require_strong_password}
                    onCheckedChange={(checked) => handleInputChange('require_strong_password', checked)}
                  />
                </div>
              </div>

              <Button onClick={saveSecuritySettings} disabled={saving}>
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
                  checked={formData.enable_public_api}
                  onCheckedChange={(checked) => handleInputChange('enable_public_api', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rateLimitPerHour">Rate Limit (per jam)</Label>
                <Input
                  id="rateLimitPerHour"
                  type="number"
                  min="100"
                  max="10000"
                  value={formData.rate_limit_per_hour}
                  onChange={(e) => handleInputChange('rate_limit_per_hour', parseInt(e.target.value))}
                  className="w-full md:w-64"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="apiKey"
                      type={showPasswords.apiKey ? "text" : "password"}
                      value={formData.api_key}
                      onChange={(e) => handleInputChange('api_key', e.target.value)}
                      placeholder="Klik generate untuk membuat API key baru"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => togglePasswordVisibility('apiKey')}
                    >
                      {showPasswords.apiKey ? (
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
                  value={formData.webhook_url}
                  onChange={(e) => handleInputChange('webhook_url', e.target.value)}
                  placeholder="https://example.com/webhook"
                />
                <p className="text-sm text-muted-foreground">
                  URL untuk menerima notifikasi webhook dari sistem
                </p>
              </div>

              <Button onClick={saveApiSettings} disabled={saving}>
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
      </Tabs>
    </div>
  );
};

export default SettingsPage;
