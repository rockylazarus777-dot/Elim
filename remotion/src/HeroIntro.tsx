import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Starter composition — swap in real footage/copy per video. Colors match
 * the site's brand/ink Tailwind tokens (see tailwind.config.ts) so exports
 * stay on-brand without pulling in the Next.js app's build pipeline.
 */
export const HeroIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0d10",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
          fontFamily: "Georgia, serif",
        }}
      >
        <p
          style={{
            color: "#7fb8af",
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          EMC Healthcare Services
        </p>
        <h1 style={{ color: "#ffffff", fontSize: 88, margin: 0 }}>
          A-to-Z Healthcare Partner
        </h1>
      </div>
    </AbsoluteFill>
  );
};
