import { useState } from 'react';

interface CartoonMapEnvironmentProps {
  isNightMode: boolean;
}

const NIGHT_STARS: Array<[number, number, number]> = [
  [120, 48, 2.1],
  [215, 76, 1.6],
  [340, 38, 2.3],
  [470, 66, 1.5],
  [580, 42, 1.9],
  [710, 82, 1.7],
  [835, 36, 2.2],
  [960, 62, 1.5],
  [1090, 44, 2.0],
  [1215, 74, 1.8],
  [1465, 52, 2.1],
  [1535, 92, 1.6],
];

// Exact lamppost bulb coordinates on 1600x900 map
const STREET_LAMPS: Array<[number, number]> = [
  [322, 608],  // Far-left hairpin curve
  [586, 380],  // Left workshop entrance
  [677, 411],  // Center workshop island
  [846, 382],  // Right workshop entrance
  [632, 463],  // Substation corner
  [600, 706],  // HQ left garden lamppost
  [732, 770],  // HQ front entrance lamppost
  [808, 792],  // HQ right lawn lamppost
  [1182, 518], // Dispatch garage lawn
  [1118, 646], // Right S-curve upper lamppost
  [1134, 704], // Right S-curve lower lamppost
];

export function CartoonMapEnvironment({ isNightMode }: CartoonMapEnvironmentProps) {
  const [isEvHovered, setIsEvHovered] = useState(false);
  const [isSurveyHovered, setIsSurveyHovered] = useState(false);

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF9C3" stopOpacity="0.95" />
          <stop offset="28%" stopColor="#FDE047" stopOpacity="0.55" />
          <stop offset="65%" stopColor="#F59E0B" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="windowWarmGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.88" />
          <stop offset="45%" stopColor="#FBBF24" stopOpacity="0.48" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="towerCyanGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A5F3FC" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="evCanopyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.92" />
          <stop offset="45%" stopColor="#34D399" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="towerBeaconGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F87171" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#EF4444" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF9C3" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FEF9C3" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 2D Isometric Cartoon EV Charging Station (PEA VOLTA style) beside the main campus road */}
      <g
        className="pointer-events-auto cursor-help"
        onMouseEnter={() => setIsEvHovered(true)}
        onMouseLeave={() => setIsEvHovered(false)}
      >
        {/* Soft drop shadow on lawn */}
        <polygon
          points="944,358 1013,333 1029,362 962,386"
          fill="rgba(24,19,38,0.22)"
        />

        {/* Concrete curb border & Asphalt EV Pull-In Pad connecting seamlessly to the road */}
        <polygon
          points="948,354 1012,331 1025,358 965,380"
          fill={isNightMode ? '#334155' : '#64748B'}
          stroke="#181326"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Light curb edge along back & sides */}
        <polyline
          points="965,380 948,354 1012,331 1025,358"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <polyline
          points="965,380 948,354 1012,331 1025,358"
          fill="none"
          stroke="#181326"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />

        {/* Bay 1 & Bay 2 Emerald-Green EV Charging Zones */}
        <polygon
          points="957,357 982,348 993,368 969,377"
          fill="#10B981"
          fillOpacity="0.88"
          stroke="#ECFDF5"
          strokeWidth="1.1"
        />
        <polygon
          points="986,346 1010,337 1021,357 997,366"
          fill="#10B981"
          fillOpacity="0.88"
          stroke="#ECFDF5"
          strokeWidth="1.1"
        />

        {/* White "EV" pavement mark on Bay 2 (empty bay) */}
        <text
          x="1003"
          y="358"
          textAnchor="middle"
          fill="#ECFDF5"
          fontSize="6.5"
          fontWeight="800"
          fontFamily="Kanit, sans-serif"
          transform="rotate(-20, 1003, 358)"
        >
          EV
        </text>

        {/* Charger Pedestal 1 (Left Bay - Actively Charging) */}
        <g transform="translate(966, 351)">
          <rect
            x="-5"
            y="-18"
            width="10"
            height="19"
            rx="2"
            fill="#F8FAFC"
            stroke="#181326"
            strokeWidth="1.6"
          />
          <rect x="-5" y="-18" width="10" height="4.5" rx="1.5" fill="#741B7E" stroke="#181326" strokeWidth="1.2" />
          {/* Glowing screen */}
          <rect x="-3.2" y="-11.5" width="6.4" height="5" rx="0.8" fill="#0F172A" />
          <rect x="-2.4" y="-10.5" width="4.8" height="3" rx="0.4" fill="#34D399">
            <animate attributeName="opacity" values="0.65;1;0.65" dur="1.1s" repeatCount="indefinite" />
          </rect>
          {/* Top pulsing emerald status bar */}
          <rect x="-3" y="-20" width="6" height="2" rx="0.8" fill="#34D399">
            <animate attributeName="opacity" values="1;0.35;1" dur="0.9s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Charger Pedestal 2 (Right Bay - Available) */}
        <g transform="translate(995, 340)">
          <rect
            x="-5"
            y="-18"
            width="10"
            height="19"
            rx="2"
            fill="#F8FAFC"
            stroke="#181326"
            strokeWidth="1.6"
          />
          <rect x="-5" y="-18" width="10" height="4.5" rx="1.5" fill="#741B7E" stroke="#181326" strokeWidth="1.2" />
          <rect x="-3.2" y="-11.5" width="6.4" height="5" rx="0.8" fill="#0F172A" />
          <rect x="-2.4" y="-10.5" width="4.8" height="3" rx="0.4" fill="#38BDF8" />
          <rect x="-3" y="-20" width="6" height="2" rx="0.8" fill="#38BDF8" />
        </g>

        {/* Charging Cable from Pedestal 1 to Parked EV Car */}
        <path
          d="M 971 344 Q 978 352 979 357"
          fill="none"
          stroke="#181326"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M 971 344 Q 978 352 979 357"
          fill="none"
          stroke="#34D399"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="2.5 2"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="9"
            to="0"
            dur="0.85s"
            repeatCount="indefinite"
          />
        </path>

        {/* Parked 2D Cartoon Electric Car (White/Emerald EV SUV facing toward road) */}
        <g transform="translate(977, 363) scale(0.76)">
          {/* Car ground shadow */}
          <ellipse cx="0" cy="7" rx="16" ry="5.5" fill="rgba(24,19,38,0.28)" />
          {/* EV Body */}
          <path
            d="M -15 2 L -13 -6 L -6 -12 L 7 -12 L 13 -5 L 15 2 Q 15 6 11 6 L -12 6 Q -15 6 -15 2 Z"
            fill="#FFFFFF"
            stroke="#181326"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Teal EV accent stripe */}
          <line x1="-13" y1="1.5" x2="13" y2="1.5" stroke="#10B981" strokeWidth="2.4" />
          {/* Windshield & side window */}
          <polygon points="-9,-5 -5,-10 5,-10 10,-5" fill="#7DD3FC" stroke="#181326" strokeWidth="1.4" />
          {/* Headlights */}
          <circle cx="-11" cy="2" r="2" fill={isNightMode ? '#FEF08A' : '#E0F2FE'} stroke="#181326" strokeWidth="1" />
          <circle cx="9" cy="2" r="2" fill={isNightMode ? '#FEF08A' : '#E0F2FE'} stroke="#181326" strokeWidth="1" />
          {/* Wheels */}
          <circle cx="-8.5" cy="6" r="3.8" fill="#1E293B" stroke="#181326" strokeWidth="1.5" />
          <circle cx="8.5" cy="6" r="3.8" fill="#1E293B" stroke="#181326" strokeWidth="1.5" />
          {/* Floating Pulsing Charging Bolt Badge above car */}
          <g transform="translate(0, -19)">
            <circle cx="0" cy="0" r="6" fill="#10B981" stroke="#181326" strokeWidth="1.4">
              <animate attributeName="r" values="5.4;6.4;5.4" dur="1.4s" repeatCount="indefinite" />
            </circle>
            <polygon points="1,-4 -2.5,0.5 0,0.5 -1,4 2.5,-0.5 0,-0.5" fill="#FEF08A" />
          </g>
        </g>

        {/* Canopy Support Columns */}
        <line x1="955" y1="351" x2="955" y2="322" stroke="#181326" strokeWidth="4.6" strokeLinecap="round" />
        <line x1="955" y1="351" x2="955" y2="322" stroke="#475569" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="1008" y1="332" x2="1008" y2="303" stroke="#181326" strokeWidth="4.6" strokeLinecap="round" />
        <line x1="1008" y1="332" x2="1008" y2="303" stroke="#475569" strokeWidth="2.4" strokeLinecap="round" />

        {/* Sleek Isometric Solar EV Canopy Roof */}
        {/* Roof underside shadow rim */}
        <polygon
          points="945,317 1011,293 1025,313 960,337"
          fill="#4C1D95"
          stroke="#181326"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
        {/* Canopy Top Deck */}
        <polygon
          points="945,313 1011,289 1025,309 960,333"
          fill="#F8FAFC"
          stroke="#181326"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
        {/* Solar PV Panel Array on Canopy Roof */}
        <polygon
          points="952,313 1008,293 1017,306 961,326"
          fill="#0284C7"
          stroke="#181326"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <line x1="970" y1="306.5" x2="979" y2="319.5" stroke="#BAE6FD" strokeWidth="0.9" />
        <line x1="989" y1="299.5" x2="998" y2="312.5" stroke="#BAE6FD" strokeWidth="0.9" />
        <line x1="956.5" y1="319.5" x2="1012.5" y2="299.5" stroke="#BAE6FD" strokeWidth="0.9" />

        {/* Front PEA Purple Fascia & Emerald EV Sign */}
        <polygon
          points="960,333 1025,309 1025,315 960,339"
          fill="#741B7E"
          stroke="#181326"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <line x1="961" y1="337.5" x2="1024" y2="313.5" stroke="#34D399" strokeWidth="1.6" />

        {/* Rooftop Illuminated EV Sign Badge */}
        <g transform="translate(988, 314) rotate(-20)">
          <rect
            x="-13"
            y="-7"
            width="26"
            height="11"
            rx="2.5"
            fill="#10B981"
            stroke="#181326"
            strokeWidth="1.4"
          />
          <text
            x="0"
            y="1"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="7.2"
            fontWeight="800"
            fontFamily="Kanit, sans-serif"
          >
            EV⚡
          </text>
        </g>

        {/* Night Mode Canopy Under-Lighting & EV Headlight Beam */}
        {isNightMode && (
          <g pointerEvents="none">
            <ellipse
              cx="986"
              cy="348"
              rx="36"
              ry="20"
              fill="url(#evCanopyGlow)"
              style={{ mixBlendMode: 'screen' }}
              opacity="0.72"
            />
            <polygon
              points="966,368 948,382 962,387 974,370"
              fill="rgba(254,240,138,0.28)"
            />
          </g>
        )}

        {/* Hover Tooltip */}
        {isEvHovered && (
          <g transform="translate(985, 275)">
            <rect x="-92" y="-16" width="184" height="24" rx="8" fill="#181326" />
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="#6EE7B7"
              fontSize="12"
              fontWeight="600"
              fontFamily="Kanit, sans-serif"
            >
              สถานีชาร์จรถ EV · กฟภ.สาขาฝาง
            </text>
          </g>
        )}
      </g>

      {/* 2D Isometric Cartoon Survey Building (อาคารสำรวจ) + 1 Employee Reading Documents */}
      <g
        className="pointer-events-auto cursor-help"
        onMouseEnter={() => setIsSurveyHovered(true)}
        onMouseLeave={() => setIsSurveyHovered(false)}
      >
        {/* Soft drop shadow on lawn */}
        <polygon
          points="198,694 244,668 298,695 275,738 220,711"
          fill="rgba(24,19,38,0.2)"
        />

        {/* Paved Front Courtyard & Walkway connecting to the bottom-left hairpin road */}
        <polygon
          points="202,690 244,667 294,693 306,712 273,735 224,709"
          fill={isNightMode ? '#78716C' : '#D6CEBE'}
          stroke="#181326"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        {/* Curb highlight */}
        <polyline
          points="224,709 273,735 306,712"
          fill="none"
          stroke="#F5F5F4"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* Building Shadow on Courtyard */}
        <polygon
          points="206,688 248,711 287,690 246,668"
          fill="rgba(24,19,38,0.24)"
        />

        {/* Left-Front Wall (Lit concrete facade) */}
        <polygon
          points="206,686 248,708 248,680 206,658"
          fill="#F1F5F9"
          stroke="#181326"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
        {/* Teal architectural base plinth on left wall */}
        <polygon
          points="206,686 248,708 248,703 206,681"
          fill="#0D9488"
          stroke="#181326"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Cyan panoramic strip window on left wall */}
        <polygon
          points="212,676 242,692 242,683 212,667"
          fill="#38BDF8"
          stroke="#181326"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <line x1="222" y1="672.3" x2="222" y2="681.3" stroke="#181326" strokeWidth="1.1" />
        <line x1="232" y1="677.6" x2="232" y2="686.6" stroke="#181326" strokeWidth="1.1" />
        {/* Window sheen highlight */}
        <line x1="215" y1="671" x2="219" y2="677" stroke="#E0F2FE" strokeWidth="1.2" strokeLinecap="round" />

        {/* Right-Front Entrance Wall (Shaded facade) */}
        <polygon
          points="248,708 284,688 284,660 248,680"
          fill="#CBD5E1"
          stroke="#181326"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
        {/* Base plinth on right wall */}
        <polygon
          points="248,708 284,688 284,683 248,703"
          fill="#0F766E"
          stroke="#181326"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Double Glass Entrance Door */}
        <polygon
          points="257,701 273,692 273,676 257,685"
          fill="#0EA5E9"
          stroke="#181326"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <line x1="265" y1="696.5" x2="265" y2="680.5" stroke="#181326" strokeWidth="1.2" />
        {/* Small side window */}
        <polygon
          points="276,684 281,681 281,671 276,674"
          fill="#67E8F9"
          stroke="#181326"
          strokeWidth="1.2"
        />

        {/* Entrance Canopy Awning above Door */}
        <polygon
          points="254,683 276,671 282,675 260,687"
          fill="#F59E0B"
          stroke="#181326"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <polygon
          points="260,687 282,675 282,678 260,690"
          fill="#B45309"
          stroke="#181326"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Roof Parapet & Deck */}
        <polygon
          points="206,658 242,638 284,660 248,680"
          fill="#741B7E"
          stroke="#181326"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
        {/* Flat inner roof deck */}
        <polygon
          points="214,658 242,642 276,660 248,676"
          fill="#94A3B8"
          stroke="#181326"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Teal rooftop survey accent stripe & GPS/Survey Antenna Mast */}
        <g transform="translate(244, 655)">
          <rect x="-6" y="-4" width="12" height="5" rx="1.5" fill="#0D9488" stroke="#181326" strokeWidth="1.2" />
          <line x1="0" y1="-4" x2="0" y2="-16" stroke="#181326" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="0" cy="-17" r="3.2" fill="#2DD4BF" stroke="#181326" strokeWidth="1.3" />
          <circle cx="0" cy="-17" r="1.2" fill="#FEF08A">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Signboard "สำรวจ" mounted on front-left roof parapet */}
        <g transform="translate(226, 667) rotate(27)">
          <rect
            x="-14"
            y="-6"
            width="28"
            height="10.5"
            rx="2.5"
            fill="#0D9488"
            stroke="#181326"
            strokeWidth="1.4"
          />
          <text
            x="0"
            y="1.5"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="7"
            fontWeight="700"
            fontFamily="Kanit, sans-serif"
          >
            สำรวจ
          </text>
        </g>

        {/* 1 Surveyor Employee Standing in Front Looking at Documents */}
        <g transform="translate(274, 714)">
          {/* Ground shadow */}
          <ellipse cx="0" cy="10.5" rx="7.5" ry="3.2" fill="rgba(24,19,38,0.28)" />
          {/* Legs */}
          <line x1="-2.2" y1="1.5" x2="-2.6" y2="9.5" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="2.2" y1="1.5" x2="2.6" y2="9.5" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
          {/* PEA Survey Teal & Purple Vest */}
          <rect x="-4.5" y="-9.5" width="9" height="11.5" rx="2.4" fill="#0D9488" stroke="#181326" strokeWidth="1.5" />
          <line x1="-4" y1="-3.5" x2="4" y2="-3.5" stroke="#FACC15" strokeWidth="1.8" />
          {/* Arms holding document sheet in front */}
          <line x1="-4" y1="-6.5" x2="-7.5" y2="-3" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" />
          <line x1="3.5" y1="-6.5" x2="-3.5" y2="-3" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" />
          {/* Open Survey Blueprint / Document Sheet in hands */}
          <g transform="translate(-7.5, -5.5) rotate(-12)">
            <rect
              x="-4.5"
              y="-3.5"
              width="9"
              height="7"
              rx="1"
              fill="#FFFFFF"
              stroke="#181326"
              strokeWidth="1.2"
            />
            <line x1="-2.8" y1="-1.5" x2="2.8" y2="-1.5" stroke="#0284C7" strokeWidth="1" />
            <line x1="-2.8" y1="0.5" x2="1.8" y2="0.5" stroke="#0D9488" strokeWidth="1" />
            <line x1="-2.8" y1="2.2" x2="2.5" y2="2.2" stroke="#94A3B8" strokeWidth="0.9" />
          </g>
          {/* Head & White Surveyor Safety Helmet gently nodding while reading */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 0 -10; -6 0 -10; 0 0 -10"
              dur="2.8s"
              repeatCount="indefinite"
            />
            <circle cx="0" cy="-14.5" r="4.4" fill="#FDBA74" stroke="#181326" strokeWidth="1.5" />
            <path d="M -5.2 -15.5 Q 0 -22.5 5 -15.5 Z" fill="#FFFFFF" stroke="#181326" strokeWidth="1.4" />
            <line x1="-5" y1="-15.5" x2="4" y2="-15.5" stroke="#0D9488" strokeWidth="1.4" />
          </g>
        </g>

        {/* Night Mode Entrance Sconce Light on Patio */}
        {isNightMode && (
          <circle cx="265" cy="679" r="3" fill="#FEF08A" />
        )}

        {/* Hover Tooltip */}
        {isSurveyHovered && (
          <g transform="translate(332, 690)">
            <rect x="-98" y="-16" width="196" height="24" rx="8" fill="#181326" />
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="#5EEAD4"
              fontSize="12"
              fontWeight="600"
              fontFamily="Kanit, sans-serif"
            >
              อาคารสำรวจ · พนักงานตรวจสอบเอกสาร
            </text>
          </g>
        )}
      </g>

      {/* Live Animated Dashboard Graphics on the Wooden Pavilion Whiteboard (Day & Night) */}
      <g transform="translate(1384, 603) skewY(23.6)">
        {/* Crisp screen backing */}
        <rect
          x="0"
          y="0"
          width="44"
          height="24"
          rx="1.5"
          fill={isNightMode ? '#0F172A' : '#F8FAFC'}
          stroke="#CBD5E1"
          strokeWidth="0.6"
        />
        {/* Header bar */}
        <rect x="1.5" y="1.5" width="41" height="3.5" rx="0.8" fill="#741B7E" />
        <circle cx="4" cy="3.2" r="0.9" fill="#34D399">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
        </circle>

        {/* Animated Vertical Bar Charts (Left half) */}
        <rect x="3" y="13" width="3.5" height="8" rx="0.6" fill="#0284C7">
          <animate attributeName="height" values="6;13;7;11;6" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="y" values="15;8;14;10;15" dur="2.6s" repeatCount="indefinite" />
        </rect>
        <rect x="8" y="10" width="3.5" height="11" rx="0.6" fill="#10B981">
          <animate attributeName="height" values="12;6;14;8;12" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="y" values="9;15;7;13;9" dur="2.2s" repeatCount="indefinite" />
        </rect>
        <rect x="13" y="12" width="3.5" height="9" rx="0.6" fill="#F59E0B">
          <animate attributeName="height" values="8;14;6;12;8" dur="2.9s" repeatCount="indefinite" />
          <animate attributeName="y" values="13;7;15;9;13" dur="2.9s" repeatCount="indefinite" />
        </rect>
        <rect x="18" y="9" width="3.5" height="12" rx="0.6" fill="#4F46E5">
          <animate attributeName="height" values="10;7;13;9;10" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="y" values="11;14;8;12;11" dur="2.4s" repeatCount="indefinite" />
        </rect>

        {/* Live Animated Trend Line (Right half) */}
        <rect
          x="24"
          y="7"
          width="17.5"
          height="14"
          rx="1"
          fill={isNightMode ? 'rgba(30,41,59,0.9)' : '#EEF2FF'}
        />
        <polyline
          points="25,18 28.5,14 32,16 35.5,10 39,12 41,8.5"
          fill="none"
          stroke={isNightMode ? '#38BDF8' : '#741B7E'}
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3 2"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="10"
            to="0"
            dur="1.1s"
            repeatCount="indefinite"
          />
        </polyline>
        <circle cx="40.5" cy="9" r="1.4" fill="#F59E0B">
          <animate attributeName="r" values="1.1;1.9;1.1" dur="1.3s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Night Mode Atmospheric Sky, Lights & Streetlamps */}
      {isNightMode && (
        <g>
          {/* Crescent Moon & Twinkling Stars in Upper Sky */}
          <g transform="translate(260, 74)">
            <circle cx="0" cy="0" r="38" fill="url(#moonGlow)" />
            <path
              d="M -4 -16 A 16 16 0 1 0 14 10 A 13 13 0 1 1 -4 -16 Z"
              fill="#FEF08A"
              stroke="#FDE047"
              strokeWidth="1.2"
            />
          </g>
          {NIGHT_STARS.map(([sx, sy, sr], idx) => (
            <circle
              key={idx}
              cx={sx}
              cy={sy}
              r={sr}
              fill="#FEF9C3"
              opacity={idx % 2 === 0 ? 0.9 : 0.6}
            >
              <animate
                attributeName="opacity"
                values="0.45;0.95;0.45"
                dur={`${2.2 + (idx % 4) * 0.6}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Soft Illuminated Building Interiors */}
          <g style={{ mixBlendMode: 'screen' }}>
            {/* HQ Building (เอกสารหม้อแปลง) Glass Facades & Entrance */}
            <ellipse cx="662" cy="645" rx="68" ry="38" fill="url(#windowWarmGlow)" opacity="0.72" />
            <ellipse cx="835" cy="672" rx="46" ry="34" fill="url(#windowWarmGlow)" opacity="0.65" />
            <ellipse cx="916" cy="670" rx="54" ry="36" fill="url(#windowWarmGlow)" opacity="0.68" />
            <ellipse cx="732" cy="708" rx="46" ry="22" fill="url(#windowWarmGlow)" opacity="0.85" />

            {/* คลังหม้อแปลง (Workshop) Open Service Bays & Side Windows */}
            <ellipse cx="654" cy="376" rx="52" ry="30" fill="url(#windowWarmGlow)" opacity="0.78" />
            <ellipse cx="766" cy="372" rx="54" ry="30" fill="url(#windowWarmGlow)" opacity="0.78" />
            <ellipse cx="574" cy="354" rx="34" ry="14" fill="url(#windowWarmGlow)" opacity="0.55" />
            <ellipse cx="844" cy="344" rx="34" ry="14" fill="url(#windowWarmGlow)" opacity="0.55" />

            {/* ขายหม้อแปลง (Dispatch Garage) 4 Open Garage Bays behind parked trucks */}
            <ellipse cx="1048" cy="396" rx="28" ry="20" fill="url(#windowWarmGlow)" opacity="0.68" />
            <ellipse cx="1088" cy="412" rx="28" ry="20" fill="url(#windowWarmGlow)" opacity="0.68" />
            <ellipse cx="1128" cy="426" rx="28" ry="20" fill="url(#windowWarmGlow)" opacity="0.68" />
            <ellipse cx="1168" cy="442" rx="28" ry="20" fill="url(#windowWarmGlow)" opacity="0.68" />

            {/* Control Tower Cyan Glass Cabin & Lower Entrance */}
            <ellipse cx="1346" cy="306" rx="74" ry="28" fill="url(#towerCyanGlow)" opacity="0.82" />
            <ellipse cx="1306" cy="512" rx="28" ry="16" fill="url(#windowWarmGlow)" opacity="0.8" />

            {/* Wooden Pavilion Warm Lantern & Dashboard Screen Glow */}
            <ellipse cx="1395" cy="640" rx="58" ry="30" fill="url(#windowWarmGlow)" opacity="0.8" />

            {/* Survey Building (อาคารสำรวจ) Windows & Front Entrance Patio Glow */}
            <ellipse cx="228" cy="680" rx="28" ry="18" fill="url(#windowWarmGlow)" opacity="0.72" />
            <ellipse cx="268" cy="692" rx="34" ry="22" fill="url(#windowWarmGlow)" opacity="0.78" />
          </g>

          {/* Tower Spire Blinking Red Aviation Beacon */}
          <g transform="translate(1346, 56)">
            <circle cx="0" cy="0" r="18" fill="url(#towerBeaconGlow)">
              <animate attributeName="opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="4" fill="#EF4444" />
          </g>

          {/* Substation Telemetry Status Glows */}
          <circle cx="250" cy="512" r="4.5" fill="#34D399" opacity="0.9" />
          <circle cx="322" cy="540" r="4.5" fill="#34D399" opacity="0.9" />
          <circle cx="496" cy="482" r="4.5" fill="#38BDF8" opacity="0.9" />

          {/* Streetlamp Bulbs & Halos Aligned Precisely on Every Lamppost */}
          {STREET_LAMPS.map(([lx, ly], idx) => (
            <g key={`lamp-${idx}`} transform={`translate(${lx}, ${ly})`}>
              <circle cx="0" cy="0" r="30" fill="url(#lampGlow)" />
              <circle cx="0" cy="0" r="4.2" fill="#FEF9C3" />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
