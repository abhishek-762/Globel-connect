
import React from 'react';
import { Link } from 'react-router-dom';

const SocialIcon: React.FC<{ href: string, path: string }> = ({ href, path }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary transition-colors duration-300">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d={path} />
        </svg>
    </a>
);

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold font-montserrat text-primary">Global Connect</h3>
                        <p className="mt-4 text-gray-400 text-sm">Your gateway to unforgettable travel experiences.</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold font-poppins">Quick Links</h4>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/about" className="text-gray-400 hover:text-secondary">About Us</Link></li>
                            <li><Link to="/packages" className="text-gray-400 hover:text-secondary">Packages</Link></li>
                            <li><Link to="/destinations" className="text-gray-400 hover:text-secondary">Destinations</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-secondary">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold font-poppins">Contact Info</h4>
                        <ul className="mt-4 space-y-2 text-gray-400">
                            <li>123 Travel Lane, Wanderlust City, 98765</li>
                            <li>Phone: (123) 456-7890</li>
                            <li>Email: info@globalconnect.travel</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold font-poppins">Follow Us</h4>
                        <div className="flex mt-4 space-x-4">
                            <SocialIcon href="#" path="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                            <SocialIcon href="#" path="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.799 4.65-.596.223-1.22.28-1.853.111.606 1.879 2.36 3.245 4.449 3.282-1.623 1.275-3.666 2.035-5.885 2.035-.382 0-.76-.023-1.13-.066 2.099 1.349 4.595 2.13 7.29 2.13 8.755 0 13.541-7.249 13.541-13.541 0-.206-.005-.412-.013-.617.93-.672 1.731-1.511 2.368-2.454z" />
                            <SocialIcon href="#" path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44c0-.795-.645-1.44-1.441-1.44z" />
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Global Connect. All Rights Reserved.</p>
                    <div className="mt-2">
                        <Link to="/admin/login" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Admin Login</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
