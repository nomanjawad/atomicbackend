import React, { useEffect, useState, useRef } from "react"
import jsVectorMap from "jsvectormap"
import "jsvectormap/dist/maps/world.js"
import { analyticsAPI } from "../../services/api"
import { Icon } from "@iconify/react/dist/iconify.js"
import { MapCardSkeleton } from "./DashboardSkeleton"

// Country name to ISO code mapping
const countryToCode = {
  "Bangladesh": "BD",
  "Saudi Arabia": "SA",
  "Russia": "RU",
  "Oman": "OM",
  "United Arab Emirates": "AE",
  "United States": "US",
  "United Kingdom": "GB",
  "India": "IN",
  "Pakistan": "PK",
  "Germany": "DE",
  "France": "FR",
  "Canada": "CA",
  "Australia": "AU",
  "China": "CN",
  "Japan": "JP",
  "Singapore": "SG",
  "Malaysia": "MY",
  "Indonesia": "ID",
  "Philippines": "PH",
  "Thailand": "TH",
  "Vietnam": "VN",
  "South Korea": "KR",
  "Brazil": "BR",
  "Mexico": "MX",
  "Italy": "IT",
  "Spain": "ES",
  "Netherlands": "NL",
  "Sweden": "SE",
  "Norway": "NO",
  "Denmark": "DK",
  "Finland": "FI",
  "Poland": "PL",
  "Turkey": "TR",
  "Egypt": "EG",
  "South Africa": "ZA",
  "Nigeria": "NG",
  "Kenya": "KE",
  "Argentina": "AR",
  "Chile": "CL",
  "Colombia": "CO",
  "Peru": "PE",
  "New Zealand": "NZ",
  "Ireland": "IE",
  "Belgium": "BE",
  "Switzerland": "CH",
  "Austria": "AT",
  "Portugal": "PT",
  "Greece": "GR",
  "Czech Republic": "CZ",
  "Romania": "RO",
  "Ukraine": "UA",
  "Hungary": "HU",
  "Israel": "IL",
  "Qatar": "QA",
  "Kuwait": "KW",
  "Bahrain": "BH",
  "Iraq": "IQ",
  "Jordan": "JO",
  "Lebanon": "LB",
  "Sri Lanka": "LK",
  "Nepal": "NP",
  "Myanmar": "MM",
  "Cambodia": "KH",
  "Local/Unknown": "XX",
  "Unknown": "XX"
}

// Progress bar colors
const colors = [
  'bg-primary-600',
  'bg-success-main',
  'bg-orange',
  'bg-yellow',
  'bg-info-main',
  'bg-purple',
  'bg-pink',
  'bg-cyan'
]

const CountryStatusOne = () => {
  const [countryData, setCountryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalVisitors, setTotalVisitors] = useState(0)
  const mapRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsAPI.getSummary()
        if (response.success && response.data.countryBreakdown) {
          const breakdown = response.data.countryBreakdown
          // Use totalVisitors from API for accurate percentage (not just country breakdown sum)
          const total = response.data.totalVisitors || Object.values(breakdown).reduce((a, b) => a + b, 0)
          setTotalVisitors(total)

          // Convert to array and sort by count
          const countries = Object.entries(breakdown)
            .map(([country, count]) => ({
              name: country,
              code: countryToCode[country] || 'XX',
              count,
              percentage: total > 0 ? Math.round((count / total) * 100) : 0
            }))
            .sort((a, b) => b.count - a.count)

          setCountryData(countries)
        }
      } catch (error) {
        console.error('Failed to fetch country data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (loading || !countryData.length) return

    // Build region colors based on actual data
    const regionScale = {}
    const regionValues = {}

    countryData.forEach(({ code }) => {
      if (code !== 'XX') {
        regionScale[code] = '#487FFF'
        regionValues[code] = code
      }
    })

    // Build markers for countries with visitors
    const markers = countryData
      .filter(c => c.code !== 'XX')
      .slice(0, 10)
      .map(({ name, count, code }) => {
        // Approximate coordinates for markers
        const coords = getCountryCoords(code)
        return { coords, name: `${name}: ${count}` }
      })

    const map = new jsVectorMap({
      selector: "#map",
      map: "world",
      backgroundColor: "transparent",
      borderColor: "#fff",
      borderOpacity: 0.25,
      borderWidth: 0,
      color: "#000000",
      regionStyle: {
        initial: {
          fill: "#D1D5DB",
        },
      },
      markerStyle: {
        initial: {
          r: 5,
          fill: "#fff",
          "fill-opacity": 1,
          stroke: "#000",
          "stroke-width": 1,
          "stroke-opacity": 0.4,
        },
      },
      markers: markers,
      series: {
        regions: [
          {
            attribute: "fill",
            scale: regionScale,
            values: regionValues,
          },
        ],
      },
      hoverOpacity: null,
      normalizeFunction: "linear",
      zoomOnScroll: false,
      scaleColors: ["#000000", "#000000"],
      selectedColor: "#000000",
      selectedRegions: [],
      enableZoom: false,
      hoverColor: "#fff",
    })

    mapRef.current = map

    return () => {
      map && map.destroy()
    }
  }, [loading, countryData])

  // Get approximate coordinates for country code
  function getCountryCoords(code) {
    const coords = {
      BD: [23.685, 90.356],
      SA: [23.886, 45.079],
      RU: [61.524, 105.319],
      OM: [21.474, 55.975],
      AE: [25.2, 55.27],
      US: [37.09, -95.713],
      GB: [55.378, -3.436],
      IN: [20.594, 78.963],
      PK: [30.375, 69.345],
      DE: [51.166, 10.452],
      FR: [46.228, 2.214],
      CA: [56.13, -106.347],
      AU: [-25.274, 133.775],
      CN: [35.862, 104.195],
      JP: [36.205, 138.253],
      SG: [1.352, 103.82],
      MY: [4.211, 101.976],
      ID: [-0.79, 113.921],
      PH: [12.879, 121.774],
      TH: [15.87, 100.993],
      VN: [14.058, 108.277],
      KR: [35.908, 127.767],
      BR: [-14.235, -51.925],
      MX: [23.635, -102.553],
      IT: [41.872, 12.567],
      ES: [40.464, -3.749],
      NL: [52.133, 5.291],
      TR: [38.964, 35.243],
      EG: [26.821, 30.802],
      ZA: [-30.559, 22.937],
      NG: [9.082, 8.675],
    }
    return coords[code] || [0, 0]
  }

  // Show skeleton when loading with no data
  if (loading && countryData.length === 0) {
    return (
      <div className="col-xxl-4 col-sm-6">
        <MapCardSkeleton />
      </div>
    )
  }

  return (
    <div className="col-xxl-4 col-sm-6">
      <div className="card radius-8 border-0">
        <div className="card-body">
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
            <h6 className="mb-2 fw-bold text-lg">Visitors by Country</h6>
            {loading && (
              <span className="spinner-border spinner-border-sm text-primary" />
            )}
          </div>
        </div>

        {/* world-map */}
        <div id="world-map">
          <div id="map" />
        </div>

        <div className="card-body p-24 max-h-266-px scroll-sm overflow-y-auto">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : countryData.length === 0 ? (
            <div className="text-center py-4 text-secondary-light">
              <Icon icon="mdi:map-marker-off" style={{ fontSize: '48px' }} />
              <p className="mt-2 mb-0">No visitor data yet</p>
            </div>
          ) : (
            <div>
              {countryData.slice(0, 10).map((country, index) => (
                <div
                  key={country.name}
                  className={`d-flex align-items-center justify-content-between gap-3 ${index < countryData.length - 1 ? 'mb-3 pb-2' : ''}`}
                >
                  <div className="d-flex align-items-center w-100">
                    <div
                      className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: '#f0f4ff' }}
                    >
                      <Icon
                        icon="mdi:map-marker"
                        className="text-primary-600"
                        style={{ fontSize: '20px' }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="text-sm mb-0">{country.name}</h6>
                      <span className="text-xs text-secondary-light fw-medium">
                        {country.count.toLocaleString()} Visitors
                      </span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 w-100">
                    <div className="w-100 max-w-66 ms-auto">
                      <div
                        className="progress progress-sm rounded-pill"
                        role="progressbar"
                        aria-valuenow={country.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className={`progress-bar ${colors[index % colors.length]} rounded-pill`}
                          style={{ width: `${country.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-secondary-light font-xs fw-semibold">
                      {country.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CountryStatusOne
