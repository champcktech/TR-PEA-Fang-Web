import {
  Boxes,
  FileText,
  LayoutDashboard,
  MapPinned,
  Network,
  RadioTower,
  Store,
  Warehouse,
} from 'lucide-react';
import type { MapZone } from '../data/transformerHubData';

interface ZoneIconProps {
  name: MapZone['iconName'];
  className?: string;
}

export function ZoneIcon({ name, className = 'w-4 h-4' }: ZoneIconProps) {
  switch (name) {
    case 'warehouse':
      return <Warehouse className={className} />;
    case 'sales':
      return <Store className={className} />;
    case 'docs':
      return <FileText className={className} />;
    case 'diagram':
      return <Network className={className} />;
    case 'dashboard':
      return <LayoutDashboard className={className} />;
    case 'survey':
      return <MapPinned className={className} />;
    case 'inventory':
      return <Boxes className={className} />;
    case 'gis':
      return <RadioTower className={className} />;
  }
}
