import { Metadata } from 'next';
import { BuildInterface } from './BuildInterface';

export const metadata: Metadata = {
  title: 'Configurator | ASMBLY',
  description: 'Configure your ultimate custom PC build with premium components.',
};

export default function BuildPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-3">Custom PC Builder</p>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-3 leading-tight">
          Build Your<br />
          <span className="text-gradient">Ultimate Machine</span>
        </h1>
        <p className="text-muted text-base max-w-lg">
          Select a component category below to explore parts. Your build summary and total price appear at the bottom.
        </p>
      </div>

      <BuildInterface />
    </div>
  );
}

