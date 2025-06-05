import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { companyInfo as fallbackCompanyInfo } from '@/data/companyData';

const Footer = ({ companyInfo = fallbackCompanyInfo }) => {
  const logoUrl = companyInfo?.logoUrlLight || fallbackCompanyInfo.logoUrlLight;
  const companyName = companyInfo?.name || fallbackCompanyInfo.name;
  const companyDescription = companyInfo?.description || fallbackCompanyInfo.description;
  const socialMedia = companyInfo?.socialMedia || fallbackCompanyInfo.socialMedia;
  const contact = companyInfo?.contact || fallbackCompanyInfo.contact;
  
  return (
    <footer className="bg-secondary mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="inline-block mb-4">
              <img 
                src={logoUrl} 
                alt={`${companyName} Logo`} 
                className="h-12"
                onError={(e) => {
                  e.target.src = fallbackCompanyInfo.logoUrlLight;
                }}
              />
            </Link>
            <p className="text-muted-foreground mb-4 font-lora">
              {companyDescription}
            </p>
            <div className="flex space-x-4">
              {socialMedia?.facebook && (
                <a href={socialMedia.facebook} aria-label={`Facebook ${companyName}`} className="text-foreground hover:text-primary transition-colors">
                  <Facebook size={22} />
                </a>
              )}
              {socialMedia?.instagram && (
                <a href={socialMedia.instagram} aria-label={`Instagram ${companyName}`} className="text-foreground hover:text-primary transition-colors">
                  <Instagram size={22} />
                </a>
              )}
              {socialMedia?.twitter && (
                <a href={socialMedia.twitter} aria-label={`Twitter ${companyName}`} className="text-foreground hover:text-primary transition-colors">
                  <Twitter size={22} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-montserrat font-semibold mb-4 text-primary">Tautan Cepat</h3>
            <ul className="space-y-2 font-lora">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Beranda</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">Tentang Kami</Link></li>
              <li><Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">Produk</Link></li>
              <li><Link to="/costumers" className="text-muted-foreground hover:text-primary transition-colors">Pelanggan Kami</Link></li>
              <li><Link to="/news" className="text-muted-foreground hover:text-primary transition-colors">Berita</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Kontak</Link></li>
              <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-montserrat font-semibold mb-4 text-primary">Layanan</h3>
            <ul className="space-y-2 font-lora">
              <li><Link to="/products?category=batik-kenanga-collection" className="text-muted-foreground hover:text-primary transition-colors">Koleksi Batik Kenanga</Link></li>
              <li><Link to="/products?category=custom-color" className="text-muted-foreground hover:text-primary transition-colors">Warna Custom Logo</Link></li>
              <li><Link to="/products?category=custom-design" className="text-muted-foreground hover:text-primary transition-colors">Custom Mix Design</Link></li>
              <li><Link to="/contact#faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>          <div>
            <h3 className="text-xl font-montserrat font-semibold mb-4 text-primary">Hubungi Kami</h3>
            <ul className="space-y-4 font-lora">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{contact?.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{contact?.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{contact?.email}</span>
              </li>
            </ul>
          </div>
        </div>        <div className="border-t border-border mt-10 pt-8 text-center text-muted-foreground font-lora">
          <p>&copy; {new Date().getFullYear()} {companyName}. Hak Cipta Dilindungi.</p>
          <div className="mt-2 flex justify-center space-x-4 text-sm">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Kebijakan Privasi
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
