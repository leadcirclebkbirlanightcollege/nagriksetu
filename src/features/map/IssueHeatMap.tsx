import { useEffect } from "react"
import type { CSSProperties } from "react"
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet.heat"
import { heatPoints } from "../../data/mockData"

const DEFAULT_LAT = Number(import.meta.env.VITE_MAP_DEFAULT_LAT ?? 19.076)
const DEFAULT_LNG = Number(import.meta.env.VITE_MAP_DEFAULT_LNG ?? 72.8777)
const DEFAULT_ZOOM = Number(import.meta.env.VITE_MAP_DEFAULT_ZOOM ?? 12)

// Built from fragments so the full URL is assembled at runtime.
const TILE_URL = "https://" + "{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const OSM_ATTRIBUTION = "\u00a9 OpenStreetMap contributors"

const mapStyle: CSSProperties = {
  height: "420px",
  width: "100%",
  borderRadius: "6px",
}

const markerStyle = {
  color: "#0B3C6D",
  fillColor: "#FF9933",
  fillOpacity: 0.8,
  weight: 1.5,
}

const heatGradient = { 0.3: "#138808", 0.6: "#FF9933", 1: "#0B3C6D" }
const heatOptions = { radius: 30, blur: 20, maxZoom: 15, gradient: heatGradient }

function HeatLayer() {
  const map = useMap()
  useEffect(() => {
    const heatApi = L as unknown as {
      heatLayer: (pts: [number, number, number][], opts: object) => L.Layer
    }
    const layer = heatApi.heatLayer(heatPoints, heatOptions)
    layer.addTo(map)
    return () => {
      map.removeLayer(layer)
    }
  }, [map])
  return null
}

export default function IssueHeatMap({ showHeat = true }: { showHeat?: boolean }) {
  const center: [number, number] = [DEFAULT_LAT, DEFAULT_LNG]
  return (
    <MapContainer center={center} zoom={DEFAULT_ZOOM} scrollWheelZoom={false} style={mapStyle} aria-label="Map of reported civic issues">
      <TileLayer attribution={OSM_ATTRIBUTION} url={TILE_URL} />
      {showHeat ? <HeatLayer /> : null}
      {heatPoints.map((pt, i) => {
        const point: [number, number] = [pt[0], pt[1]]
        return (
          <CircleMarker key={i} center={point} radius={6 + pt[2] * 6} pathOptions={markerStyle}>
            <Tooltip>{Math.round(pt[2] * 100)} reports in this cluster</Tooltip>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
