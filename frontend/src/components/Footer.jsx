import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-flipkart-darkgray text-gray-400 mt-8">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-gray-200 font-semibold text-sm mb-4 uppercase tracking-wider">About</h4>
          <ul className="space-y-2 text-sm">
            {['About Us', 'Careers', 'Press', 'Corporate Information'].map((item) => (
              <li key={item}>
                <span className="hover:text-white cursor-pointer transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-gray-200 font-semibold text-sm mb-4 uppercase tracking-wider">Help</h4>
          <ul className="space-y-2 text-sm">
            {['Payments', 'Shipping', 'Cancellation & Returns', 'FAQ', 'Report Infringement'].map((item) => (
              <li key={item}>
                <span className="hover:text-white cursor-pointer transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-gray-200 font-semibold text-sm mb-4 uppercase tracking-wider">Policy</h4>
          <ul className="space-y-2 text-sm">
            {['Return Policy', 'Terms of Use', 'Security', 'Privacy', 'Sitemap'].map((item) => (
              <li key={item}>
                <span className="hover:text-white cursor-pointer transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-gray-200 font-semibold text-sm mb-4 uppercase tracking-wider">Social</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: '🐦 Twitter', href: '#' },
              { label: '📘 Facebook', href: '#' },
              { label: '📸 Instagram', href: '#' },
              { label: '▶️ YouTube', href: '#' },
            ].map((item) => (
              <li key={item.label}>
                <span className="hover:text-white cursor-pointer transition-colors">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold italic text-lg">
              Shop<span className="text-flipkart-yellow">Smart</span>
            </span>
            <span className="text-gray-500">|</span>
            <span>© {new Date().getFullYear()} ShopSmart Pvt. Ltd.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              🏦 <span>Registered in India</span>
            </span>
            <span className="flex items-center gap-1.5">
              🔒 <span>Secure Payments</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
