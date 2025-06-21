import React from 'react';
import { motion } from 'framer-motion';
import { useCompanyInfo } from '@/hooks/useCompanyInfo';
import { companyInfo as fallbackCompanyInfo } from '@/data/companyData'; 
import { CheckCircle } from 'lucide-react';

const AboutPage = () => {
  const { companyInfo, loading } = useCompanyInfo();
  const finalCompanyInfo = companyInfo || fallbackCompanyInfo;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat informasi perusahaan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background font-lora">
      <section className=" py-20 md:py-32">
        <img
          src={finalCompanyInfo.heroImage}
          alt="Model mengenakan Batik Kenanga"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        <div className="container mx-auto px-4 relative text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Tentang <span className="text-foreground">Batik Kenanga</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl font-playfair-display text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {finalCompanyInfo.tagline} - Menghidupkan Kembali Tradisi, Menciptakan Identitas.
          </motion.p>
        </div>
      </section>

      <section className="py-16 lg:py-24 z-10 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-montserrat font-bold text-primary mb-6">Cerita Kami</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Batik Kenanga adalah  perusahaan batik yang berdiri di Mojolaban, Sukoharjo, pada tahun {finalCompanyInfo.established}. Batik Kenanga memiliki tagline orisinalitas, loyalitas, kualitas. Batik kenanga merupakan batik dengan proses pembuatan tradisional dengan alat cap. Batik Kenanga ingin membawa image batik yang sebenarnya yaitu “Batik bukan hanya sekedar motif tetapi batik adalah  proses”. Dalam proses produksi Batik Kenanga menganut sistem kekeluargaan sehingga rata-rata pekerja yang bekerja merupakan pegawai yang sudah lama bekerja untuk Batik Kenanga. Sejak didirikan Batik Kenanga menyasar beberapa target pasar termasuk lokal dan internasional dalam skala besar. Untuk ekspor Batik Kenanga bekerjasama dengan PT. Aneka Sandang Interbuana, untuk lokal Batik Kenanga bekerjasama dengan Batik Danar Hadi sebagai supplier.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-lg overflow-hidden shadow-2xl aspect-[4/3]">
                <img  alt="Pengrajin Batik Kenanga sedang bekerja" className="w-full h-full object-cover" src={finalCompanyInfo.homePageImage} />
              </div>
               <div className="absolute -bottom-5 -left-5 bg-card p-4 rounded-lg shadow-xl max-w-sm border border-secondary">
                <p className="font-playfair-display text-lg font-semibold text-primary">
                  "{companyInfo.tagline}"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-secondary/30 relative">
        <div className="absolute inset-0 batik-bg-pattern"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card p-8 rounded-lg shadow-xl"
            >
              <h3 className="text-2xl lg:text-3xl font-montserrat font-bold text-primary mb-4 text-center">Misi Kami</h3>
              <p className="text-lg text-muted-foreground text-center leading-relaxed">
                {finalCompanyInfo.mission}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card p-8 rounded-lg shadow-xl"
            >
              <h3 className="text-2xl lg:text-3xl font-montserrat font-bold text-primary mb-4 text-center">Visi Kami</h3>
              <p className="text-lg text-muted-foreground text-center leading-relaxed">
                {finalCompanyInfo.vision}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-montserrat font-bold text-primary mb-4">Nilai-Nilai Kami</h2>
            <p className="font-playfair-display text-xl text-muted-foreground max-w-2xl mx-auto">
              Prinsip yang memandu setiap langkah dan karya Batik Kenanga.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">            {finalCompanyInfo.values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-card p-6 rounded-lg shadow-lg text-center"
              >
                <CheckCircle className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-montserrat font-semibold mb-2 text-foreground">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-montserrat font-bold text-primary mb-4">
              Sosok Di Balik Batik Kenanga
            </h2>
            <p className="font-playfair-display text-xl text-muted-foreground max-w-2xl mx-auto">
              Figur-figur kunci yang membangun dan mengembangkan warisan Batik Kenanga.
            </p>
          </div>              
          {/* First member - centered */}
          {finalCompanyInfo.team.length > 0 && (
            <div className="flex justify-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-lg shadow-xl overflow-hidden max-w-4xl w-full"
              >                
              <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2 h-96 md:h-80 flex-shrink-0 bg-gray-100 overflow-hidden">
                    <img 
                      src={finalCompanyInfo.team[0].imageUrl} 
                      alt={finalCompanyInfo.team[0].name} 
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                    <h3 className="font-montserrat font-bold text-2xl md:text-3xl text-foreground mb-2">
                      {finalCompanyInfo.team[0].name}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <p className="font-playfair-display text-lg md:text-xl text-primary">
                        {finalCompanyInfo.team[0].position}
                      </p>
                      <p className="text-sm md:text-base text-muted-foreground font-medium italic">
                        {finalCompanyInfo.team[0].period}
                      </p>
                    </div>
                    <div className="border-t border-border pt-4">
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                        {finalCompanyInfo.team[0].bio}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}          
          {/* Remaining members - 2 per row */}
          {finalCompanyInfo.team.length > 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">            
              {finalCompanyInfo.team.slice(1).map((member, index) => (
                <motion.div
                  key={member.id || `team-member-${index + 1}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index + 1) * 0.2 }}
                  className="bg-card rounded-lg shadow-xl overflow-hidden"
                >                  
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full md:w-1/2 h-96 md:h-80 flex-shrink-0 bg-gray-100 overflow-hidden">
                      <img 
                        src={member.imageUrl} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-center">
                      <h3 className="font-montserrat font-bold text-lg sm:text-xl text-foreground mb-1">
                        {member.name}
                      </h3>
                      <div className="space-y-1 mb-3">
                        <p className="font-playfair-display text-base sm:text-lg text-primary">
                          {member.position}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium italic">
                          {member.period}
                        </p>
                      </div>
                      <div className="border-t border-border pt-3">
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
