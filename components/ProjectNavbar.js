'use client';

import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';

const tabs = [
  { name: 'Board', href: 'board' },
  { name: 'Backlog', href: 'backlog' },
  { name: 'Sprints', href: 'sprints' },
  { name: 'Settings', href: 'settings' },
  { name: 'Dashboard', href: 'dashboard' },
];

export default function ProjectNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { projectId } = useParams();

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div onClick={() => router.push("/")} className="flex items-center cursor-pointer">
              <RocketLaunchIcon className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">JiraClone</span>
            </div>
          <div className="flex space-x-4">
            {tabs.map((tab) => {
              const href = tab.name.includes("Dashboard") ? `/${tab.href}` : `/projects/${projectId}/${tab.href}`;
              const isActive = pathname.includes(href);

              return (
                <Link
                  key={tab.name}
                  href={href}
                  className={clsx(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  )}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
