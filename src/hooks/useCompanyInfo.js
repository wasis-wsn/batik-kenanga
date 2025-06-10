import { useState, useEffect } from 'react';
import { companyService } from '../services/companyService';

export const useCompanyInfo = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getCompanyInfo();
      setCompanyInfo(data);
    } catch (err) {
      console.error('Error fetching company info:', err);
      setError(err);
      // Fallback to static data on error
      const staticData = companyService.getStaticCompanyInfo();
      setCompanyInfo(staticData);
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyInfo = async (updates) => {
    try {
      const updatedData = await companyService.updateCompanyInfo(updates);
      setCompanyInfo(prev => ({ ...prev, ...updatedData }));
      return updatedData;
    } catch (err) {
      console.error('Error updating company info:', err);
      setError(err);
      throw err;
    }
  };

  const uploadLogo = async (file) => {
    try {
      const logoUrl = await companyService.uploadLogo(file);
      setCompanyInfo(prev => ({ ...prev, logoUrlLight: logoUrl }));
      return logoUrl;
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError(err);
      throw err;
    }
  };

  const uploadHeroImage = async (file) => {
    try {
      const imageUrl = await companyService.uploadHeroImage(file);
      setCompanyInfo(prev => ({ ...prev, heroImage: imageUrl }));
      return imageUrl;
    } catch (err) {
      console.error('Error uploading hero image:', err);
      setError(err);
      throw err;
    }
  };

  const uploadHomePageImage = async (file) => {
    try {
      const imageUrl = await companyService.uploadHomePageImage(file);
      setCompanyInfo(prev => ({ ...prev, homePageImage: imageUrl }));
      return imageUrl;
    } catch (err) {
      console.error('Error uploading home page image:', err);
      setError(err);
      throw err;
    }
  };

  const uploadProfileImage = async (file) => {
    try {
      const imageUrl = await companyService.uploadProfileImage(file);
      setCompanyInfo(prev => ({ ...prev, profileImage: imageUrl }));
      return imageUrl;
    } catch (err) {
      console.error('Error uploading profile image:', err);
      setError(err);
      throw err;
    }
  };
  const uploadTeamMemberImage = async (file, memberIndex, existingImageUrl = null) => {
    try {
      const imageUrl = await companyService.uploadTeamMemberImage(file, memberIndex, existingImageUrl);
      return imageUrl;
    } catch (err) {
      console.error('Error uploading team member image:', err);
      setError(err);
      throw err;
    }
  };

  const deleteTeamMemberImages = async (memberIndex) => {
    try {
      await companyService.deleteTeamMemberImages(memberIndex);
      return true;
    } catch (err) {
      console.error('Error deleting team member images:', err);
      setError(err);
      throw err;
    }
  };

  const updateTeamData = async (teamData) => {
    try {
      const result = await companyService.updateTeamData(teamData);
      setCompanyInfo(prev => ({ ...prev, team: teamData }));
      return result;
    } catch (err) {
      console.error('Error updating team data:', err);
      setError(err);
      throw err;
    }
  };

  const refresh = () => {
    companyService.clearCache();
    fetchCompanyInfo();
  };
  return {
    companyInfo,
    loading,
    error,
    updateCompanyInfo,
    uploadLogo,
    uploadHeroImage,
    uploadHomePageImage,
    uploadProfileImage,    uploadTeamMemberImage,
    deleteTeamMemberImages,
    updateTeamData,
    refresh
  };
};