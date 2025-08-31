import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="gradient-primary h-8 w-8 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ServiceHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/services" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/services') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Serviços
          </Link>
          <Link 
            to="/dashboard" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/services/new" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/services/new') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Criar Serviço
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={() => navigate('/auth')}
            variant="outline"
            size="sm"
            className="hidden md:inline-flex"
          >
            <User className="mr-2 h-4 w-4" />
            Entrar
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container py-4 space-y-4">
            <Link 
              to="/services" 
              className="block text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Serviços
            </Link>
            <Link 
              to="/dashboard" 
              className="block text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/services/new" 
              className="block text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Criar Serviço
            </Link>
            <Button
              onClick={() => {
                navigate('/auth');
                setIsMenuOpen(false);
              }}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <User className="mr-2 h-4 w-4" />
              Entrar
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;