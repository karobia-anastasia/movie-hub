import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github } from "lucide-react";
import { cn } from "@/lib/utils";

const Footer: React.FC = () => {
  return (
    <footer className={cn("bg-background py-10 mt-10 text-gray-700 dark:text-gray-300")}>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo + Description */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">MovieHub</h2>
          <p className="text-sm leading-relaxed">
            Discover, watch, and save your favorite movies in one place.  
            Powered by TMDB.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <a href="/" className="hover:text-primary">Home</a>
            <a href="" className="hover:text-primary">Movies</a>
            <a href="" className="hover:text-primary">My List</a>
            <a href="" className="hover:text-primary">Contact</a>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook">
              <Facebook className="w-5 h-5 hover:text-primary" />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter className="w-5 h-5 hover:text-primary" />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram className="w-5 h-5 hover:text-primary" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5 hover:text-primary" />
            </a>
            <a href="#" aria-label="YouTube">
              <Youtube className="w-5 h-5 hover:text-primary" />
            </a>
            <a href="#" aria-label="GitHub">
              <Github className="w-5 h-5 hover:text-primary" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4 text-center text-sm text-gray-600 dark:text-gray-500">
        © {new Date().getFullYear()} MovieHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
