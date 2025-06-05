import { companyInfo as staticCompanyInfo } from '../data/companyData';
import { companyInfoService, homepageService } from './supabaseService';

// Company Service that integrates static data with Supabase
class CompanyService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Get complete company information
  async getCompanyInfo() {
    const cacheKey = 'company_info';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Try to get from Supabase first
      const supabaseData = await companyInfoService.getCompanyInfo();
      
      if (supabaseData) {        // Merge Supabase data with static data, giving priority to Supabase
        const mergedData = {
          ...staticCompanyInfo,
          ...supabaseData,
          // Ensure we have fallbacks for critical fields
          name: supabaseData.name || staticCompanyInfo.name,
          tagline: supabaseData.tagline || staticCompanyInfo.tagline,
          logoUrlLight: supabaseData.logo_url_light || staticCompanyInfo.logoUrlLight,
          heroImage: supabaseData.hero_image || staticCompanyInfo.heroImage,
          heroVideo: supabaseData.hero_video || staticCompanyInfo.heroVideo,
          mission: supabaseData.mission || staticCompanyInfo.mission,
          vision: supabaseData.vision || staticCompanyInfo.vision,
          profileSingkat: supabaseData.profile_singkat || staticCompanyInfo.profileSingkat,
          established: supabaseData.established || staticCompanyInfo.established,
          contactInfo: supabaseData.contact_info || {},
          socialMedia: supabaseData.social_media || {},
        };

        this.cache.set(cacheKey, {
          data: mergedData,
          timestamp: Date.now()
        });

        return mergedData;
      } else {
        // Fallback to static data if no Supabase data
        console.log('No company data found in Supabase, using static data');
        return staticCompanyInfo;
      }
    } catch (error) {
      console.error('Error fetching company info from Supabase:', error);
      // Fallback to static data on error
      return staticCompanyInfo;
    }
  }

  // Update company information in Supabase
  async updateCompanyInfo(updates) {
    try {
      const result = await companyInfoService.updateCompanyInfo(updates);
      
      // Clear cache to force refresh
      this.cache.delete('company_info');
      
      return result;
    } catch (error) {
      console.error('Error updating company info:', error);
      throw error;
    }
  }

  // Get homepage content including hero section and featured products
  async getHomepageContent() {
    const cacheKey = 'homepage_content';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const [companyInfo, homepageData] = await Promise.all([
        this.getCompanyInfo(),
        homepageService.getHomepageContent()
      ]);

      const content = {
        companyInfo,
        heroSettings: homepageData.heroSettings || {
          showVideo: true,
          showCTA: true,
          backgroundOpacity: 0.5
        },
        featuredProducts: homepageData.featuredProducts || []
      };

      this.cache.set(cacheKey, {
        data: content,
        timestamp: Date.now()
      });

      return content;
    } catch (error) {
      console.error('Error fetching homepage content:', error);
      // Fallback to basic company info
      return {
        companyInfo: await this.getCompanyInfo(),
        heroSettings: {
          showVideo: true,
          showCTA: true,
          backgroundOpacity: 0.5
        },
        featuredProducts: []
      };
    }
  }
  // Upload company logo
  async uploadLogo(file) {
    try {
      const logoUrl = await companyInfoService.uploadLogo(file);
      
      // Update company info with new logo URL
      await this.updateCompanyInfo({ logo_url_light: logoUrl });
      
      return logoUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  }

  // Upload hero image
  async uploadHeroImage(file) {
    try {
      const imageUrl = await companyInfoService.uploadHeroImage(file);
      
      // Update company info with new hero image URL
      await this.updateCompanyInfo({ hero_image: imageUrl });
      
      return imageUrl;
    } catch (error) {
      console.error('Error uploading hero image:', error);
      throw error;
    }
  }
  // Hero videos are now served statically from public/videos/
  // Remove video upload functionality as per requirements

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get static company data (for fallback)
  getStaticCompanyInfo() {
    return staticCompanyInfo;
  }

  // Initialize company data in Supabase (for first-time setup)
  async initializeCompanyData() {
    try {
      const existingData = await companyInfoService.getCompanyInfo();
      
      if (!existingData) {        // Create initial company data based on static data
        const initialData = {
          name: staticCompanyInfo.name,
          tagline: staticCompanyInfo.tagline,
          profile_singkat: staticCompanyInfo.profileSingkat,
          mission: staticCompanyInfo.mission,
          vision: staticCompanyInfo.vision,
          established: staticCompanyInfo.established,
          logo_url_light: staticCompanyInfo.logoUrlLight,
          hero_image: staticCompanyInfo.heroImage,
          hero_video: staticCompanyInfo.heroVideo,
          contact_info: {
            website: 'https://batikkenanga.com'
          },
          social_media: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        await companyInfoService.createCompanyInfo(initialData);
        console.log('Company data initialized in Supabase');
        
        // Clear cache to force refresh
        this.clearCache();
        
        return initialData;
      }
      
      return existingData;
    } catch (error) {
      console.error('Error initializing company data:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const companyService = new CompanyService();

// Export default for backward compatibility
export default companyService;