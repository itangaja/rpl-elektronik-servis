import { Facebook, Instagram, Twitter, Mail, Phone, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-lg font-bold mb-4">ABOUT US</h3>
            <p className="text-gray-400 text-sm mb-4">
              ServisIn adalah platform servis elektronik terpercaya yang menghubungkan pelanggan dengan teknisi profesional untuk berbagai kebutuhan perbaikan perangkat elektronik.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/Jonathan Tobing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
                title="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://instagram.com/joetobing_29" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com/GANTI_DENGAN_USERNAME_TWITTER" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
                title="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="mailto:joetobing.29@upi.edu" 
                className="text-gray-400 hover:text-white transition"
                title="Email"
              >
                <Mail size={20} />
              </a>
              <a 
                href="https://wa.me/6281395733650" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
                title="WhatsApp"
              >
                <Phone size={20} />
              </a>
              <a 
                href="https://youtube.com/@joetobing1206" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
                title="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-bold mb-4">INFORMATION</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white text-sm transition">Home</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition">Privacy Policy</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white text-sm transition">Frequently Asked Questions (FAQ)</Link></li>
              <li><Link to="/store-location" className="text-gray-400 hover:text-white text-sm transition">Store Location</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm transition">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Order */}
          <div>
            <h3 className="text-lg font-bold mb-4">ORDER</h3>
            <ul className="space-y-2">
              <li><Link to="/how-to-order" className="text-gray-400 hover:text-white text-sm transition">How To Order</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white text-sm transition">Shippings</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-white text-sm transition">Returns</Link></li>
              <li><Link to="/size-chart" className="text-gray-400 hover:text-white text-sm transition">Size Chart</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-bold mb-4">CONTACT US</h3>
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">ONLINE SERVICES</h4>
              <p className="text-gray-400 text-sm">Monday - Sunday</p>
              <p className="text-gray-400 text-sm">08.00 - 17.00 [Exc Public Holiday]</p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">CUSTOMER SERVICES</h4>
              <p className="text-gray-400 text-sm">Email: joetobing.29@upi.edu</p>
              <p className="text-gray-400 text-sm">Whatsapp: 6281396733650</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">WHOLESALE</h4>
              <p className="text-gray-400 text-sm">Call/Whatsapp: 6281395733650</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          © 2025 Copyright ServisIn Industries | Official Website | JAAFF Inc. 
        </div>
      </div>
    </footer>
  );
};

export default Footer;