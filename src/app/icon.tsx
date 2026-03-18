import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
            borderRadius: 96,
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.35)",
            display: "flex",
            fontSize: 176,
            fontWeight: 900,
            height: 320,
            justifyContent: "center",
            letterSpacing: "-0.08em",
            width: 320,
          }}
        >
          MV
        </div>
      </div>
    ),
    size
  );
}
