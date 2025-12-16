"use client";

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Client-only wrapper to prevent SSR hydration issues on iOS Safari
function ClientOnly<P extends object>({ 
  component: Component,
  ...props 
}: { component: ComponentType<P> } & P) {
  return <Component {...props as P} />;
}

export function createClientOnlyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) {
  return dynamic(() => importFn(), {
    ssr: false,
    loading: () => <div style={{ minHeight: '200px' }} />,
  });
}

export default ClientOnly;
