import React, { useState } from "react";
import { Bell, Sun, Moon, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import LoginDialog from "@/components/auth/LoginDialog/LoginDialog";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";
import { useAuth } from "@/contexts/AuthContext";

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "", label: "Movies" },
    { href: "", label: "My List" },
    { href: "", label: "Contacts" },

  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-8">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                <div className="flex items-center gap-2 mb-8">
                  {/* <Film className="h-8 w-8 text-primary" /> */}
                  <span className="text-xl font-bold text-red-500">MovieHub</span>
                </div>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium hover:text-primary transition-colors py-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-8 pt-8 border-t space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                      {theme === "dark" ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  {!isAuthenticated && (
                    <Button
                      onClick={() => {
                        setLoginOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full "
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <div
              className="flex items-center gap-1 sm:gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              {/* <Film className="h-6 w-6 sm:h-8 sm:w-8 text-primary" /> */}
              <span className="text-lg sm:text-xl font-bold hidden sm:inline text-red-500">
                MovieHub
              </span>
            </div>

            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              className="hidden sm:block w-32 sm:w-48 md:w-64"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden sm:flex h-8 w-8 sm:h-9 sm:w-9"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9">
              <Bell className="h-5 w-5" />
            </Button>
 <SignedOut>
            <LoginDialog>
              <Button variant="outline" size="sm" className="text-xs md:text-sm bg-red-500">
                <User className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline ">Sign In</span>
              </Button>
            </LoginDialog>
          </SignedOut>
          
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </SignedIn>
          </div>
        </div>
      </header>

    </>
  );
};

export default Header;


