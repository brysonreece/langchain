import React from 'react';
import { Link } from 'react-router-dom';

const DefaultProps = {
  children: undefined,
  title: undefined,
};

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Playground', href: '/playground' },
  { name: 'Settings', href: '/settings' },
];

export default function AppLayout({
  children,
  title,
}: {
  children?: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="py-10">
      <div className="flex items-center justify-around mb-10">
        {navigation.map((item, idx) => (
          <Link
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            to={item.href}
            className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {item.name}
          </Link>
        ))}
      </div>

      {title && (
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {title}
            </h1>
          </div>
        </header>
      )}

      <main className="my-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

AppLayout.defaultProps = DefaultProps;
