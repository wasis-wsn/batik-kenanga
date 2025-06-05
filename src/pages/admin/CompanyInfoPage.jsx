import React, { useState, useEffect } from 'react';
import { Save, Building, Phone, Mail, MapPin, Globe, Image, Video } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../components/ui/use-toast';
import { useCompanyInfo } from '../../hooks/useCompanyInfo';

const CompanyInfoPage = () => {
  const { toast } = useToast();
  const { companyInfo, loading, error, updateCompanyInfo, uploadLogo, uploadHeroImage, refresh } = useCompanyInfo();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});
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
    if (!file) return;

    try {
      setUploading(prev => ({ ...prev, [uploadType]: true }));

      let result;      switch (uploadType) {
        case 'logo':
          result = await uploadLogo(file);
          break;
        case 'heroImage':
          result = await uploadHeroImage(file);
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
          </CardContent>        </Card>

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
            </div>

            <div className="text-sm text-gray-600">
              <p>• Logo: Recommended size 200x200px, PNG format with transparent background</p>
              <p>• Hero Image: Recommended size 1920x1080px for best results</p>
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
    </div>
  );
};

export default CompanyInfoPage;
