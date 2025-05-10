import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-background">
      <section className="relative py-16 md:py-24 bg-secondary">
        <div className="absolute inset-0 batik-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
              Kebijakan <span className="text-primary">Privasi</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Komitmen kami dalam melindungi privasi Anda
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="prose prose-lg max-w-4xl mx-auto">
            <h2>Pendahuluan</h2>
            <p>
              Batik Kenanga berkomitmen untuk melindungi privasi pengguna. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
            </p>

            <h2>Informasi yang Kami Kumpulkan</h2>
            <ul>
              <li>Informasi pribadi (nama, alamat, email, nomor telepon)</li>
              <li>Informasi transaksi pembelian</li>
              <li>Data penggunaan website</li>
              <li>Informasi perangkat dan browser</li>
            </ul>

            <h2>Penggunaan Informasi</h2>
            <p>
              Informasi yang kami kumpulkan digunakan untuk:
            </p>
            <ul>
              <li>Memproses pesanan dan transaksi</li>
              <li>Mengirim update dan newsletter</li>
              <li>Meningkatkan layanan kami</li>
              <li>Komunikasi terkait produk dan promosi</li>
            </ul>

            {/* Add more privacy policy content */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;