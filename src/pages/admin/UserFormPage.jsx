import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/services/supabase';
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Shield,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
} from 'lucide-react';

const UserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'editor',
    status: 'active',
    password: '',
    confirmPassword: '',
    bio: '',
    avatar: null,
    sendWelcomeEmail: true,
    requirePasswordChange: false,
  });

  const [errors, setErrors] = useState({});

  const roles = [
    { value: 'super_admin', label: 'Super Admin', description: 'Akses penuh ke semua fitur' },
    { value: 'admin', label: 'Admin', description: 'Akses manajemen konten dan pengguna' },
    { value: 'editor', label: 'Editor', description: 'Akses mengedit konten' },
    { value: 'moderator', label: 'Moderator', description: 'Akses moderasi dan review' },
  ];

  useEffect(() => {
    if (isEdit) {
      fetchUser();
    }
  }, [id, isEdit]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      // In real app: const { data, error } = await db.from('users').select('*').eq('id', id).single();
      
      // For demo, simulate fetching user data
      setTimeout(() => {
        const userData = {
          name: 'Editor Konten',
          email: 'editor@batikenanga.com',
          phone: '+62 814-1111-2222',
          role: 'editor',
          status: 'active',
          bio: 'Editor konten berpengalaman dengan spesialisasi dalam bidang fashion dan budaya.',
          avatar: null,
        };
        
        setFormData(prev => ({ ...prev, ...userData }));
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pengguna",
        variant: "destructive",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!isEdit && !formData.password) {
      newErrors.password = 'Password wajib diisi';
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak sesuai';
    }

    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Silakan perbaiki kesalahan pada form",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        bio: formData.bio,
      };

      if (!isEdit && formData.password) {
        userData.password = formData.password;
      }

      // In real app:
      // if (isEdit) {
      //   const { error } = await db.from('users').update(userData).eq('id', id);
      // } else {
      //   const { error } = await db.from('users').insert([userData]);
      // }

      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Berhasil",
        description: `Pengguna berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}`,
      });

      navigate('/admin/users');
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: `Gagal ${isEdit ? 'memperbarui' : 'menambah'} pengguna`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In real app, upload to storage and get URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
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
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/admin/users')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <div className="flex items-center gap-2">
            <User className="h-6 w-6" />
            <h1 className="text-2xl font-bold">
              {isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}
            </h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {isEdit ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
              </CardTitle>
              <CardDescription>
                {isEdit 
                  ? 'Perbarui informasi pengguna yang sudah ada'
                  : 'Buat akun pengguna baru untuk sistem admin'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Upload */}
                <div className="space-y-2">
                  <Label>Foto Profil</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="avatar"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <Label htmlFor="avatar" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
                          <span>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Foto
                          </span>
                        </Button>
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        JPG, PNG hingga 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="user@example.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+62 812-3456-7890"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex flex-col">
                              <span>{role.label}</span>
                              <span className="text-xs text-muted-foreground">{role.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Password Section */}
                {!isEdit && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Minimal 8 karakter"
                          className={errors.password ? 'border-red-500' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-500">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Ulangi password"
                        className={errors.confirmPassword ? 'border-red-500' : ''}
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Deskripsi singkat tentang pengguna..."
                    rows={3}
                  />
                </div>

                {/* Status and Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pengaturan Akun</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Status Akun</Label>
                      <p className="text-sm text-muted-foreground">
                        Pengguna aktif dapat mengakses sistem
                      </p>
                    </div>
                    <Switch
                      checked={formData.status === 'active'}
                      onCheckedChange={(checked) => 
                        handleInputChange('status', checked ? 'active' : 'inactive')
                      }
                    />
                  </div>

                  {!isEdit && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Kirim Email Selamat Datang</Label>
                          <p className="text-sm text-muted-foreground">
                            Kirim email berisi informasi login
                          </p>
                        </div>
                        <Switch
                          checked={formData.sendWelcomeEmail}
                          onCheckedChange={(checked) => 
                            handleInputChange('sendWelcomeEmail', checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Wajib Ganti Password</Label>
                          <p className="text-sm text-muted-foreground">
                            Pengguna harus ganti password saat login pertama
                          </p>
                        </div>
                        <Switch
                          checked={formData.requirePasswordChange}
                          onCheckedChange={(checked) => 
                            handleInputChange('requirePasswordChange', checked)
                          }
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        {isEdit ? 'Memperbarui...' : 'Menambah...'}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isEdit ? 'Perbarui Pengguna' : 'Tambah Pengguna'}
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/admin/users')}
                    disabled={saving}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>      </div>
    );
  };

  export default UserFormPage;
