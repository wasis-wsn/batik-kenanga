import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/services/supabase';
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';

const UserManagementPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Sample data - in real app, fetch from Supabase
  const sampleUsers = [
    {
      id: '1',
      name: 'Admin Utama',
      email: 'admin@batikenanga.com',
      phone: '+62 812-3456-7890',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      avatar: null,
    },
    {
      id: '2',
      name: 'Manager Produk',
      email: 'manager@batikenanga.com',
      phone: '+62 813-9876-5432',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-14T15:45:00Z',
      createdAt: '2024-01-05T00:00:00Z',
      avatar: null,
    },
    {
      id: '3',
      name: 'Editor Konten',
      email: 'editor@batikenanga.com',
      phone: '+62 814-1111-2222',
      role: 'editor',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-10T00:00:00Z',
      avatar: null,
    },
    {
      id: '4',
      name: 'Moderator',
      email: 'moderator@batikenanga.com',
      phone: '+62 815-3333-4444',
      role: 'moderator',
      status: 'inactive',
      lastLogin: '2024-01-01T12:00:00Z',
      createdAt: '2024-01-08T00:00:00Z',
      avatar: null,
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // In real app: const { data, error } = await db.from('users').select('*');
      // For demo, use sample data
      setTimeout(() => {
        setUsers(sampleUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pengguna",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && user.status === 'active';
    if (activeTab === 'inactive') return matchesSearch && user.status === 'inactive';
    if (activeTab === 'admins') return matchesSearch && ['super_admin', 'admin'].includes(user.role);
    
    return matchesSearch;
  });

  const getRoleBadge = (role) => {
    const roleConfig = {
      super_admin: { label: 'Super Admin', variant: 'destructive' },
      admin: { label: 'Admin', variant: 'default' },
      editor: { label: 'Editor', variant: 'secondary' },
      moderator: { label: 'Moderator', variant: 'outline' },
    };

    const config = roleConfig[role] || { label: role, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    return (
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status === 'active' ? 'Aktif' : 'Tidak Aktif'}
      </Badge>
    );
  };

  const getRoleIcon = (role) => {
    if (role === 'super_admin') return <ShieldCheck className="h-4 w-4" />;
    if (role === 'admin') return <Shield className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Yakin ingin menghapus pengguna ini?')) return;
    
    try {
      // In real app: await db.from('users').delete().eq('id', userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil dihapus",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus pengguna",
        variant: "destructive",
      });
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      // In real app: await db.from('users').update({ status: newStatus }).eq('id', userId);
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      toast({
        title: "Berhasil",
        description: `Status pengguna berhasil diubah menjadi ${newStatus === 'active' ? 'aktif' : 'tidak aktif'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengubah status pengguna",
        variant: "destructive",
      });
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['Nama', 'Email', 'Telepon', 'Role', 'Status', 'Login Terakhir', 'Dibuat'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.phone,
        user.role,
        user.status,
        formatDate(user.lastLogin),
        formatDate(user.createdAt),
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Berhasil",
      description: "Data pengguna berhasil diekspor",
    });
  };

  const UserStats = () => {
    const stats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      admins: users.filter(u => ['super_admin', 'admin'].includes(u.role)).length,
    };

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktif</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tidak Aktif</p>
                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
              </div>
              <Users className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admin</p>
                <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportUsers}>
              <Download className="mr-2 h-4 w-4" />
              Ekspor
            </Button>
            <Button onClick={fetchUsers} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button asChild>
              <Link to="/admin/users/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Tambah Pengguna
              </Link>
            </Button>
          </div>
        </div>

        <UserStats />

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <CardTitle>Daftar Pengguna</CardTitle>
                <CardDescription>
                  Kelola pengguna sistem admin
                </CardDescription>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari pengguna..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Semua ({users.length})</TabsTrigger>
                <TabsTrigger value="active">
                  Aktif ({users.filter(u => u.status === 'active').length})
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Tidak Aktif ({users.filter(u => u.status === 'inactive').length})
                </TabsTrigger>
                <TabsTrigger value="admins">
                  Admin ({users.filter(u => ['super_admin', 'admin'].includes(u.role)).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pengguna</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Login Terakhir</TableHead>
                        <TableHead>Dibuat</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  {getRoleIcon(user.role)}
                                </div>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {user.email}
                                  </div>
                                  {user.phone && (
                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {user.phone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getRoleBadge(user.role)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(user.status)}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(user.lastLogin)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(user.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link to={`/admin/users/${user.id}/edit`}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusToggle(user.id, user.status)}
                                  >
                                    <Shield className="mr-2 h-4 w-4" />
                                    {user.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <Users className="h-8 w-8 text-muted-foreground" />
                              <p className="text-muted-foreground">
                                {searchTerm ? 'Tidak ada pengguna yang sesuai pencarian' : 'Belum ada pengguna'}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>        </Card>
      </div>
    );
  };

  export default UserManagementPage;
