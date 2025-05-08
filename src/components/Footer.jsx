
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { companyInfo } from '@/data/companyData';

const Footer = () => {
  const logoUrl = companyInfo.logoUrlLight;
  return (
    <footer className="bg-secondary mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src={logoUrl} alt="Batik Kenanga Logo" className="h-12" />
            </Link>
            <p className="text-muted-foreground mb-4 font-lora">
              Identitas batik Indonesia, menghadirkan keindahan tradisi dalam setiap helai kain.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook Batik Kenanga" className="text-foreground hover:text-primary transition-colors">
                <Facebook size={22} />
              </a>
              <a href="#" aria-label="Instagram Batik Kenanga" className="text-foreground hover:text-primary transition-colors">
                <Instagram size={22} />
              </a>
              <a href="#" aria-label="Twitter Batik Kenanga" className="text-foreground hover:text-primary transition-colors">
                <Twitter size={22} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-montserrat font-semibold mb-4 text-primary">Tautan Cepat</h3>
            <ul className="space-y-2 font-lora">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Beranda</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">Tentang Kami</Link></li>
              <li><Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">Produk</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Kontak</Link></li>
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
          </div>

          <div>
            <h3 className="text-xl font-montserrat font-semibold mb-4 text-primary">Hubungi Kami</h3>
            <ul className="space-y-4 font-lora">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Jl. Kenanga Indah No. 1, Solo, Indonesia</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">+62 812 9876 5432</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">info@batikenanga.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-8 text-center text-muted-foreground font-lora">
          <p>&copy; {new Date().getFullYear()} Batik Kenanga. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
