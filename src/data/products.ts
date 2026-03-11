export type Category = 'Motherboard' | 'Processor' | 'RAM' | 'CPU Cooler' | 'GPU' | 'Power Supply' | 'Case';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  image?: string;
  specs: Record<string, string>;
  description: string;
}

export const products: Product[] = [
  // Processors
  {
    id: 'cpu-1',
    name: 'Intel Core i9-14900K',
    category: 'Processor',
    price: 48999,
    specs: { Cores: '24', Threads: '32', BaseClock: '3.2 GHz', BoostClock: '6.0 GHz' },
    description: 'The ultimate gaming processor delivering uncompromised performance and seamless multitasking.',
  },
  {
    id: 'cpu-2',
    name: 'AMD Ryzen 9 7950X3D',
    category: 'Processor',
    price: 57999,
    specs: { Cores: '16', Threads: '32', Cache: '144MB', TDP: '120W' },
    description: 'Precision engineered for raw gaming performance and heavy multithreaded workloads.',
  },
  {
    id: 'cpu-3',
    name: 'AMD Ryzen 7 7800X3D',
    category: 'Processor',
    price: 32999,
    specs: { Cores: '8', Threads: '16', Cache: '104MB', TDP: '120W' },
    description: 'The sweet spot for gaming. Dominant efficiency and sheer frame-pushing power.',
  },

  // Motherboards
  {
    id: 'mob-1',
    name: 'ASUS ROG Maximus Z790 Hero',
    category: 'Motherboard',
    price: 52499,
    specs: { Socket: 'LGA 1700', FormFactor: 'ATX', Memory: 'DDR5', PCIe: '5.0' },
    description: 'Premium connectivity and robust power delivery for bleeding-edge systems.',
  },
  {
    id: 'mob-2',
    name: 'GIGABYTE X670E AORUS Master',
    category: 'Motherboard',
    price: 40999,
    specs: { Socket: 'AM5', FormFactor: 'E-ATX', Memory: 'DDR5', Storage: '4x M.2' },
    description: 'Next-gen platform readiness with exceptional thermal designs and aesthetics.',
  },
  {
    id: 'mob-3',
    name: 'MSI MAG B650 Tomahawk WiFi',
    category: 'Motherboard',
    price: 18499,
    specs: { Socket: 'AM5', FormFactor: 'ATX', Memory: 'DDR5', Networking: 'Wi-Fi 6E' },
    description: 'Battle-proven durability and essential features for a reliable core build.',
  },

  // RAM
  {
    id: 'ram-1',
    name: 'Corsair Dominator Titanium RGB 64GB',
    category: 'RAM',
    price: 26499,
    specs: { Capacity: '64GB (2x32GB)', Type: 'DDR5', Speed: '6000MT/s', CAS: 'CL30' },
    description: 'State-of-the-art forged aluminum memory delivering blinding speed and low latency.',
  },
  {
    id: 'ram-2',
    name: 'G.Skill Trident Z5 Neo RGB 32GB',
    category: 'RAM',
    price: 9999,
    specs: { Capacity: '32GB (2x16GB)', Type: 'DDR5', Speed: '6000MT/s', CAS: 'CL30' },
    description: 'Tuned specifically for AM5 with vibrant RGB and unyielding stability.',
  },
  {
    id: 'ram-3',
    name: 'Crucial Pro 32GB DDR5',
    category: 'RAM',
    price: 7899,
    specs: { Capacity: '32GB (2x16GB)', Type: 'DDR5', Speed: '5600MT/s', CAS: 'CL46' },
    description: 'No-frills performance memory for strict minimalist builds.',
  },

  // CPU Cooler
  {
    id: 'clr-1',
    name: 'NZXT Kraken Elite 360 RGB',
    category: 'CPU Cooler',
    price: 24999,
    specs: { Type: 'AIO Liquid', Radiator: '360mm', Display: '2.36" LCD', Fans: '3x 120mm' },
    description: 'High-performance cooling unified with a striking customizable LCD screen.',
  },
  {
    id: 'clr-2',
    name: 'Noctua NH-D15 chromax.black',
    category: 'CPU Cooler',
    price: 9999,
    specs: { Type: 'Air Cooler', Height: '165mm', Fans: '2x 140mm', Color: 'Black' },
    description: 'Legendary silent cooling performance now in a stealthy all-black profile.',
  },
  {
    id: 'clr-3',
    name: 'Lian Li Galahad II Trinity Performance 360',
    category: 'CPU Cooler',
    price: 14499,
    specs: { Type: 'AIO Liquid', Radiator: '360mm', Pump: '3200 RPM', Fans: '3x 120mm' },
    description: 'Uncompromising thermal dissipation for high-core-count processors.',
  },

  // GPU
  {
    id: 'gpu-1',
    name: 'NVIDIA GeForce RTX 4090 Founders Edition',
    category: 'GPU',
    price: 132999,
    specs: { VRAM: '24GB GDDR6X', Cores: '16384', Power: '450W', Length: '304mm' },
    description: 'The absolute pinnacle of graphics rendering. Beyond fast.',
  },
  {
    id: 'gpu-2',
    name: 'ASUS ROG Strix GeForce RTX 4080 SUPER',
    category: 'GPU',
    price: 99999,
    specs: { VRAM: '16GB GDDR6X', Cores: '10240', Boost: '2670 MHz', Slots: '3.5' },
    description: 'Monstrous cooling meets enthusiast-level frame generation.',
  },
  {
    id: 'gpu-3',
    name: 'Sapphire NITRO+ Radeon RX 7900 XTX',
    category: 'GPU',
    price: 87499,
    specs: { VRAM: '24GB GDDR6', StreamProcs: '6144', Power: '420W', Length: '320mm' },
    description: 'Dominant rasterization performance with an exquisite vapor chamber design.',
  },

  // Power Supply
  {
    id: 'psu-1',
    name: 'Corsair RM1000x Shift',
    category: 'Power Supply',
    price: 17499,
    specs: { Wattage: '1000W', Efficiency: '80+ Gold', Modular: 'Fully', Interface: 'Side Panel' },
    description: 'Revolutionary side-panel cable interface for immaculate cable management.',
  },
  {
    id: 'psu-2',
    name: 'Seasonic Vertex GX-1200',
    category: 'Power Supply',
    price: 20999,
    specs: { Wattage: '1200W', Efficiency: '80+ Gold', ATX: '3.0', PCIe: '5.0 Ready' },
    description: 'Bulletproof reliability capable of managing extreme transient loads.',
  },
  {
    id: 'psu-3',
    name: 'EVGA SuperNOVA 850G FTW',
    category: 'Power Supply',
    price: 12499,
    specs: { Wattage: '850W', Efficiency: '80+ Gold', Modular: 'Fully', Warranty: '10 Years' },
    description: 'Trusted, steady power delivery for high-end gaming configurations.',
  },

  // Case
  {
    id: 'cas-1',
    name: 'Fractal Design North XL',
    category: 'Case',
    price: 14499,
    specs: { FormFactor: 'Mid Tower', Motherboard: 'E-ATX', Material: 'Steel & Wood', Fans: '3x 140mm' },
    description: 'Scandinavian design principles blending sophisticated wood elements with high airflow.',
  },
  {
    id: 'cas-2',
    name: 'Lian Li O11 Vision',
    category: 'Case',
    price: 11999,
    specs: { FormFactor: 'Mid Tower', Motherboard: 'E-ATX', Glass: '3 sides seamless', Radiator: 'Up to 2x 360mm' },
    description: 'Unobstructed panoramic tempered glass providing the ultimate showcase.',
  },
  {
    id: 'cas-3',
    name: 'Hyte Y70 Touch',
    category: 'Case',
    price: 29999,
    specs: { FormFactor: 'Dual Chamber', Display: '14.1" 4K LCD', GPU: 'Vertical Only', Riser: 'PCIe 4.0' },
    description: 'A striking statement piece integrating a massive interactive 4K touchscreen.',
  }
];
