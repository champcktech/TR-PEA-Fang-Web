export type MapZoneId =
  | 'warehouse-stock'
  | 'transformer-sales'
  | 'transformer-docs'
  | 'transformer-diagram'
  | 'dashboard'
  | 'survey';

export interface MapZone {
  id: MapZoneId;
  code: string;
  name: string;
  shortLabel: string;
  subtitle: string;
  description: string;
  /** Percentage position (0-100) matching the 2D cartoon map building */
  x: number;
  y: number;
  accentHex: string;
  iconName: 'warehouse' | 'sales' | 'docs' | 'diagram' | 'dashboard' | 'survey';
}

export interface WorkLink {
  id: string;
  zoneId: MapZoneId;
  title: string;
  description: string;
  url: string;
  systemType: string;
  isPinned?: boolean;
  isCustom?: boolean;
  createdBy?: string;
  updatedBy?: string;
}

export const VALID_ZONE_IDS: MapZoneId[] = [
  'warehouse-stock',
  'transformer-sales',
  'transformer-docs',
  'transformer-diagram',
  'dashboard',
  'survey',
];

export const MAP_BACKDROP_IMAGE =
  '/src/assets/images/pea_fang_minimap_bg_1794882954306.jpg';

export const MAP_ZONES: MapZone[] = [
  {
    id: 'warehouse-stock',
    code: '01',
    name: 'คลังหม้อแปลง',
    shortLabel: 'คลังหม้อแปลง',
    subtitle: 'ทะเบียนคุมสต็อกหม้อแปลง เบิก-จ่าย และตรวจสอบสภาพ',
    description:
      'ศูนย์รวมลิ้งค์ข้อมูลสต็อกหม้อแปลงสำรอง ทะเบียนเลขซีเรียล การเบิก-คืนพัสดุ และสถานะหม้อแปลงในคลัง กฟภ.สาขาฝาง',
    x: 42,
    y: 35,
    accentHex: '#0284C7',
    iconName: 'warehouse',
  },
  {
    id: 'transformer-sales',
    code: '02',
    name: 'ขายหม้อแปลง',
    shortLabel: 'ขายหม้อแปลง',
    subtitle: 'งานจำหน่ายหม้อแปลง คำนวณราคา และส่งมอบติดตั้ง',
    description:
      'ศูนย์รวมลิ้งค์ระบบงานขายหม้อแปลงไฟฟ้า แบบฟอร์มเสนอราคา ติดตามสถานะคำขอซื้อ และกำหนดการส่งมอบงาน',
    x: 71,
    y: 44,
    accentHex: '#D97706',
    iconName: 'sales',
  },
  {
    id: 'transformer-docs',
    code: '03',
    name: 'เอกสารหม้อแปลง',
    shortLabel: 'เอกสารหม้อแปลง',
    subtitle: 'แบบฟอร์ม รายงาน คู่มือ และแฟ้มเอกสารงานหม้อแปลง',
    description:
      'คลังรวมลิ้งค์เอกสารงานหม้อแปลง หนังสือเวียน แบบฟอร์มปฏิบัติงาน รายงานประจำเดือน และเอกสารมาตรฐาน กฟภ.',
    x: 49,
    y: 70,
    accentHex: '#741B7E',
    iconName: 'docs',
  },
  {
    id: 'transformer-diagram',
    code: '04',
    name: 'ผังหม้อแปลง',
    shortLabel: 'ผังหม้อแปลง',
    subtitle: 'แผนผังติดตั้ง พิกัด GIS และโครงข่ายระบบจำหน่าย',
    description:
      'ศูนย์รวมลิ้งค์ผังหม้อแปลง แผนที่พิกัดจุดติดตั้งระบบจำหน่าย และผังวงจรหม้อแปลงในพื้นที่รับผิดชอบสาขาฝาง',
    x: 20,
    y: 49,
    accentHex: '#059669',
    iconName: 'diagram',
  },
  {
    id: 'dashboard',
    code: '05',
    name: 'Dashboard',
    shortLabel: 'Dashboard',
    subtitle: 'แดชบอร์ดสรุปผล สถิติ และภาพรวมงานหม้อแปลง',
    description:
      'ศูนย์รวมลิ้งค์ Dashboard รายงานสถิติ ตัวชี้วัด KPI และข้อมูลสรุปผลการดำเนินงานแผนกหม้อแปลง กฟภ.สาขาฝาง',
    x: 88,
    y: 59,
    accentHex: '#4F46E5',
    iconName: 'dashboard',
  },
  {
    id: 'survey',
    code: '06',
    name: 'สำรวจ',
    shortLabel: 'สำรวจ',
    subtitle: 'งานสำรวจพื้นที่ ออกแบบผังระบบจำหน่าย และเอกสารสำรวจ',
    description:
      'ศูนย์รวมลิ้งค์งานสำรวจหน้างาน แบบร่างงานสำรวจ พิกัด GIS และเอกสารตรวจสอบพื้นที่ กฟภ.สาขาฝาง',
    x: 15.5,
    y: 65,
    accentHex: '#0D9488',
    iconName: 'survey',
  },
];

export const DEFAULT_WORK_LINKS: WorkLink[] = [];
