import React from 'react';
import { motion } from 'framer-motion';
import { companyInfo } from '@/data/companyData'; 
import { CheckCircle } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-background font-lora">
      <section className=" py-20 md:py-32">
        <img
          src={companyInfo.heroImage}
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
            {companyInfo.tagline} - Menghidupkan Kembali Tradisi, Menciptakan Identitas.
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
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Didirikan pada tahun {companyInfo.established}, Batik Kenanga lahir dari kecintaan mendalam terhadap warisan budaya batik Indonesia. Berawal dari sebuah sanggar kecil di Solo, kami bertumbuh dengan misi untuk tidak hanya melestarikan keindahan batik klasik, tetapi juga mengembangkannya agar relevan dengan zaman.
              </p>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Kami percaya bahwa setiap helai batik adalah kanvas cerita, sebuah medium ekspresi identitas yang unik. Oleh karena itu, kami berdedikasi untuk menghasilkan karya batik berkualitas tinggi, baik melalui koleksi siap pakai maupun layanan kustomisasi yang memungkinkan Anda memiliki batik yang benar-benar personal.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Di Batik Kenanga, tradisi bertemu inovasi. Para pengrajin ahli kami bekerja dengan ketelitian tinggi, menggunakan teknik turun-temurun yang dipadukan dengan desain kontemporer untuk menciptakan mahakarya batik yang tak lekang oleh waktu.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-lg overflow-hidden shadow-2xl aspect-square">
                <img  alt="Pengrajin Batik Kenanga sedang bekerja" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1666578296079-52024f45d962" />
              </div>
               <div className="absolute -bottom-5 -left-5 bg-card p-4 rounded-lg shadow-xl max-w-sm border border-secondary">
                <p className="font-playfair-display text-lg font-semibold text-primary">
                  "Setiap goresan canting adalah doa, setiap warna adalah jiwa."
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
                {companyInfo.mission}
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
                {companyInfo.vision}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyInfo.values.map((value, index) => (
              <motion.div
                key={index}
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
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {companyInfo.team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-card rounded-lg shadow-xl overflow-hidden flex flex-col sm:flex-row items-center"
              >
                <div className="w-full sm:w-1/3 aspect-square sm:aspect-auto sm:h-full">
                  <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 sm:w-2/3">
                  <h3 className="font-montserrat font-bold text-2xl text-foreground">{member.name}</h3>
                  <div className="space-y-2">
                    <p className="font-playfair-display text-lg text-primary">{member.position}</p>
                    <p className="text-sm text-muted-foreground font-medium italic">
                      {member.period}
                    </p>
                  </div>
                  <div className="mt-3 border-t border-border pt-3">
                    <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
