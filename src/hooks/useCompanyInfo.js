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
  // Hero videos are now served statically from public/videos/
  // Remove video upload functionality as per requirements

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
    refresh
  };
};

export const useHomepageContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const fetchHomepageContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getHomepageContent();
      setContent(data);
    } catch (err) {
      console.error('Error fetching homepage content:', err);
      setError(err);
      // Fallback to static data
      const staticData = companyService.getStaticCompanyInfo();
      setContent({
        companyInfo: staticData,
        heroSettings: {
          showVideo: true,
          showCTA: true,
          backgroundOpacity: 0.5
        },
        featuredProducts: []
      });
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    companyService.clearCache();
    fetchHomepageContent();
  };

  return {
    content,
    loading,
    error,
    refresh
  };
};