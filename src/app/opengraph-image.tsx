import { ImageResponse } from "next/og";
import { event } from "@/config/event";

export const alt = `${event.name}, hosted at ${event.host}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "#0A0506",
          color: "#F5EDEA",
        }}
      >
        <div style={{ fontSize: 28, color: "#FF4B3E" }}>NATIONAL LEVEL · ON SITE BATTLEGROUND</div>
        <div style={{ fontSize: 210, fontWeight: 900, color: "#E10600" }}>SLAY CTF</div>
        <div style={{ fontSize: 34 }}>{event.host}</div>
      </div>
    ),
    size,
  );
}
