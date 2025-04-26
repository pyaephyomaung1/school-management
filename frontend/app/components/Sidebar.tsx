'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Building
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { 
      href: '/dashboard', 
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    { 
      href: '/students', 
      label: 'Students',
      icon: <Users className="w-5 h-5" />
    },
    { 
      href: '/courses', 
      label: 'Courses',
      icon: <BookOpen className="w-5 h-5" />
    },
    { 
      href: '/teachers', 
      label: 'Teachers',
      icon: <GraduationCap className="w-5 h-5" />
    },
    { 
      href: '/departments', 
      label: 'Departments',
      icon: <Building className="w-5 h-5" />
    }
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-64 p-6 bg-white shadow-lg border-r border-gray-200 flex flex-col z-50">
      <div className="mb-10 flex items-center space-x-3">
        <div className="relative w-10 h-10">
          <Image
            src="/assets/images/logo.png"
            alt="Westfield University Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Westfield University</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} Westfield University</p>
      </div>
    </div>
  );
};

export default Sidebar;