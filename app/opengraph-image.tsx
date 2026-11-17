import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "JudoNOW — Ready für den nächsten Gürtel";

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
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: "#100e0c",
              border: "2px solid #2a2621",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", width: 48, height: 10, background: "#f3eee6" }} />
            <div style={{ position: "absolute", width: 10, height: 48, background: "#c4452d" }} />
          </div>
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#e36a52" }}>JUDONOW</div>
        </div>
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
