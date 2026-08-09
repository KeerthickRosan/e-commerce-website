import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-navy-light text-gray-300 text-sm mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <img src="/images/footer-logo.webp" alt="ShopSphere logo" className="w-16 h-auto" />
          <div>
            <h4 className="text-white font-semibold mb-2">ShopSphere</h4>
            <p>A full-stack e-commerce platform built with Django REST Framework, React and MySQL.</p>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Get to know us</h4>
          <p>About &middot; Careers &middot; Press</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Let us help you</h4>
          <p>Your Orders &middot; Returns &middot; Support</p>
        </div>
      </div>
      <div className="text-center py-3 border-t border-white/10">
        &copy; {new Date().getFullYear()} ShopSphere. Built for demo purposes.
      </div>
    </footer>
  );
}
