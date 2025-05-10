import React from 'react';
import { motion } from 'framer-motion';

const TermsPage = () => {
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
              Syarat & <span className="text-primary">Ketentuan</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Ketentuan penggunaan layanan Batik Kenanga
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="prose prose-lg max-w-4xl mx-auto">
            <h2>Ketentuan Umum</h2>
            <p>
              Dengan mengakses dan menggunakan website Batik Kenanga, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini.
            </p>

            <h2>Pemesanan dan Pembayaran</h2>
            <ul>
              <li>Harga yang tercantum adalah dalam Rupiah (IDR)</li>
              <li>Pembayaran harus dilakukan dalam waktu 24 jam setelah pemesanan</li>
              <li>Pesanan akan diproses setelah pembayaran dikonfirmasi</li>
            </ul>

            <h2>Pengiriman</h2>
            <ul>
              <li>Estimasi waktu pengiriman 3-7 hari kerja</li>
              <li>Biaya pengiriman ditanggung pembeli</li>
              <li>Tracking number akan diberikan setelah paket dikirim</li>
            </ul>

            {/* Add more terms and conditions content */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;