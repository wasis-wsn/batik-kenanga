
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useCompanyInfo } from '@/hooks/useCompanyInfo';
import { useSettings } from '@/hooks/useSettings';
import { useEmailService } from '@/services/emailService';
import { companyInfo as fallbackCompanyInfo } from '@/data/companyData';

const ContactPage = () => {
  const { toast } = useToast();
  const { companyInfo } = useCompanyInfo();
  const { getSetting } = useSettings();
  const { sendContactEmail } = useEmailService();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Get dynamic data with fallbacks
  const finalCompanyInfo = companyInfo || fallbackCompanyInfo;
  const contactInfo = finalCompanyInfo.contactInfo || fallbackCompanyInfo.contactInfo;  const businessHours = getSetting('business_hours', 'Senin-Jumat: 08:00-17:00, Sabtu: 08:00-15:00');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form data
      if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
        toast({
          title: "Form tidak lengkap",
          description: "Mohon lengkapi semua field yang wajib diisi.",
          variant: "destructive",
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Email tidak valid",
          description: "Mohon masukkan alamat email yang valid.",
          variant: "destructive",
        });
        return;
      }

      // Send email using email service
      const result = await sendContactEmail(formData);
      
      if (result.success) {
        toast({
          title: "Pesan terkirim!",
          description: "Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda dalam 1x24 jam.",
          duration: 5000,
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        // Handle email send failure
        console.error('Email send failed:', result.error);
        toast({
          title: "Gagal mengirim pesan",
          description: result.message || "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi atau hubungi kami langsung.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Terjadi kesalahan",
        description: "Silakan coba lagi atau hubungi kami langsung melalui WhatsApp atau telepon.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                      {contactInfo?.address || "Jl. Kenanga Indah No. 1"}<br />
                      {contactInfo?.city && contactInfo?.state 
                        ? `${contactInfo.city}, ${contactInfo.state}` 
                        : "Solo, Jawa Tengah"} {contactInfo?.postalCode || "57123"}<br />
                      {contactInfo?.country || "Indonesia"}
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
                      {contactInfo?.phone || "+62 812 9876 5432"}<br />
                      {contactInfo?.whatsapp && contactInfo.whatsapp !== contactInfo.phone && (
                        <>WhatsApp: {contactInfo.whatsapp}</>
                      )}
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
                      {contactInfo?.email || "info@batikenanga.com"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="font-semibold text-lg mb-4">Jam Operasional</h3>
                <div className="space-y-2">
                  {businessHours ? (
                    <div className="text-muted-foreground whitespace-pre-line">
                      {businessHours}
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
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
      </section>      {/* Map Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Lokasi Kami</h2>
            <p className="text-muted-foreground">
              Kunjungi toko kami untuk melihat koleksi batik secara langsung
            </p>
          </div>
            {/* Centered map container */}
          <div className="max-w-4xl mx-auto">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-video bg-muted relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31638.19150524388!2d110.7997644!3d-7.5995639!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a1754da29ece5%3A0xe39c30c7a7ee239d!2sGraha%20Batik%20Kenanga!5e0!3m2!1sid!2sid!4v1749520245617!5m2!1sid!2sid" 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Graha Batik Kenanga Location"
                  className="w-full h-full"
                />
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
