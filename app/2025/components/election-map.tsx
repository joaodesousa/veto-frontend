"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker,
  ZoomableGroup 
} from "react-simple-maps"

// Portugal districts GeoJSON
const geoUrl = "https://raw.githubusercontent.com/nmota/caop_GeoJSON/master/ContinenteDistritos.geojson"

export function ElectionMap() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)

  // Districts in Portugal with election data
  const districts = [
    { id: "Lisboa", name: "Lisboa", coordinates: [-9.1393, 38.7223], winner: "PS", result: "32.4%" },
    { id: "Porto", name: "Porto", coordinates: [-8.6108, 41.1496], winner: "PSD", result: "31.5%" },
    { id: "Braga", name: "Braga", coordinates: [-8.4256, 41.5454], winner: "PSD", result: "33.2%" },
    { id: "Setúbal", name: "Setúbal", coordinates: [-8.8882, 38.5244], winner: "PS", result: "35.7%" },
    { id: "Aveiro", name: "Aveiro", coordinates: [-8.6535, 40.6405], winner: "PSD", result: "32.8%" },
    { id: "Faro", name: "Faro", coordinates: [-7.9304, 37.0146], winner: "PS", result: "30.1%" },
    { id: "Coimbra", name: "Coimbra", coordinates: [-8.4266, 40.2004], winner: "PS", result: "29.8%" },
    { id: "Leiria", name: "Leiria", coordinates: [-8.8071, 39.7435], winner: "PSD", result: "31.2%" },
    { id: "Santarém", name: "Santarém", coordinates: [-8.6874, 39.2366], winner: "PS", result: "30.5%" },
    { id: "Viseu", name: "Viseu", coordinates: [-7.9127, 40.6566], winner: "PSD", result: "34.3%" },
    { id: "Viana do Castelo", name: "Viana do Castelo", coordinates: [-8.8288, 41.6918], winner: "PSD", result: "32.9%" },
    { id: "Bragança", name: "Bragança", coordinates: [-6.7496, 41.8072], winner: "PSD", result: "35.1%" },
    { id: "Vila Real", name: "Vila Real", coordinates: [-7.7444, 41.3002], winner: "PSD", result: "33.8%" },
    { id: "Guarda", name: "Guarda", coordinates: [-7.2327, 40.5369], winner: "PSD", result: "32.5%" },
    { id: "Castelo Branco", name: "Castelo Branco", coordinates: [-7.5096, 39.8231], winner: "PS", result: "31.7%" },
    { id: "Portalegre", name: "Portalegre", coordinates: [-7.4308, 39.2969], winner: "PS", result: "31.9%" },
    { id: "Évora", name: "Évora", coordinates: [-7.9095, 38.5742], winner: "PS", result: "32.3%" },
    { id: "Beja", name: "Beja", coordinates: [-7.8664, 38.0147], winner: "PS", result: "33.8%" }
    // Madeira and Açores are typically handled separately as they're not in the continental geojson
  ]

  // Create a lookup table for district results
  const districtResults = districts.reduce((acc, district) => {
    acc[district.id] = district;
    return acc;
  }, {} as Record<string, any>);

  const getWinnerColor = (winner: string) => {
    switch (winner) {
      case "PS":
        return "#F8567B"
      case "PSD":
        return "#FF821E"
      case "CH":
        return "#202056"
      case "IL":
        return "#00AEEF"
      case "BE":
        return "#BE0027"
      case "PCP":
        return "#D70000"
      case "CDS-PP":
        return "#0093D5"
      case "PAN":
        return "#00623B"
      default:
        return "#888888"
    }
  }

  // Handle clicking on a district region
  const handleDistrictClick = (geo: any) => {
    const districtName = geo.properties.DISTRITO;
    setSelectedDistrict(districtName === selectedDistrict ? null : districtName);
  }

  return (
    <div className="relative w-full h-[500px] bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [-8.2, 39.5], // Center on Portugal
          scale: 5000
        }}
        width={800}
        height={500}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ZoomableGroup zoom={1} center={[-8.2, 39.5]}>
          <Geographies geography={geoUrl}>
            {({ geographies }) => 
              geographies.map(geo => {
                const districtName = geo.properties.DISTRITO;
                const district = districtResults[districtName];
                const fillColor = district ? getWinnerColor(district.winner) : "#EAEAEC";
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    onClick={() => handleDistrictClick(geo)}
                    style={{
                      default: { 
                        outline: "none",
                        opacity: selectedDistrict && selectedDistrict !== districtName ? 0.7 : 1
                      },
                      hover: { 
                        outline: "none", 
                        opacity: 0.9,
                        cursor: "pointer"
                      },
                      pressed: { 
                        outline: "none",
                        opacity: 1
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
          
          {/* Display district labels */}
          {districts.map((district) => (
            <Marker
              key={district.id}
              coordinates={district.coordinates}
            >
              <text
                textAnchor="middle"
                style={{
                  fontFamily: "system-ui",
                  fill: "#FFFFFF",
                  fontSize: "8px",
                  fontWeight: "bold",
                  textShadow: "0px 0px 3px rgba(0,0,0,0.5)",
                  pointerEvents: "none"
                }}
              >
                {district.name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* District details popup */}
      {selectedDistrict && districtResults[selectedDistrict] && (
        <Card className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 p-4 z-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{selectedDistrict}</h3>
              <Badge
                style={{
                  backgroundColor: getWinnerColor(districtResults[selectedDistrict].winner),
                }}
              >
                {districtResults[selectedDistrict].winner}
              </Badge>
            </div>
            <p className="text-sm">
              Vencedor: {districtResults[selectedDistrict].winner} com{" "}
              {districtResults[selectedDistrict].result}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#F8567B]"></div>
                <span>PS: {(Math.random() * 10 + 22).toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#FF821E]"></div>
                <span>PSD: {(Math.random() * 10 + 20).toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#202056]"></div>
                <span>CH: {(Math.random() * 10 + 8).toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#00AEEF]"></div>
                <span>IL: {(Math.random() * 7 + 4).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Legend */}
      <div className="absolute top-2 left-2 bg-white/80 dark:bg-slate-800/80 p-2 rounded-md text-xs">
        <div className="font-bold mb-1">Legenda</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#F8567B]"></div>
            <span>PS</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#FF821E]"></div>
            <span>PSD</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#202056]"></div>
            <span>CH</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#00AEEF]"></div>
            <span>IL</span>
          </div>
        </div>
      </div>
    </div>
  )
}