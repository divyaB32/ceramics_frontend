import { useState } from "react";
import "./visualize.css";

/* ===============================
   BACKEND BASE URL
================================ */
const API_BASE = "http://localhost:5000";

/* ===============================
   ROOM CONFIG
================================ */
const ROOMS = [
  {
    id: "small",
    label: "Small Room",
    base: "/rooms/living/small_room.jpg",
    floorMask: "/mask/Floor/small_room_floor_mask.png",
    wallMask: "/mask/Wall/small_room_wall.png",
  },
  {
    id: "medium",
    label: "Medium Room",
    base: "/rooms/living/medium_room.jpg",
    floorMask: "/mask/Floor/medium_room_floor_mask.png",
    wallMask: "/mask/Wall/medium_room_wall.png",
  },
  {
    id: "large",
    label: "Large Room",
    base: "/rooms/living/large_room.jpg",
    floorMask: "/mask/Floor/large_room_floor_mask.png",
    wallMask: "/mask/Wall/large_room_wall.png",
  },
  {
    id: "extra",
    label: "Extra Large",
    base: "/rooms/living/extra_large_room.jpg",
    floorMask: "/mask/Floor/extra_large_room_floor_mask.png",
    wallMask: "/mask/Wall/extra_large_room_wall.png",
  },
];

export default function Visualize({ open, onClose, product }) {
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0]);
  const [surface, setSurface] = useState("floor");
  const [tileSize, setTileSize] = useState(120);

  if (!open || !product) return null;

  /* ===============================
     TILE IMAGE FROM BACKEND
     Handles both "/tiles/x.jpg" and "tiles/x.jpg"
  ================================ */
  const tileUrl = product.tileImage
    ? `${API_BASE}/${product.tileImage.replace(/^\/+/, "")}`
    : "";

  const maskUrl =
    surface === "wall" ? selectedRoom.wallMask : selectedRoom.floorMask;

  return (
    <div className="visualize-overlay" onClick={onClose}>
      <div className="visualize-modal" onClick={(e) => e.stopPropagation()}>
        <button className="visualize-close" onClick={onClose}>✕</button>

        {/* ROOM SELECTOR */}
        <div className="room-selector">
          {ROOMS.map((room) => (
            <div
              key={room.id}
              className={`room-thumb ${selectedRoom.id === room.id ? "active" : ""}`}
              onClick={() => setSelectedRoom(room)}
            >
              <img src={room.base} alt={room.label} />
              <span>{room.label}</span>
            </div>
          ))}
        </div>

        {/* FLOOR / WALL TOGGLE */}
        <div className="surface-toggle">
          <button
            className={surface === "floor" ? "active" : ""}
            onClick={() => setSurface("floor")}
          >
            Floor
          </button>
          <button
            className={surface === "wall" ? "active" : ""}
            onClick={() => setSurface("wall")}
          >
            Wall
          </button>
        </div>

        {/* TILE SIZE SLIDER */}
        <div className="tile-size-control">
          <label>Tile Size: {tileSize}px</label>
          <input
            type="range"
            min="60"
            max="300"
            value={tileSize}
            onChange={(e) => setTileSize(Number(e.target.value))}
          />
        </div>

        {/* VISUALIZATION */}
        <div className="visualize-wrapper">
          <div className="room-wrapper">
            {/* Base room image */}
            <img src={selectedRoom.base} className="room-base" alt="Room" />

            {/* Tile overlay — clips to floor/wall mask area */}
            {tileUrl && (
              <div
                className="tile-overlay"
                style={{
                  backgroundImage: `url(${tileUrl})`,
                  backgroundSize: `${tileSize}px ${tileSize}px`,
                  backgroundRepeat: "repeat",
                  /* Mask: clips tile to only the floor or wall region */
                  WebkitMaskImage: `url(${maskUrl})`,
                  WebkitMaskSize: "cover",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskImage: `url(${maskUrl})`,
                  maskSize: "cover",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  /* multiply blend makes tile look painted ON the surface */
                  mixBlendMode: "multiply",
                  opacity: 0.85,
                }}
              />
            )}
          </div>

          <div className="visualize-info">
            <h2>{product.name}</h2>
            <p>
              Previewing on <strong>{surface}</strong> in{" "}
              <strong>{selectedRoom.label}</strong>.
            </p>
            <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
              Use the slider to adjust tile scale. Toggle Floor / Wall to switch surfaces.
            </p>
            {!tileUrl && (
              <p style={{ color: "#c0392b", marginTop: 8 }}>
                ⚠️ No tile image found for this product.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}