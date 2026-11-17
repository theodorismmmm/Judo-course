import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#100e0c",
          color: "#f4efe6",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#e36a52" }}>JUDONOW</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1, letterSpacing: -2 }}>
          <div style={{ display: "flex", color: "#e36a52" }}>Ready</div>
          <div style={{ display: "flex" }}>für den nächsten Gürtel</div>
        </div>
        <div style={{ display: "flex", fontSize: 32 }}>Starte jetzt mit JudoNOW</div>
      </div>
    ),
    { ...size },
  );
}
