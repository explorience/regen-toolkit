/**
 * Bioregional Mapper Tool
 * Handles territory mapping and spatial analysis for bioregions
 */

import { GeoBoundary } from '../../../types/index.js';

export interface MapLayer {
  id: string;
  name: string;
  type: 'ecosystem' | 'hydrology' | 'soil' | 'land-use' | 'infrastructure' | 'protected' | 'elevation' | 'climate';
  data: unknown;
  source: string;
  date: Date;
  resolution: string;
  accuracy: number;
  metadata: Record<string, unknown>;
}

export interface BioregionalFeature {
  id: string;
  name: string;
  type: 'watershed' | 'peak' | 'wetland' | 'forest' | 'grassland' | 'community' | 'protected-area' | 'corridor';
  coordinates: GeoBoundary;
  description: string;
  significance: 'critical' | 'high' | 'medium' | 'low';
  threats: string[];
  opportunities: string[];
  stewardshipStatus: 'protected' | 'managed' | 'degraded' | 'unknown';
}

export interface BioregionalMap {
  id: string;
  name: string;
  boundary: GeoBoundary;
  layers: MapLayer[];
  features: BioregionalFeature[];
  scale: 'micro' | 'meso' | 'macro';
  area: number; // km²
  legend: {
    symbols: { symbol: string; label: string; color: string }[];
    scale: string;
    projection: string;
  };
}

export class BioregionalMapperTool {
  private mapDatabase: Map<string, BioregionalMap> = new Map();

  async createMap(params: {
    id: string;
    name: string;
    boundary: GeoBoundary;
    layers: MapLayer[];
  }): Promise<BioregionalMap> {
    // Calculate area from boundary
    const area = this.calculateArea(params.boundary);

    // Determine scale
    const scale = area < 100 ? 'micro' : area < 10000 ? 'meso' : 'macro';

    // Extract features from layers
    const features = await this.extractFeatures(params.layers);

    const map: BioregionalMap = {
      id: params.id,
      name: params.name,
      boundary: params.boundary,
      layers: params.layers,
      features,
      scale,
      area,
      legend: {
        symbols: this.generateLegendSymbols(params.layers),
        scale: this.generateScaleIndicator(area),
        projection: 'WGS84',
      },
    };

    this.mapDatabase.set(params.id, map);
    return map;
  }

  async addLayer(mapId: string, layer: MapLayer): Promise<BioregionalMap | null> {
    const map = this.mapDatabase.get(mapId);
    if (!map) return null;

    map.layers.push(layer);
    
    // Re-extract features with new layer
    const newFeatures = await this.extractFeaturesFromLayer(layer);
    map.features.push(...newFeatures);

    return map;
  }

  async analyzeTerritory(mapId: string): Promise<{
    ecosystemComposition: { type: string; area: number; percentage: number }[];
    hydrology: {
      watersheds: number;
      totalWaterArea: number;
      streamDensity: number;
      groundwaterZones: string[];
    };
    landUse: { type: string; area: number; percentage: number }[];
    protectedAreas: { name: string; area: number; type: string }[];
    connectivity: {
      corridors: string[];
      barriers: string[];
      fragmentationIndex: number;
    };
  } | null> {
    const map = this.mapDatabase.get(mapId);
    if (!map) return null;

    // Analyze ecosystem layers
    const ecosystemLayers = map.layers.filter(l => l.type === 'ecosystem');
    const ecosystemComposition = this.analyzeEcosystemComposition(ecosystemLayers, map.area);

    // Analyze hydrology
    const hydrologyLayers = map.layers.filter(l => l.type === 'hydrology');
    const hydrology = this.analyzeHydrology(hydrologyLayers, map.area);

    // Analyze land use
    const landUseLayers = map.layers.filter(l => l.type === 'land-use');
    const landUse = this.analyzeLandUse(landUseLayers, map.area);

    // Find protected areas
    const protectedFeatures = map.features.filter(f => f.type === 'protected-area');

    // Calculate connectivity
    const connectivity = this.analyzeConnectivity(map.features);

    return {
      ecosystemComposition,
      hydrology,
      landUse,
      protectedAreas: protectedFeatures.map(f => ({
        name: f.name,
        area: this.calculateFeatureArea(f.coordinates),
        type: f.stewardshipStatus,
      })),
      connectivity,
    };
  }

  async findFeaturesByType(mapId: string, type: BioregionalFeature['type']): Promise<BioregionalFeature[]> {
    const map = this.mapDatabase.get(mapId);
    if (!map) return [];

    return map.features.filter(f => f.type === type);
  }

  async findFeaturesWithinRadius(
    mapId: string,
    center: GeoBoundary,
    radiusKm: number
  ): Promise<BioregionalFeature[]> {
    const map = this.mapDatabase.get(mapId);
    if (!map) return [];

    return map.features.filter(f => {
      const distance = this.calculateDistance(center, f.coordinates);
      return distance <= radiusKm;
    });
  }

  async calculateBufferZone(
    mapId: string,
    featureId: string,
    bufferKm: number
  ): Promise<GeoBoundary | null> {
    const map = this.mapDatabase.get(mapId);
    if (!map) return null;

    const feature = map.features.find(f => f.id === featureId);
    if (!feature) return null;

    // Simplified buffer calculation
    return this.createBuffer(feature.coordinates, bufferKm);
  }

  async generateReport(mapId: string): Promise<{
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    dataQuality: string;
  } | null> {
    const map = this.mapDatabase.get(mapId);
    if (!map) return null;

    const territory = await this.analyzeTerritory(mapId);
    if (!territory) return null;

    const summary = `${map.name} is a ${map.scale}-scale bioregion of ${map.area.toFixed(1)} km² ` +
      `containing ${territory.hydrology.watersheds} watersheds and ` +
      `${map.features.length} significant features.`;

    const keyFindings = [
      `Ecosystem composition: ${territory.ecosystemComposition[0]?.type || 'mixed'} dominant`,
      `Stream density: ${territory.hydrology.streamDensity.toFixed(2)} km/km²`,
      `Protected area coverage: ${territory.protectedAreas.length} areas`,
      `Connectivity status: ${territory.connectivity.fragmentationIndex < 0.3 ? 'good' : 'concerning'}`,
    ];

    const recommendations = this.generateTerritoryRecommendations(territory);

    return {
      summary,
      keyFindings,
      recommendations,
      dataQuality: `Based on ${map.layers.length} data layers`,
    };
  }

  private calculateArea(boundary: GeoBoundary): number {
    // Simplified area calculation
    // In real implementation, use proper geospatial libraries
    if (boundary.type === 'polygon' && Array.isArray(boundary.coordinates)) {
      // Very rough approximation using bounding box
      const coords = boundary.coordinates[0] as number[][];
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      
      for (const coord of coords) {
        minX = Math.min(minX, coord[0]);
        maxX = Math.max(maxX, coord[0]);
        minY = Math.min(minY, coord[1]);
        maxY = Math.max(maxY, coord[1]);
      }

      // Rough conversion to km² (at equator, 1 degree ≈ 111 km)
      const widthKm = (maxX - minX) * 111;
      const heightKm = (maxY - minY) * 111;
      return widthKm * heightKm;
    }
    return 0;
  }

  private async extractFeatures(layers: MapLayer[]): Promise<BioregionalFeature[]> {
    const features: BioregionalFeature[] = [];

    for (const layer of layers) {
      const layerFeatures = await this.extractFeaturesFromLayer(layer);
      features.push(...layerFeatures);
    }

    return features;
  }

  private async extractFeaturesFromLayer(layer: MapLayer): Promise<BioregionalFeature[]> {
    // Placeholder feature extraction
    // In real implementation, would parse layer data
    return [{
      id: `feature-${layer.id}-${Date.now()}`,
      name: `${layer.name} Feature`,
      type: this.mapLayerTypeToFeatureType(layer.type),
      coordinates: { type: 'point', coordinates: [0, 0] },
      description: `Feature extracted from ${layer.name}`,
      significance: 'medium',
      threats: [],
      opportunities: [],
      stewardshipStatus: 'unknown',
    }];
  }

  private mapLayerTypeToFeatureType(layerType: MapLayer['type']): BioregionalFeature['type'] {
    const mapping: Record<string, BioregionalFeature['type']> = {
      'ecosystem': 'forest',
      'hydrology': 'wetland',
      'protected': 'protected-area',
      'land-use': 'community',
    };
    return mapping[layerType] || 'community';
  }

  private generateLegendSymbols(layers: MapLayer[]): { symbol: string; label: string; color: string }[] {
    const symbols: { symbol: string; label: string; color: string }[] = [];

    for (const layer of layers) {
      symbols.push({
        symbol: this.getSymbolForLayer(layer.type),
        label: layer.name,
        color: this.getColorForLayer(layer.type),
      });
    }

    return symbols;
  }

  private getSymbolForLayer(type: MapLayer['type']): string {
    const symbols: Record<string, string> = {
      'ecosystem': '🌲',
      'hydrology': '≋',
      'soil': '▒',
      'land-use': '🏘️',
      'infrastructure': '🛣️',
      'protected': '🛡️',
      'elevation': '▲',
      'climate': '☀️',
    };
    return symbols[type] || '●';
  }

  private getColorForLayer(type: MapLayer['type']): string {
    const colors: Record<string, string> = {
      'ecosystem': '#228B22',
      'hydrology': '#4682B4',
      'soil': '#8B4513',
      'land-use': '#DAA520',
      'infrastructure': '#696969',
      'protected': '#006400',
      'elevation': '#A9A9A9',
      'climate': '#FFD700',
    };
    return colors[type] || '#808080';
  }

  private generateScaleIndicator(area: number): string {
    if (area < 100) return '1:50,000';
    if (area < 10000) return '1:250,000';
    return '1:1,000,000';
  }

  private analyzeEcosystemComposition(layers: MapLayer[], totalArea: number): { type: string; area: number; percentage: number }[] {
    // Placeholder analysis
    return [
      { type: 'Forest', area: totalArea * 0.4, percentage: 40 },
      { type: 'Grassland', area: totalArea * 0.3, percentage: 30 },
      { type: 'Wetland', area: totalArea * 0.15, percentage: 15 },
      { type: 'Agriculture', area: totalArea * 0.15, percentage: 15 },
    ];
  }

  private analyzeHydrology(layers: MapLayer[], totalArea: number): {
    watersheds: number;
    totalWaterArea: number;
    streamDensity: number;
    groundwaterZones: string[];
  } {
    return {
      watersheds: Math.floor(totalArea / 50), // Rough estimate
      totalWaterArea: totalArea * 0.05,
      streamDensity: 0.5 + Math.random(),
      groundwaterZones: ['Upper aquifer', 'Lower aquifer'],
    };
  }

  private analyzeLandUse(layers: MapLayer[], totalArea: number): { type: string; area: number; percentage: number }[] {
    return [
      { type: 'Conservation', area: totalArea * 0.3, percentage: 30 },
      { type: 'Agriculture', area: totalArea * 0.4, percentage: 40 },
      { type: 'Urban', area: totalArea * 0.1, percentage: 10 },
      { type: 'Other', area: totalArea * 0.2, percentage: 20 },
    ];
  }

  private analyzeConnectivity(features: BioregionalFeature[]): {
    corridors: string[];
    barriers: string[];
    fragmentationIndex: number;
  } {
    const corridors = features
      .filter(f => f.type === 'corridor')
      .map(f => f.name);
    
    const barriers = features
      .filter(f => f.threats.includes('fragmentation') || f.threats.includes('barrier'))
      .map(f => f.name);

    // Simplified fragmentation index
    const fragmentationIndex = barriers.length / (corridors.length + barriers.length + 1);

    return {
      corridors,
      barriers,
      fragmentationIndex,
    };
  }

  private calculateFeatureArea(coordinates: GeoBoundary): number {
    return this.calculateArea(coordinates);
  }

  private calculateDistance(a: GeoBoundary, b: GeoBoundary): number {
    // Simplified distance calculation
    const aCoords = a.type === 'point' ? a.coordinates as number[] : [0, 0];
    const bCoords = b.type === 'point' ? b.coordinates as number[] : [0, 0];
    
    const dx = (aCoords[0] - bCoords[0]) * 111;
    const dy = (aCoords[1] - bCoords[1]) * 111;
    
    return Math.sqrt(dx * dx + dy * dy);
  }

  private createBuffer(coordinates: GeoBoundary, bufferKm: number): GeoBoundary {
    // Simplified buffer creation
    return coordinates;
  }

  private generateTerritoryRecommendations(territory: {
    ecosystemComposition: { type: string; percentage: number }[];
    connectivity: { fragmentationIndex: number };
  }): string[] {
    const recommendations: string[] = [];

    if (territory.connectivity.fragmentationIndex > 0.3) {
      recommendations.push('Priority: Restore connectivity corridors');
    }

    const forestCover = territory.ecosystemComposition.find(e => e.type === 'Forest')?.percentage || 0;
    if (forestCover < 30) {
      recommendations.push('Consider reforestation initiatives');
    }

    recommendations.push('Develop watershed-based management plan');
    recommendations.push('Engage local communities in monitoring');

    return recommendations;
  }
}
