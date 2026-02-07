import L, { Layer, LayerGroup } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free'

// Fix default icon paths for Vite bundling
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { useGeoloniaMap } from '../hooks/useGeoloniaMap'
import { useRef, useState } from 'react'
import type { StyleSpecification } from 'maplibre-gl'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2xUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl
})

export type FeatureCollection = GeoJSON.FeatureCollection

type WithFeatureProps = Layer & { feature?: { properties?: Record<string, unknown> } }

function toFeature(layer: Layer): GeoJSON.Feature | null {
  const candidate = layer as WithFeatureProps
  const gjUnknown = candidate.toGeoJSON?.();

  if (!gjUnknown || typeof gjUnknown !== 'object') return null
  const gj = gjUnknown as GeoJSON.Feature | { geometry: GeoJSON.Geometry }
  const feature: GeoJSON.Feature = {
    type: 'Feature',
    geometry: gj.geometry,
    properties: (layer as WithFeatureProps).feature?.properties ?? {}
  }
  return feature
}

function syncFeatureCollection(group: LayerGroup): FeatureCollection {
  const features: GeoJSON.Feature[] = []
  group.eachLayer((layer) => {
    const f = toFeature(layer)
    if (f) features.push(f)
  })
  return {
    type: 'FeatureCollection',
    features
  }
}

const MAP_STYLE = 'https://smartmap.styles.geoloniamaps.com/style.json';

export const MapView: React.FC<{
  onFeaturesChange: (fc: FeatureCollection) => void
  onSelectedLayerChange: (layer: Layer | null) => void
  importGeoJSON?: FeatureCollection | null
}> = ({ onFeaturesChange }) => {

  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<Layer | null>(null)
  const [group, setGroup] = useState<LayerGroup | null>(null)
  const [propPairs, setPropPairs] = useState<Array<{ key: string, value: string }>>([])
  const [hasSelection, setHasSelection] = useState(false)
  const map = useGeoloniaMap(containerRef, {
    center: [139.7670, 35.6814],
    zoom: 14, 
    minZoom: 2, 
    maxZoom: 19,
    style: MAP_STYLE as unknown as StyleSpecification
  });

  function applyProperties() {
    const lf = selectedRef.current as WithFeatureProps | null
    if (!lf) return
    lf.feature = lf.feature ?? { properties: {} }
    lf.feature.properties = Object.fromEntries(propPairs.map(p => [p.key, p.value]))
    if (group) {
      const fc = syncFeatureCollection(group)
      onFeaturesChange(fc)
    }
    // trigger UI refresh
    setPropPairs([...propPairs])
  }

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
        <div
          className='map'
          ref={containerRef}
          data-lang="ja"
          data-gesture-handling="off"
          data-navigation-control="off"
          data-scale-control="on"
          style={{ width: '100%', height: '100%' }}
        >
        </div>

      {/* Properties sidebar */}
      <div style={{
        position: 'absolute', top: 64, right: 8, width: 280, maxHeight: '75vh', overflow: 'auto',
        background: 'rgba(255,255,255,0.95)', padding: 12, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
    <div style={{ fontWeight: 600, marginBottom: 8 }}>プロパティ編集</div>
    {hasSelection ? (
          <>
            {propPairs.map((p, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 6, marginBottom: 6 }}>
                <input
                  placeholder="key"
                  value={p.key}
                  onChange={(e) => {
                    const next = [...propPairs]; next[idx] = { ...p, key: e.target.value }; setPropPairs(next)
                  }}
                />
                <input
                  placeholder="value"
                  value={p.value}
                  onChange={(e) => {
                    const next = [...propPairs]; next[idx] = { ...p, value: e.target.value }; setPropPairs(next)
                  }}
                />
                <button onClick={() => setPropPairs(propPairs.filter((_, i) => i !== idx))}>削除</button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={() => setPropPairs([...propPairs, { key: '', value: '' }])}>追加</button>
              <button onClick={applyProperties}>保存</button>
            </div>
          </>
        ) : (
          <div>地物をクリックするとプロパティを編集できます</div>
        )}
      </div>
    </div>
  )
}
