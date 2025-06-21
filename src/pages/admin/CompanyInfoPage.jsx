import React, { useState, useEffect } from 'react';
import { Save, Building, Phone, Globe, Image, Users, Plus, Edit, Trash2, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../components/ui/use-toast';
import { useCompanyInfo } from '../../hooks/useCompanyInfo';

const CompanyInfoPage = () => {  const { toast } = useToast();
  const { companyInfo, loading, updateCompanyInfo, uploadLogo, uploadHeroImage, uploadHomePageImage, uploadProfileImage, uploadTeamMemberImage, deleteTeamMemberImages, updateTeamData } = useCompanyInfo();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});  const [teamData, setTeamData] = useState([]);
  const [teamUploading, setTeamUploading] = useState({});
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [stagedImageFiles, setStagedImageFiles] = useState({}); // Store staged files before upload
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    position: '',
    period: '',
    bio: '',
    imageUrl: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tagline: '',
    profileSingkat: '',
    mission: '',
    vision: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    business_hours: '',
    founded_year: '',
    team_size: '',
  });
  useEffect(() => {
    if (companyInfo) {
      setFormData({
        name: companyInfo.name || '',
        description: companyInfo.description || companyInfo.profileSingkat || '',
        tagline: companyInfo.tagline || '',
        profileSingkat: companyInfo.profileSingkat || '',
        mission: companyInfo.mission || '',
        vision: companyInfo.vision || '',
        address: companyInfo.contact?.address || companyInfo.contactInfo?.address || '',
        city: companyInfo.contact?.city || '',
        state: companyInfo.contact?.state || '',
        postal_code: companyInfo.contact?.postal_code || '',
        country: companyInfo.contact?.country || '',
        phone: companyInfo.contact?.phone || companyInfo.contactInfo?.phone || '',
        email: companyInfo.contact?.email || companyInfo.contactInfo?.email || '',
        website: companyInfo.contact?.website || '',
        whatsapp: companyInfo.socialMedia?.whatsapp || companyInfo.contactInfo?.whatsapp || '',
        instagram: companyInfo.socialMedia?.instagram || '',
        facebook: companyInfo.socialMedia?.facebook || '',
        twitter: companyInfo.socialMedia?.twitter || '',
        linkedin: companyInfo.socialMedia?.linkedin || '',
        youtube: companyInfo.socialMedia?.youtube || '',
        business_hours: companyInfo.businessHours || '',
        founded_year: companyInfo.foundedYear || companyInfo.established || '',
        team_size: companyInfo.teamSize || '',
      });
        // Initialize team data and ensure all members have IDs
      const teamWithIds = (companyInfo.team || []).map(member => ({
        ...member,
        id: member.id || `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
      setTeamData(teamWithIds);
    }
  }, [companyInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (file, uploadType) => {
    if (!file) return;    try {
      setUploading(prev => ({ ...prev, [uploadType]: true }));

      switch (uploadType) {
        case 'logo':
          await uploadLogo(file);
          break;
        case 'heroImage':
          await uploadHeroImage(file);
          break;
        case 'homePageImage':
          await uploadHomePageImage(file);
          break;
        case 'profileImage':
          await uploadProfileImage(file);
          break;
        default:
          throw new Error('Invalid upload type');
      }

      toast({
        title: "Success",
        description: `${uploadType} uploaded successfully`,
      });
    } catch (error) {
      console.error(`Error uploading ${uploadType}:`, error);
      toast({
        title: "Error",
        description: `Failed to upload ${uploadType}`,
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [uploadType]: false }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      const updateData = {
        name: formData.name,
        tagline: formData.tagline,
        established: formData.founded_year ? parseInt(formData.founded_year) : null,
        mission: formData.mission,
        vision: formData.vision,
        profile_singkat: formData.profileSingkat,
        contact_info: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
          whatsapp: formData.whatsapp,
        },
        social_media: {
          instagram: formData.instagram,
          facebook: formData.facebook,
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          youtube: formData.youtube,
        },
        // team: cleanTeamData(teamData), // <-- REMOVE this line to decouple team from company info save
      };

      await updateCompanyInfo(updateData);
      toast({
        title: "Success",
        description: "Company information updated successfully",
      });
    } catch (error) {
      console.error('Error saving company info:', error);
      toast({
        title: "Error",
        description: "Failed to update company information",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Team Management Functions
  const handleTeamFormChange = (e) => {
    const { name, value } = e.target;
    setTeamFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };  const handleTeamImageUpload = async (file, memberId = null) => {
    try {
      if (!file) return;

      // Create preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      
      if (memberId !== null) {
        // For existing member being edited - stage the file and update form only
        setStagedImageFiles(prev => ({
          ...prev,
          [memberId]: file
        }));
        
        // Only update the form data for preview, not the team data yet
        setTeamFormData(prev => ({ 
          ...prev, 
          imageUrl: previewUrl,
          _hasNewImage: true 
        }));
      } else {
        // For new member - stage in form
        setStagedImageFiles(prev => ({
          ...prev,
          new: file
        }));
        
        // Update form for new member with preview
        setTeamFormData(prev => ({ 
          ...prev, 
          imageUrl: previewUrl,
          _hasNewImage: true 
        }));
      }

      toast({
        title: "Image Staged",
        description: "Image ready for upload. Click Update Member to apply changes.",
      });
    } catch (error) {
      console.error('Error staging team image:', error);
      toast({
        title: "Error",
        description: "Failed to stage team member image",
        variant: "destructive",
      });
    }
  };  const addTeamMember = () => {
    if (!teamFormData.name.trim() || !teamFormData.position.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and position are required",
        variant: "destructive",
      });
      return;
    }

    const newMemberId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newMember = {
      id: newMemberId,
      name: teamFormData.name,
      position: teamFormData.position,
      period: teamFormData.period,
      bio: teamFormData.bio,
      imageUrl: teamFormData.imageUrl,
      _hasNewImage: teamFormData._hasNewImage || false
    };

    // If there's a staged file for new member, move it to the new member's ID
    if (stagedImageFiles.new) {
      setStagedImageFiles(prev => {
        const updated = { ...prev };
        updated[newMemberId] = prev.new;
        delete updated.new;
        return updated;
      });
    }

    const updatedTeam = [...teamData, newMember];
    setTeamData(updatedTeam);
    setTeamFormData({
      name: '',
      position: '',
      period: '',
      bio: '',
      imageUrl: '',
      _hasNewImage: false
    });

    toast({
      title: "Success",
      description: "Team member added. Save team data to upload images to server.",
    });
  };
  const editTeamMember = (memberId) => {
    const member = teamData.find(m => m.id === memberId);
    if (!member) return;
    
    setEditingTeamMember(memberId);
    setTeamFormData({
      name: member.name,
      position: member.position,
      period: member.period || '',
      bio: member.bio || '',
      imageUrl: member.imageUrl || '',
      _hasNewImage: member._hasNewImage || false
    });
  };  const updateTeamMember = () => {
    if (!teamFormData.name.trim() || !teamFormData.position.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and position are required",
        variant: "destructive",
      });
      return;
    }

    const updatedTeam = teamData.map(member => 
      member.id === editingTeamMember 
        ? {
            ...member,
            name: teamFormData.name,
            position: teamFormData.position,
            period: teamFormData.period,
            bio: teamFormData.bio,
            imageUrl: teamFormData.imageUrl,
            _hasNewImage: teamFormData._hasNewImage || false
          }
        : member
    );

    setTeamData(updatedTeam);
    setEditingTeamMember(null);
    setTeamFormData({
      name: '',
      position: '',
      period: '',
      bio: '',
      imageUrl: '',
      _hasNewImage: false
    });

    toast({
      title: "Success",
      description: "Team member updated. Save team data to upload images to server.",
    });
  };

  const deleteTeamMember = async (memberId) => {
    try {
      // Delete member's folder and images from storage using member ID
      await deleteTeamMemberImages(memberId);
      
      // Remove from local state
      const updatedTeam = teamData.filter(member => member.id !== memberId);
      setTeamData(updatedTeam);
      
      toast({
        title: "Success",
        description: "Team member deleted successfully. Please save to apply changes.",
      });
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: "Error",
        description: "Failed to delete team member images",
        variant: "destructive",
      });
      
      // Still remove from UI even if image deletion fails
      const updatedTeam = teamData.filter(member => member.id !== memberId);
      setTeamData(updatedTeam);
    }
  };
  const cancelEdit = () => {
    // Clear any staged files for the edited member
    if (editingTeamMember) {
      setStagedImageFiles(prev => {
        const updated = { ...prev };
        delete updated[editingTeamMember];
        return updated;
      });
    }
    
    setEditingTeamMember(null);
    setTeamFormData({
      name: '',
      position: '',
      period: '',
      bio: '',
      imageUrl: '',
      _hasNewImage: false
    });
  };const cleanTeamData = (data) => {
    return data.map(member => {
      // Remove internal flags and only keep actual data
      const { _hasNewImage, ...cleanMember } = member;
      return {
        id: cleanMember.id, // Preserve the ID
        name: cleanMember.name.trim(),
        position: cleanMember.position.trim(),
        period: cleanMember.period ? cleanMember.period.trim() : '',
        bio: cleanMember.bio ? cleanMember.bio.trim() : '',
        imageUrl: cleanMember.imageUrl || ''
      };
    });
  };    const saveTeamData = async () => {
    try {
      setTeamUploading(prev => ({ ...prev, saving: true }));
      
      // First, upload all staged images and update URLs
      const updatedTeamData = await Promise.all(
        teamData.map(async (member) => {
          // If this member has a staged image, upload it
          if (stagedImageFiles[member.id] && member._hasNewImage) {
            try {
              // Pass existing image URL so old image can be deleted first
              const existingImageUrl = member.imageUrl && !member.imageUrl.startsWith('blob:') ? member.imageUrl : null;
              const imageUrl = await uploadTeamMemberImage(stagedImageFiles[member.id], member.id, existingImageUrl);
              return {
                ...member,
                imageUrl: imageUrl,
                _hasNewImage: false // Clear the flag after upload
              };
            } catch (error) {
              console.error(`Failed to upload image for ${member.name}:`, error);
              toast({
                title: "Image Upload Error",
                description: `Failed to upload image for ${member.name}`,
                variant: "destructive",
              });
              // Return member without image update if upload fails
              return {
                ...member,
                _hasNewImage: false
              };
            }
          }
          return {
            ...member,
            _hasNewImage: false // Clear flag even if no upload needed
          };
        })
      );

      // Clean the updated team data and save to database
      const cleanedTeamData = cleanTeamData(updatedTeamData);
      await updateTeamData(cleanedTeamData);
      
      // Update local state with the uploaded data
      setTeamData(updatedTeamData);
      
      // Clear staged files
      setStagedImageFiles({});
      
      toast({
        title: "Success",
        description: "Team data and images saved successfully",
      });
    } catch (error) {
      console.error('Error saving team data:', error);
      toast({
        title: "Error",
        description: "Failed to save team data",
        variant: "destructive",
      });
    } finally {
      setTeamUploading(prev => ({ ...prev, saving: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Company Information</h1>
        <p className="text-gray-600">Manage your company's basic information and contact details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founded_year">Founded Year</Label>
                <Input
                  id="founded_year"
                  name="founded_year"
                  type="number"
                  value={formData.founded_year}
                  onChange={handleInputChange}
                  placeholder="2020"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                placeholder="Company tagline"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of your company..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mission">Mission Statement</Label>
                <Textarea
                  id="mission"
                  name="mission"
                  value={formData.mission}
                  onChange={handleInputChange}
                  placeholder="Company mission..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vision">Vision Statement</Label>
                <Textarea
                  id="vision"
                  name="vision"
                  value={formData.vision}
                  onChange={handleInputChange}
                  placeholder="Company vision..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+62 123 456 7890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="info@company.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address, City, State"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Social Media Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/page"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="+62 123 456 7890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://www.company.com"
                />
              </div>
            </div>
          </CardContent>        
          </Card>

        {/* Image Uploads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Image Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Images Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo */}
              <div className="space-y-3">
                <Label>Company Logo</Label>
                {companyInfo?.logoUrlLight && (
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-gray-50">
                    <img 
                      src={companyInfo.logoUrlLight} 
                      alt="Company Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'logo');
                    }}
                    disabled={uploading.logo}
                    className="text-sm"
                  />
                  {uploading.logo && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                </div>
              </div>

              {/* Hero Image */}
              <div className="space-y-3">
                <Label>Hero Background Image</Label>
                {companyInfo?.heroImage && (
                  <div className="relative w-32 h-20 border rounded-lg overflow-hidden bg-gray-50">
                    <img 
                      src={companyInfo.heroImage} 
                      alt="Hero Background"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'heroImage');
                    }}
                    disabled={uploading.heroImage}
                    className="text-sm"
                  />
                  {uploading.heroImage && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                </div>
              </div>

              {/* Home Page Image */}
              <div className="space-y-3">
                <Label>Home Page Image</Label>
                {companyInfo?.homePageImage && (
                  <div className="relative w-32 h-20 border rounded-lg overflow-hidden bg-gray-50">
                    <img 
                      src={companyInfo.homePageImage} 
                      alt="Home Page Image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'homePageImage');
                    }}
                    disabled={uploading.homePageImage}
                    className="text-sm"
                  />
                  {uploading.homePageImage && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-3">
                <Label>Profile Image</Label>
                {companyInfo?.profileImage && (
                  <div className="relative w-32 h-20 border rounded-lg overflow-hidden bg-gray-50">
                    <img 
                      src={companyInfo.profileImage} 
                      alt="Profile Image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'profileImage');
                    }}
                    disabled={uploading.profileImage}
                    className="text-sm"
                  />
                  {uploading.profileImage && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>• Logo: Recommended size 200x200px, PNG format with transparent background</p>
              <p>• Hero Image: Recommended size 1920x1080px for best results</p>
              <p>• Home Page Image: Recommended size 1200x800px, used on home page sections</p>
              <p>• Profile Image: Recommended size 800x600px, used in about/profile sections</p>
            </div>
          </CardContent>
        </Card>        
        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>

      </form>      
      {/* Team Management - Separate Form */}
      <form onSubmit={(e) => e.preventDefault()}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Team Members */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Current Team Members</h3>
              <div className="grid gap-4">                {teamData.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4 flex items-start gap-4">
                    {/* Member Image */}
                    <div className="flex-shrink-0 relative">
                      {member.imageUrl ? (
                        <>
                          <img 
                            src={member.imageUrl} 
                            alt={member.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          {member._hasNewImage && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded text-center leading-none">
                              📸
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Member Info */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{member.name}</h4>
                        {member._hasNewImage && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Changes Pending
                          </span>
                        )}
                      </div>
                      <p className="text-blue-600 font-medium">{member.position}</p>
                      {member.period && (
                        <p className="text-sm text-gray-500">{member.period}</p>
                      )}
                      {member.bio && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{member.bio}</p>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editTeamMember(member.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTeamMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {teamData.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No team members added yet. Add your first team member below.
                  </div>
                )}
              </div>
            </div>

            {/* Add/Edit Team Member Form */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingTeamMember !== null ? 'Edit Team Member' : 'Add New Team Member'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Name *</Label>
                  <Input
                    id="teamName"
                    name="name"
                    value={teamFormData.name}
                    onChange={handleTeamFormChange}
                    placeholder="Enter member name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="teamPosition">Position *</Label>
                  <Input
                    id="teamPosition"
                    name="position"
                    value={teamFormData.position}
                    onChange={handleTeamFormChange}
                    placeholder="Enter position/role"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="teamPeriod">Period</Label>
                  <Input
                    id="teamPeriod"
                    name="period"
                    value={teamFormData.period}
                    onChange={handleTeamFormChange}
                    placeholder="e.g., 2020 - Present"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="teamImage">Profile Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="teamImage"
                      type="file"
                      accept="image/*"                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (editingTeamMember !== null) {
                            handleTeamImageUpload(file, editingTeamMember);
                          } else {
                            handleTeamImageUpload(file);
                          }
                        }
                      }}
                      disabled={teamUploading.new || (editingTeamMember && teamUploading[editingTeamMember])}
                      className="text-sm"
                    />                    {(teamUploading.new || (editingTeamMember && teamUploading[editingTeamMember])) && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <Label htmlFor="teamBio">Biography</Label>
                <Textarea
                  id="teamBio"
                  name="bio"
                  value={teamFormData.bio}
                  onChange={handleTeamFormChange}
                  placeholder="Enter member biography..."
                  rows={3}
                />
              </div>
                {/* Current Image Preview */}
              {teamFormData.imageUrl && (
                <div className="mt-4">
                  <Label>Current Image</Label>
                  {teamFormData._hasNewImage && (
                    <div className="mb-2 text-sm text-blue-600 font-medium">
                      ⚡ Image Staged - Ready for upload when you save team data
                    </div>
                  )}
                  <div className="relative w-32 h-32 mt-2">
                    <img 
                      src={teamFormData.imageUrl} 
                      alt="Team member preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {teamFormData._hasNewImage && (
                      <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Staged
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Form Actions */}
              <div className="flex gap-2 mt-6">
                {editingTeamMember !== null ? (
                  <>
                    <Button
                      type="button"
                      onClick={updateTeamMember}
                      disabled={teamUploading.new}
                    >
                      Update Member
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={addTeamMember}
                    disabled={teamUploading.new}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                )}
              </div>
            </div>
            
            {/* Save Team Changes */}            {teamData.length > 0 && (
              <div className="border-t pt-6">
                <Button
                  type="button"
                  onClick={saveTeamData}
                  disabled={teamUploading.saving}
                  className="w-full"
                >
                  {teamUploading.saving ? 'Saving Team Data...' : 'Save Team Data to Database'}
                </Button>
              </div>            
            )}
          </CardContent>
        </Card>
      </form>

    </div>
  );
};

export default CompanyInfoPage;
