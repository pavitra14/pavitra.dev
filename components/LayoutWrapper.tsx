'use client';

import { usePathname } from 'next/navigation';
import { SectionContainer } from '@/components/ui';

interface LayoutWrapperProps {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export function LayoutWrapper({ header, footer, children }: LayoutWrapperProps) {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <SectionContainer>
      {header}
      <main className="mt-20 mb-auto">{children}</main>
      {footer}
    </SectionContainer>
  );
}
