import { useEffect, useRef, useState } from 'react';

interface CartoonMapVehiclesProps {
  visible: boolean;
  isNightMode: boolean;
}

export function CartoonMapVehicles({
  visible,
  isNightMode,
}: CartoonMapVehiclesProps) {
  const craneCableRef = useRef<SVGLineElement>(null);
  const craneLoadRef = useRef<SVGGElement>(null);
  const craneBoomRef = useRef<SVGGElement>(null);
  const bucketArmRef = useRef<SVGGElement>(null);
  const sparkRef = useRef<SVGGElement>(null);
  const [hoveredVehicle, setHoveredVehicle] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;

    let rafId = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsedSec = (now - startTime) / 1000;

      // 1. Crane lifting & lowering transformer smoothly inside คลังหม้อแปลง
      const liftWave = (Math.sin(elapsedSec * 1.35) + 1) / 2;
      const cableExtend = -34 + liftWave * 17;
      const boomLiftDeg = -3.5 + liftWave * 4.5;

      if (craneBoomRef.current) {
        craneBoomRef.current.setAttribute(
          'transform',
          `rotate(${boomLiftDeg.toFixed(2)}, 10, -18)`
        );
      }
      if (craneCableRef.current) {
        craneCableRef.current.setAttribute('y2', cableExtend.toFixed(1));
      }
      if (craneLoadRef.current) {
        craneLoadRef.current.setAttribute(
          'transform',
          `translate(56, ${(cableExtend + 12).toFixed(1)})`
        );
      }

      // 2. Bucket truck upper boom gently working near overhead transformer lines at ลานผังหม้อแปลง
      const workWave = Math.sin(elapsedSec * 1.1);
      const bucketAngle = workWave * 2.2;
      if (bucketArmRef.current) {
        bucketArmRef.current.setAttribute(
          'transform',
          `rotate(${bucketAngle.toFixed(2)}, -6, -12)`
        );
      }
      if (sparkRef.current) {
        const sparkPulse = Math.max(0, Math.sin(elapsedSec * 6.5));
        sparkRef.current.setAttribute(
          'opacity',
          (sparkPulse > 0.72 ? (sparkPulse - 0.72) * 3.5 : 0).toFixed(2)
        );
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [visible]);

  if (!visible) return null;

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      aria-hidden="true"
    >
      {/* 1. Active Transformer Crane Rig inside คลังหม้อแปลง courtyard (690, 452) */}
      <g
        transform="translate(690, 452) scale(0.84)"
        className="pointer-events-auto cursor-help"
        onMouseEnter={() => setHoveredVehicle('crane')}
        onMouseLeave={() => setHoveredVehicle(null)}
      >
        <ellipse cx="14" cy="14" rx="48" ry="12" fill="rgba(24,19,38,0.22)" />
        {isNightMode && (
          <g pointerEvents="none">
            {/* Headlight beam left + work floodlight onto transformer */}
            <polygon points="-32,-6 -76,-14 -76,16 -32,2" fill="rgba(254,240,138,0.32)" />
            <polygon points="18,-22 72,-42 78,24 18,-10" fill="rgba(254,249,195,0.22)" />
          </g>
        )}

        {/* Safety cones */}
        <g transform="translate(-44, 12)">
          <polygon points="0,-10 5,2 -5,2" fill="#F97316" stroke="#181326" strokeWidth="1.5" />
          <line x1="-2.5" y1="-4" x2="2.5" y2="-4" stroke="#FFFFFF" strokeWidth="1.5" />
        </g>
        <g transform="translate(66, 16)">
          <polygon points="0,-10 5,2 -5,2" fill="#F97316" stroke="#181326" strokeWidth="1.5" />
          <line x1="-2.5" y1="-4" x2="2.5" y2="-4" stroke="#FFFFFF" strokeWidth="1.5" />
        </g>

        {/* Outrigger Stabilizers */}
        <line x1="-22" y1="6" x2="-30" y2="14" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="20" y1="6" x2="28" y2="14" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />

        {/* Crane Truck Chassis */}
        <rect x="-32" y="-12" width="52" height="16" rx="4" fill="#F59E0B" stroke="#181326" strokeWidth="2.2" />
        <path
          d="M -32 -12 L -32 -24 Q -32 -28 -27 -28 L -14 -28 L -10 -12 Z"
          fill="#741B7E"
          stroke="#181326"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <polygon points="-28,-24 -16,-24 -13,-15 -28,-15" fill="#BAE6FD" stroke="#181326" strokeWidth="1.5" />
        <rect x="0" y="-22" width="18" height="10" rx="2" fill="#741B7E" stroke="#181326" strokeWidth="2" />

        {/* Flashing Amber Beacon */}
        <circle cx="-21" cy="-31" r="3.5" fill="#FDE047" stroke="#181326" strokeWidth="1.5">
          <animate attributeName="opacity" values="1;0.35;1" dur="0.9s" repeatCount="indefinite" />
        </circle>

        {/* Wheels */}
        <circle cx="-20" cy="6" r="6.5" fill="#1E293B" stroke="#181326" strokeWidth="2" />
        <circle cx="-20" cy="6" r="2.3" fill="#CBD5E1" />
        <circle cx="8" cy="6" r="6.5" fill="#1E293B" stroke="#181326" strokeWidth="2" />
        <circle cx="8" cy="6" r="2.3" fill="#CBD5E1" />

        {/* Articulated Crane Boom & Hoisting Transformer */}
        <g ref={craneBoomRef}>
          <line
            x1="10"
            y1="-18"
            x2="56"
            y2="-46"
            stroke="#181326"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="10"
            y1="-18"
            x2="56"
            y2="-46"
            stroke="#FBBF24"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <line
            ref={craneCableRef}
            x1="56"
            y1="-46"
            x2="56"
            y2="-24"
            stroke="#181326"
            strokeWidth="2"
          />
          <g ref={craneLoadRef} transform="translate(56, -12)">
            <line x1="0" y1="-12" x2="-7" y2="-4" stroke="#475569" strokeWidth="1.3" />
            <line x1="0" y1="-12" x2="7" y2="-4" stroke="#475569" strokeWidth="1.3" />
            <rect x="-6" y="-8" width="2.5" height="4.5" fill="#E2E8F0" stroke="#181326" strokeWidth="1.1" />
            <rect x="-1.2" y="-8" width="2.5" height="4.5" fill="#E2E8F0" stroke="#181326" strokeWidth="1.1" />
            <rect x="3.5" y="-8" width="2.5" height="4.5" fill="#E2E8F0" stroke="#181326" strokeWidth="1.1" />
            <rect
              x="-10"
              y="-4"
              width="20"
              height="18"
              rx="2.5"
              fill="#38BDF8"
              stroke="#181326"
              strokeWidth="1.8"
            />
            <line x1="-6" y1="0" x2="-6" y2="10" stroke="#0369A1" strokeWidth="1.6" />
            <line x1="0" y1="0" x2="0" y2="10" stroke="#0369A1" strokeWidth="1.6" />
            <line x1="6" y1="0" x2="6" y2="10" stroke="#0369A1" strokeWidth="1.6" />
          </g>
        </g>

        {/* Cartoon Lineman Supervising */}
        <g transform="translate(34, 4)">
          <circle cx="0" cy="-14" r="4.5" fill="#FDBA74" stroke="#181326" strokeWidth="1.5" />
          <path d="M -5 -15 Q 0 -22 5 -15 Z" fill="#FACC15" stroke="#181326" strokeWidth="1.4" />
          <rect x="-4" y="-9" width="8" height="10" rx="2" fill="#741B7E" stroke="#181326" strokeWidth="1.5" />
          <line x1="-2" y1="1" x2="-2" y2="8" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="2" y1="1" x2="2" y2="8" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {hoveredVehicle === 'crane' && (
          <g transform="translate(12, -68)">
            <rect x="-86" y="-16" width="172" height="24" rx="8" fill="#181326" />
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="#FDE047"
              fontSize="12.5"
              fontWeight="600"
              fontFamily="Kanit, sans-serif"
            >
              รถยกหม้อแปลง · คลังหม้อแปลง
            </text>
          </g>
        )}
      </g>

      {/* 2. Active Aerial Bucket Truck Repairing Power Lines at ลานผังหม้อแปลง (472, 565) */}
      <g
        transform="translate(472, 565) scale(0.86)"
        className="pointer-events-auto cursor-help"
        onMouseEnter={() => setHoveredVehicle('bucket-repair')}
        onMouseLeave={() => setHoveredVehicle(null)}
      >
        <ellipse cx="0" cy="13" rx="44" ry="11" fill="rgba(24,19,38,0.22)" />
        {isNightMode && (
          <g pointerEvents="none">
            {/* Truck headlights + upward work spotlight */}
            <polygon points="31,-6 75,-12 75,16 31,2" fill="rgba(254,240,138,0.32)" />
            <polygon points="6,-18 -64,-108 -14,-114 14,-18" fill="rgba(254,249,195,0.2)" />
          </g>
        )}

        {/* Safety cones */}
        <g transform="translate(-44, 12)">
          <polygon points="0,-10 5,2 -5,2" fill="#F97316" stroke="#181326" strokeWidth="1.5" />
          <line x1="-2.5" y1="-4" x2="2.5" y2="-4" stroke="#FFFFFF" strokeWidth="1.5" />
        </g>
        <g transform="translate(42, 12)">
          <polygon points="0,-10 5,2 -5,2" fill="#F97316" stroke="#181326" strokeWidth="1.5" />
          <line x1="-2.5" y1="-4" x2="2.5" y2="-4" stroke="#FFFFFF" strokeWidth="1.5" />
        </g>

        {/* Outriggers */}
        <line x1="-24" y1="6" x2="-31" y2="13" stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="18" y1="6" x2="26" y2="13" stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round" />

        {/* Bucket Truck Body (Facing Right) */}
        <rect x="-30" y="-12" width="38" height="17" rx="3" fill="#F59E0B" stroke="#181326" strokeWidth="2.2" />
        <rect x="-26" y="-6" width="30" height="4" fill="#741B7E" />

        {/* Truck Cab */}
        <path
          d="M 8 -18 L 22 -18 Q 28 -18 30 -9 L 31 5 L 8 5 Z"
          fill="#FFFFFF"
          stroke="#181326"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <polygon points="12,-14 22,-14 26,-5 12,-5" fill="#BAE6FD" stroke="#181326" strokeWidth="1.5" />
        <rect x="8" y="-1" width="22" height="3.5" fill="#741B7E" />

        {/* Flashing Amber Beacon on Cab */}
        <circle cx="17" cy="-21" r="3.5" fill="#FDE047" stroke="#181326" strokeWidth="1.5">
          <animate attributeName="opacity" values="1;0.35;1" dur="0.85s" repeatCount="indefinite" />
        </circle>

        {/* Wheels */}
        <circle cx="-17" cy="6" r="6" fill="#1E293B" stroke="#181326" strokeWidth="2" />
        <circle cx="-17" cy="6" r="2.2" fill="#CBD5E1" />
        <circle cx="19" cy="6" r="6" fill="#1E293B" stroke="#181326" strokeWidth="2" />
        <circle cx="19" cy="6" r="2.2" fill="#CBD5E1" />

        {/* Extended Articulated Aerial Boom reaching up toward substation lines */}
        <g ref={bucketArmRef}>
          {/* Turret pedestal */}
          <rect x="-12" y="-19" width="12" height="7" rx="2" fill="#741B7E" stroke="#181326" strokeWidth="1.8" />
          {/* Lower boom arm going right-up */}
          <line
            x1="-6"
            y1="-16"
            x2="24"
            y2="-46"
            stroke="#181326"
            strokeWidth="7.5"
            strokeLinecap="round"
          />
          <line
            x1="-6"
            y1="-16"
            x2="24"
            y2="-46"
            stroke="#FBBF24"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          {/* Upper boom arm bending left-up toward the substation towers */}
          <line
            x1="24"
            y1="-46"
            x2="-30"
            y2="-78"
            stroke="#181326"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <line
            x1="24"
            y1="-46"
            x2="-30"
            y2="-78"
            stroke="#FDE047"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
          {/* Joint pin */}
          <circle cx="24" cy="-46" r="4" fill="#741B7E" stroke="#181326" strokeWidth="1.6" />

          {/* Aerial Bucket Basket + Working Lineman */}
          <g transform="translate(-32, -78)">
            {/* Lineman inside basket */}
            <rect x="-5" y="-16" width="10" height="11" rx="2" fill="#741B7E" stroke="#181326" strokeWidth="1.5" />
            <circle cx="0" cy="-21" r="4.5" fill="#FDBA74" stroke="#181326" strokeWidth="1.5" />
            <path d="M -5 -22 Q 0 -29 5 -22 Z" fill="#FACC15" stroke="#181326" strokeWidth="1.4" />
            {/* Insulated hot-stick tool reaching to power line */}
            <line x1="-4" y1="-12" x2="-22" y2="-24" stroke="#F97316" strokeWidth="2.4" strokeLinecap="round" />

            {/* Spark glint at tool tip */}
            <g ref={sparkRef} transform="translate(-24, -26)" opacity="0">
              <polygon
                points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2"
                fill="#FEF08A"
                stroke="#F59E0B"
                strokeWidth="1"
              />
            </g>

            {/* Yellow Fiberglass Bucket */}
            <rect
              x="-9"
              y="-6"
              width="18"
              height="13"
              rx="2.5"
              fill="#FACC15"
              stroke="#181326"
              strokeWidth="1.8"
            />
            <rect x="-9" y="-6" width="18" height="3.5" rx="1" fill="#FFFFFF" stroke="#181326" strokeWidth="1.3" />
          </g>
        </g>

        {/* Ground Safety Watcher */}
        <g transform="translate(-34, 4)">
          <circle cx="0" cy="-14" r="4.2" fill="#FDBA74" stroke="#181326" strokeWidth="1.4" />
          <path d="M -4.8 -15 Q 0 -21 4.8 -15 Z" fill="#FACC15" stroke="#181326" strokeWidth="1.3" />
          <rect x="-3.8" y="-9" width="7.6" height="9.5" rx="2" fill="#741B7E" stroke="#181326" strokeWidth="1.4" />
          <line x1="-1.8" y1="0.5" x2="-1.8" y2="7" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <line x1="1.8" y1="0.5" x2="1.8" y2="7" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        </g>

        {hoveredVehicle === 'bucket-repair' && (
          <g transform="translate(-14, -122)">
            <rect x="-90" y="-16" width="180" height="24" rx="8" fill="#181326" />
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="#FDE047"
              fontSize="12.5"
              fontWeight="600"
              fontFamily="Kanit, sans-serif"
            >
              รถกระเช้าซ่อมไฟ · ลานผังหม้อแปลง
            </text>
          </g>
        )}
      </g>

      {/* 3. Transformer Hauler Truck with Blinking Hazard Lights at ขายหม้อแปลง (992, 472) */}
      <g
        transform="translate(992, 472) scale(0.84)"
        className="pointer-events-auto cursor-help"
        onMouseEnter={() => setHoveredVehicle('sales-truck')}
        onMouseLeave={() => setHoveredVehicle(null)}
      >
        <ellipse cx="0" cy="12" rx="34" ry="8.5" fill="rgba(24,19,38,0.24)" />

        {isNightMode && (
          <polygon
            points="30,-6 80,-14 80,16 30,2"
            fill="rgba(254,240,138,0.34)"
            pointerEvents="none"
          />
        )}

        {/* Flatbed Rear */}
        <rect x="-32" y="-5" width="38" height="12" rx="2.5" fill="#E2E8F0" stroke="#181326" strokeWidth="2.1" />
        <rect x="-32" y="1" width="38" height="3" fill="#94A3B8" />

        {/* Distribution Transformer Cargo on Flatbed */}
        <g transform="translate(-14, -18)">
          <rect x="-10" y="-3" width="20" height="16" rx="2.5" fill="#10B981" stroke="#181326" strokeWidth="1.9" />
          <line x1="-5" y1="1" x2="-5" y2="9" stroke="#047857" strokeWidth="1.6" />
          <line x1="0" y1="1" x2="0" y2="9" stroke="#047857" strokeWidth="1.6" />
          <line x1="5" y1="1" x2="5" y2="9" stroke="#047857" strokeWidth="1.6" />
          <rect x="-6.5" y="-8" width="2.5" height="5" fill="#F8FAFC" stroke="#181326" strokeWidth="1.1" />
          <rect x="-1.2" y="-8" width="2.5" height="5" fill="#F8FAFC" stroke="#181326" strokeWidth="1.1" />
          <rect x="4" y="-8" width="2.5" height="5" fill="#F8FAFC" stroke="#181326" strokeWidth="1.1" />
        </g>

        {/* PEA Truck Cab */}
        <path
          d="M 6 -19 L 22 -19 Q 28 -19 30 -10 L 31 7 L 6 7 Z"
          fill="#741B7E"
          stroke="#181326"
          strokeWidth="2.1"
          strokeLinejoin="round"
        />
        <polygon points="10,-15 21,-15 25,-6 10,-6" fill="#BAE6FD" stroke="#181326" strokeWidth="1.5" />
        <rect x="6" y="-1" width="24" height="4" fill="#FACC15" />

        {/* Wheels */}
        <circle cx="-19" cy="8" r="6" fill="#1E293B" stroke="#181326" strokeWidth="2" />
        <circle cx="-19" cy="8" r="2.2" fill="#CBD5E1" />
        <circle cx="19" cy="8" r="6" fill="#1E293B" stroke="#181326" strokeWidth="2" />
        <circle cx="19" cy="8" r="2.2" fill="#CBD5E1" />

        {/* Blinking Hazard Lights (Front, Rear & Roof Lightbar) */}
        <g>
          <animate attributeName="opacity" values="1;0.15;1" dur="0.7s" repeatCount="indefinite" />
          {/* Rear amber hazard halo + bulb */}
          <circle cx="-33" cy="-2" r="8" fill="rgba(251,191,36,0.45)" />
          <circle cx="-32" cy="-2" r="3" fill="#F59E0B" stroke="#181326" strokeWidth="1.2" />

          {/* Front amber hazard halo + bulb */}
          <circle cx="31" cy="2" r="8" fill="rgba(251,191,36,0.45)" />
          <circle cx="30" cy="2" r="3" fill="#F59E0B" stroke="#181326" strokeWidth="1.2" />

          {/* Roof emergency amber beacon */}
          <circle cx="15" cy="-23" r="8.5" fill="rgba(253,224,71,0.45)" />
          <rect x="11" y="-25" width="8" height="4" rx="1.5" fill="#FDE047" stroke="#181326" strokeWidth="1.3" />
        </g>

        {hoveredVehicle === 'sales-truck' && (
          <g transform="translate(0, -40)">
            <rect x="-92" y="-16" width="184" height="24" rx="8" fill="#181326" />
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="#FDE047"
              fontSize="12.5"
              fontWeight="600"
              fontFamily="Kanit, sans-serif"
            >
              รถขนส่งหม้อแปลง · เปิดไฟขอทาง
            </text>
          </g>
        )}
      </g>

      {/* 4. Two PEA Electrical Workers Talking in Front of HQ (เอกสารหม้อแปลง) at (702, 744) */}
      <g
        transform="translate(702, 744) scale(0.95)"
        className="pointer-events-auto cursor-help"
        onMouseEnter={() => setHoveredVehicle('hq-staff')}
        onMouseLeave={() => setHoveredVehicle(null)}
      >
        {/* Ground shadow */}
        <ellipse cx="0" cy="11" rx="18" ry="5.5" fill="rgba(24,19,38,0.22)" />

        {/* Worker 1 (Left, holding clipboard/tablet, facing right) */}
        <g transform="translate(-9, 0)">
          {/* Legs */}
          <line x1="-2" y1="1" x2="-2.5" y2="10" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="2" y1="1" x2="2.5" y2="10" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
          {/* Violet PEA vest */}
          <rect x="-4.5" y="-10" width="9" height="11.5" rx="2.5" fill="#741B7E" stroke="#181326" strokeWidth="1.5" />
          {/* Reflective stripe */}
          <line x1="-4" y1="-4" x2="4" y2="-4" stroke="#FACC15" strokeWidth="1.8" />
          {/* Gesturing arm with clipboard */}
          <line x1="3" y1="-7" x2="8.5" y2="-4" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 3 -7; -10 3 -7; 0 3 -7"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </line>
          {/* Head & Yellow Helmet */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 0 -11; 4 0 -11; 0 0 -11"
              dur="2.4s"
              repeatCount="indefinite"
            />
            <circle cx="0" cy="-15" r="4.5" fill="#FDBA74" stroke="#181326" strokeWidth="1.5" />
            <path d="M -5 -16 Q 0 -23 5.5 -16 Z" fill="#FACC15" stroke="#181326" strokeWidth="1.4" />
          </g>
        </g>

        {/* Worker 2 (Right, facing left, nodding) */}
        <g transform="translate(9, 1)">
          {/* Legs */}
          <line x1="-2" y1="1" x2="-2.5" y2="10" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="2" y1="1" x2="2.5" y2="10" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
          {/* PEA Dark Slate / Violet uniform */}
          <rect x="-4.5" y="-10" width="9" height="11.5" rx="2.5" fill="#5B21B6" stroke="#181326" strokeWidth="1.5" />
          <line x1="-4" y1="-4" x2="4" y2="-4" stroke="#E2E8F0" strokeWidth="1.6" />
          {/* Listening/gesturing arm */}
          <line x1="-3" y1="-7" x2="-7.5" y2="-3" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" />
          {/* Head & White Engineer Helmet */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 0 -11; -5 0 -11; 0 0 -11"
              dur="2.1s"
              repeatCount="indefinite"
            />
            <circle cx="0" cy="-15" r="4.5" fill="#FDBA74" stroke="#181326" strokeWidth="1.5" />
            <path d="M -5.5 -16 Q 0 -23 5 -16 Z" fill="#FFFFFF" stroke="#181326" strokeWidth="1.4" />
          </g>
        </g>

        {/* Small cartoon conversation bubble floating between them */}
        <g transform="translate(0, -30)">
          <rect x="-11" y="-8" width="22" height="12" rx="5" fill="#FFFFFF" stroke="#181326" strokeWidth="1.4" />
          <circle cx="-5" cy="-2" r="1.4" fill="#741B7E">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="-2" r="1.4" fill="#741B7E">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="5" cy="-2" r="1.4" fill="#741B7E">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
          </circle>
        </g>

        {hoveredVehicle === 'hq-staff' && (
          <g transform="translate(0, -52)">
            <rect x="-86" y="-16" width="172" height="24" rx="8" fill="#181326" />
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="#FDE047"
              fontSize="12"
              fontWeight="600"
              fontFamily="Kanit, sans-serif"
            >
              พนักงานไฟฟ้า กฟภ. กำลังคุยงาน
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}
