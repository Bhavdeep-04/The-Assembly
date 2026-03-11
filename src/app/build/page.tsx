import { Metadata } from 'next';
import { BuildInterface } from './BuildInterface'; // Client component containing the layout logic

export const metadata: Metadata = {
  title: 'Configurator | The Assembly',
  description: 'Select your premium PC components.',
};

export default function BuildPage() {
  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-4xl font-black tracking-tight mb-2">The Configurator</h1>
        <p className="text-muted text-lg">Select premium components to build your ultimate machine.</p>
      </div>
      
      {/* We split this into a client component to handle the category state and Framer Motion logic seamlessly */}
      <BuildInterface />
    </div>
  );
}
