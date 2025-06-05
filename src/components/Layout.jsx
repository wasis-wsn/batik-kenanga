
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useCompanyInfo } from '@/hooks/useCompanyInfo';

const Layout = ({ children }) => {
  const { data: companyInfo, loading, error } = useCompanyInfo();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar companyInfo={companyInfo} />
      <motion.main 
        className="flex-grow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
      <Footer companyInfo={companyInfo} />
    </div>
  );
};

export default Layout;
