import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Nombre del sitio */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
              MotoDespiece
            </Link>
          </div>
          
          {/* Enlaces de la derecha */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin" 
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}