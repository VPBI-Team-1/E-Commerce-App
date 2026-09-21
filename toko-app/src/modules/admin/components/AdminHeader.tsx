import Link from 'next/link';

interface AdminHeaderProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function AdminHeader({ title, breadcrumbs }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center space-x-2 text-xs text-gray-500">
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.label} className="flex items-center space-x-2">
                {idx > 0 && <span>/</span>}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-gray-900">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <h1 className="text-base font-semibold text-gray-900">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
        <span>Sistem Operasional Normal</span>
      </div>
    </header>
  );
}
