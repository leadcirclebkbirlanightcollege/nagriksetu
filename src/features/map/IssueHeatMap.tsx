import { useEffect, useState } from "react"
import type { CSSProperties } from "react"
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet.heat"
import { apiGetAnalytics } from "../../lib/api"

const DEFAULT_LAT = Number(import.meta.env.VITE_MAP_DEFAULT_LAT ?? 19.076)
const DEFAULT_LNG = Number(import.meta.env.VITE_MAP_DEFAULT_LNG ?? 72.8777)
const DEFAULT_ZOOM = Number(import.meta.env.VITE_MAP_DEFAULT_ZOOM ?? 12)

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
  fillOpacity: 0.85,
  weight: 1.5,
}

const heatGradient = { 0.3: "#138808", 0.6: "#FF9933", 1: "#0B3C6D" }
const heatOptions = { radius: 30, blur: 20, maxZoom: 15, gradient: heatGradient }

interface HeatPoint {
  id: string
  title: string
  category: string
  status: string
  area: string
  lat: number
  lng: number
  weight: number
}

function HeatLayer({ points }: { points: HeatPoint[] }) {
  const map = useMap()
  useEffect(() => {
    if (!points || points.length === 0) return
    const heatData: [number, number, number][] = points.map((p) => [p.lat, p.lng, p.weight * 0.4])
    const heatApi = L as unknown as {
      heatLayer: (pts: [number, number, number][], opts: object) => L.Layer
    }
    const layer = heatApi.heatLayer(heatData, heatOptions)
    layer.addTo(map)
    return () => {
      map.removeLayer(layer)
    }
  }, [map, points])
  return null
}

export default function IssueHeatMap({
  showHeat = true,
  customPoints,
}: {
  showHeat?: boolean
  customPoints?: HeatPoint[]
}) {
  const [points, setPoints] = useState<HeatPoint[]>(customPoints || [])
  const center: [number, number] = [DEFAULT_LAT, DEFAULT_LNG]

  useEffect(() => {
    if (customPoints) {
      setPoints(customPoints)
      return
    }
    apiGetAnalytics()
      .then((data) => {
        if (data?.heatmapPoints) {
          setPoints(data.heatmapPoints)
        }
      })
      .catch((err) => console.warn("Failed to load map points", err))
  }, [customPoints])

  return (
    <MapContainer
      center={center}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={false}
      style={mapStyle}
      aria-label="Map of reported civic issues"
    >
      <TileLayer attribution={OSM_ATTRIBUTION} url={TILE_URL} />
      {showHeat && points.length > 0 ? <HeatLayer points={points} /> : null}
      {points.map((pt) => {
        const coords: [number, number] = [pt.lat, pt.lng]
        return (
          <CircleMarker key={pt.id} center={coords} radius={8 + pt.weight * 3} pathOptions={markerStyle}>
            <Tooltip>
              <div className="text-xs">
                <strong>[{pt.id}] {pt.category}</strong>
                <div>{pt.title}</div>
                <div className="text-muted">{pt.area} — Status: {pt.status}</div>
              </div>
            </Tooltip>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
