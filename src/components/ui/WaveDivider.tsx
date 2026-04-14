interface WaveDividerProps {
  color?: string;
  flip?: boolean;
  className?: string;
  height?: number;
}

export default function WaveDivider({
  color = '#fedd00',
  flip = false,
  className = '',
  height = 36,
}: WaveDividerProps) {
  return (
    <div
      className={`w-full overflow-hidden ${flip ? 'rotate-180' : ''} ${className}`}
      style={{ height: `${height}px` }}
    >
      <svg
        viewBox="0 0 1440 36"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ display: 'block' }}
      >
        {/* Background wave - lighter */}
        <path
          d="M0,24 C360,48 720,0 1080,24 C1260,36 1380,12 1440,18 L1440,36 L0,36 Z"
          fill={color}
          fillOpacity="0.3"
        />
        {/* Middle wave */}
        <path
          d="M0,18 C240,36 480,6 720,24 C960,42 1200,12 1440,30 L1440,36 L0,36 Z"
          fill={color}
          fillOpacity="0.5"
        />
        {/* Front wave - solid */}
        <path
          d="M0,30 C180,18 360,36 540,24 C720,12 900,30 1080,24 C1260,18 1380,30 1440,24 L1440,36 L0,36 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
