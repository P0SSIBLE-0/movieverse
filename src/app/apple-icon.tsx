import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(135deg, #0f0f0f 0%, #181818 58%, #2c1804 100%)",
          color: "#101010",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "#facc15",
            borderRadius: 36,
            display: "flex",
            fontSize: 72,
            fontWeight: 900,
            height: 116,
            justifyContent: "center",
            letterSpacing: "-0.08em",
            width: 116,
          }}
        >
          MV
        </div>
      </div>
    ),
    size
  );
}
