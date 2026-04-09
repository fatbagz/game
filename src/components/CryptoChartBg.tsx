interface CryptoChartBgProps {
  visible: boolean;
}

export default function CryptoChartBg({ visible }: CryptoChartBgProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center"
      style={{ zIndex: 0 }}
    >
      <svg
        viewBox="0 0 900 600"
        className="w-full h-full"
        style={{ opacity: 0.07, maxWidth: '1400px' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <line x1="80" y1="520" x2="850" y2="520" stroke="#333" strokeWidth="3" strokeLinecap="round" />
        <line x1="80" y1="520" x2="80" y2="40" stroke="#333" strokeWidth="3" strokeLinecap="round" />

        {[100, 180, 260, 340, 420].map((y) => (
          <line
            key={y}
            x1="80"
            y1={y}
            x2="840"
            y2={y}
            stroke="#888"
            strokeWidth="1"
            strokeDasharray="8 6"
          />
        ))}

        <text x="60" y="425" textAnchor="end" fontFamily="'Patrick Hand', cursive" fontSize="18" fill="#555">$0.01</text>
        <text x="60" y="345" textAnchor="end" fontFamily="'Patrick Hand', cursive" fontSize="18" fill="#555">$0.05</text>
        <text x="60" y="265" textAnchor="end" fontFamily="'Patrick Hand', cursive" fontSize="18" fill="#555">$0.10</text>
        <text x="60" y="185" textAnchor="end" fontFamily="'Patrick Hand', cursive" fontSize="18" fill="#555">$1.00</text>
        <text x="60" y="105" textAnchor="end" fontFamily="'Patrick Hand', cursive" fontSize="18" fill="#555">$10</text>

        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((m, i) => (
          <text
            key={m}
            x={130 + i * 95}
            y="545"
            textAnchor="middle"
            fontFamily="'Patrick Hand', cursive"
            fontSize="16"
            fill="#555"
          >
            {m}
          </text>
        ))}

        <polyline
          points="
            95,485
            130,478
            155,490
            180,472
            210,480
            235,465
            260,470
            290,440
            310,455
            335,420
            355,435
            380,390
            400,410
            420,370
            445,340
            460,360
            480,310
            500,330
            520,280
            540,300
            555,250
            575,220
            590,260
            610,200
            630,180
            650,220
            670,160
            690,140
            705,170
            720,120
            740,100
            755,130
            770,85
            790,70
            810,90
            830,55
          "
          fill="none"
          stroke="#22aa44"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <polyline
          points="
            95,485
            130,478
            155,490
            180,472
            210,480
            235,465
            260,470
            290,440
            310,455
            335,420
            355,435
            380,390
            400,410
            420,370
            445,340
            460,360
            480,310
            500,330
            520,280
            540,300
            555,250
            575,220
            590,260
            610,200
            630,180
            650,220
            670,160
            690,140
            705,170
            720,120
            740,100
            755,130
            770,85
            790,70
            810,90
            830,55
            830,520
            95,520
          "
          fill="url(#chartGradient)"
          stroke="none"
        />
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22aa44" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22aa44" stopOpacity="0" />
          </linearGradient>
        </defs>

        <polyline
          points="
            95,490
            140,488
            190,492
            240,486
            310,488
            380,485
            420,490
            480,482
            530,486
            580,484
            630,488
            680,478
            720,482
            770,475
            830,470
          "
          fill="none"
          stroke="#dd3333"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="6 4"
        />

        {[
          { x: 290, y: 428, w: 12, h: 25 },
          { x: 380, y: 378, w: 12, h: 30 },
          { x: 480, y: 298, w: 12, h: 28 },
          { x: 575, y: 208, w: 12, h: 32 },
          { x: 670, y: 148, w: 12, h: 26 },
          { x: 740, y: 88, w: 12, h: 30 },
          { x: 830, y: 43, w: 12, h: 28 },
        ].map((c, i) => (
          <g key={i}>
            <rect
              x={c.x - c.w / 2}
              y={c.y}
              width={c.w}
              height={c.h}
              fill={i % 2 === 0 ? '#22aa44' : '#dd3333'}
              stroke="#333"
              strokeWidth="1.5"
              rx="1"
            />
            <line
              x1={c.x}
              y1={c.y - 6}
              x2={c.x}
              y2={c.y + c.h + 6}
              stroke="#333"
              strokeWidth="1.5"
            />
          </g>
        ))}

        <text
          x="460"
          y="85"
          textAnchor="middle"
          fontFamily="'Patrick Hand', cursive"
          fontSize="28"
          fill="#333"
          transform="rotate(-8, 460, 85)"
        >
          MEEM / USD
        </text>

        <path
          d="M 620,100 C 630,95 650,92 665,95"
          fill="none"
          stroke="#333"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <polygon points="665,90 675,96 664,100" fill="#333" />
        <text
          x="685"
          y="98"
          fontFamily="'Patrick Hand', cursive"
          fontSize="20"
          fill="#22aa44"
          transform="rotate(-5, 685, 98)"
        >
          to the moon!!
        </text>

        <text
          x="150"
          y="470"
          fontFamily="'Patrick Hand', cursive"
          fontSize="14"
          fill="#999"
          transform="rotate(3, 150, 470)"
        >
          (u are here)
        </text>
        <path
          d="M 140,475 C 130,478 120,485 115,490"
          fill="none"
          stroke="#999"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <polygon points="112,492 118,495 116,488" fill="#999" />

        <circle cx="830" cy="55" r="6" fill="none" stroke="#22aa44" strokeWidth="2">
          <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>

        <text x="770" y="38" fontFamily="'Patrick Hand', cursive" fontSize="22" fill="#f0b020" transform="rotate(-12, 770, 38)">ATH!</text>

        <text x="330" y="310" fontFamily="'Patrick Hand', cursive" fontSize="13" fill="#888" transform="rotate(2, 330, 310)">buy the dip</text>

        <text x="550" y="175" fontFamily="'Patrick Hand', cursive" fontSize="13" fill="#888" transform="rotate(-3, 550, 175)">diamond hands</text>

        <g transform="translate(808, 28) rotate(15)">
          <path d="M 0,12 L 5,0 L 10,12 L 15,0 L 20,12" fill="none" stroke="#f0b020" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}
