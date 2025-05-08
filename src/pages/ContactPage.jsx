
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Pesan terkirim!",
        description: "Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.",
        duration: 5000,
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-secondary">
        <div className="absolute inset-0 batik-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Hubungi <span className="text-primary">Kami</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Kami siap membantu Anda dengan segala pertanyaan dan kebutuhan
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">Informasi Kontak</h2>
              <p className="text-muted-foreground mb-8">
                Jangan ragu untuk menghubungi kami jika Anda memiliki pertanyaan tentang produk, pesanan, atau informasi lainnya. Tim kami siap membantu Anda.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Alamat</h3>
                    <p className="text-muted-foreground">
                      Jl. Batik Indah No. 123<br />
                      Yogyakarta, Indonesia 55281
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Telepon</h3>
                    <p className="text-muted-foreground">
                      +62 812 3456 7890<br />
                      +62 274 123456
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-muted-foreground">
                      info@batikelegance.com<br />
                      cs@batikelegance.com
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="font-semibold text-lg mb-4">Jam Operasional</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Senin - Jumat</span>
                    <span>08:00 - 17:00 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sabtu</span>
                    <span>09:00 - 15:00 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minggu & Hari Libur</span>
                    <span>Tutup</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Kirim Pesan</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="Masukkan nama lengkap" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="Masukkan email" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        placeholder="Masukkan nomor telepon" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subjek</Label>
                      <Input 
                        id="subject" 
                        name="subject" 
                        value={formData.subject} 
                        onChange={handleChange} 
                        placeholder="Masukkan subjek pesan" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan</Label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      placeholder="Tulis pesan Anda di sini..." 
                      rows={5} 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                      required 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        Kirim Pesan <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Lokasi Kami</h2>
            <p className="text-muted-foreground">
              Kunjungi toko kami untuk melihat koleksi batik secara langsung
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="aspect-video bg-muted relative">
              <img  alt="Peta lokasi Batik Elegance" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs">
                  <h3 className="font-semibold mb-1">Batik Elegance</h3>
                  <p className="text-sm text-muted-foreground">
                    Jl. Batik Indah No. 123, Yogyakarta, Indonesia 55281
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pertanyaan Umum</h2>
            <p className="text-muted-foreground">
              Jawaban untuk pertanyaan yang sering diajukan
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="font-semibold text-lg mb-2">Berapa lama waktu pengiriman?</h3>
              <p className="text-muted-foreground">
                Waktu pengiriman bervariasi tergantung lokasi. Untuk wilayah Jawa, biasanya membutuhkan waktu 2-3 hari kerja. Untuk luar Jawa, sekitar 3-5 hari kerja. Untuk pengiriman internasional, sekitar 7-14 hari kerja.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="font-semibold text-lg mb-2">Apakah ada garansi untuk produk?</h3>
              <p className="text-muted-foreground">
                Ya, kami memberikan garansi kualitas untuk semua produk kami. Jika ada cacat produksi, Anda dapat mengembalikan produk dalam waktu 7 hari setelah penerimaan untuk penggantian atau pengembalian dana.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="font-semibold text-lg mb-2">Metode pembayaran apa yang tersedia?</h3>
              <p className="text-muted-foreground">
                Kami menerima berbagai metode pembayaran, termasuk transfer bank, kartu kredit/debit, e-wallet (GoPay, OVO, Dana), dan pembayaran melalui minimarket (Indomaret, Alfamart).
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="font-semibold text-lg mb-2">Apakah ada diskon untuk pembelian dalam jumlah besar?</h3>
              <p className="text-muted-foreground">
                Ya, kami menyediakan diskon khusus untuk pembelian dalam jumlah besar. Silakan hubungi tim kami untuk informasi lebih lanjut dan penawaran khusus.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
