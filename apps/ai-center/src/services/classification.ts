import logger from '@sentinel/logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class AIClassificationService {
  /**
   * Classify incident using simple rules + optional ML model
   * M8: Replace with actual ML model integration
   */
  async classifyIncident(incident: {
    category: string;
    description: string;
    urgency: string;
  }): Promise<any> {
    try {
      const keywords = incident.description.toLowerCase();

      // Simple rule-based classification
      const classification = {
        category: incident.category,
        confidence: 0.85,
        recommendedDepartment: this.getDepartmentForCategory(incident.category),
        recommendedPriority: this.getPriorityFromUrgency(incident.urgency),
        reasons: [
          `Incident category: ${incident.category}`,
          `Urgency level: ${incident.urgency}`,
        ],
      };

      logger.info('Incident classified', { classification });
      return classification;
    } catch (error) {
      logger.error('Classification failed', { error });
      throw error;
    }
  }

  /**
   * Detect potential duplicate incidents
   * M8: Implement similarity matching
   */
  async detectDuplicates(
    incidentId: string,
    description: string,
    location: { latitude: number; longitude: number }
  ): Promise<any[]> {
    try {
      const recentIncidents = await prisma.incident.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
          id: { not: incidentId },
        },
        take: 50,
      });

      // Simple distance-based matching
      const duplicates = recentIncidents.filter(
        (incident) =>
          this.calculateDistance(
            location.latitude,
            location.longitude,
            incident.latitude,
            incident.longitude
          ) < 0.5 // Within 500 meters
      );

      return duplicates;
    } catch (error) {
      logger.error('Duplicate detection failed', { error });
      return [];
    }
  }

  /**
   * Generate dispatcher recommendations
   */
  async generateDispatcherRecommendation(incidentId: string): Promise<any> {
    try {
      const incident = await prisma.incident.findUnique({
        where: { id: incidentId },
        include: { tasks: true },
      });

      if (!incident) {
        throw new Error('Incident not found');
      }

      // TODO: Implement worker availability, routing, historical data
      return {
        recommendation: 'Dispatch Fire Unit 7 to this location',
        confidence: 0.92,
        reasons: [
          'Nearest available unit',
          'Specialized equipment available',
          'Average response time: 4 minutes',
        ],
        estimatedArrival: new Date(Date.now() + 4 * 60 * 1000),
      };
    } catch (error) {
      logger.error('Recommendation generation failed', { error });
      throw error;
    }
  }

  private getDepartmentForCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      FIRE: 'fire-department',
      WATER: 'water-department',
      ROAD: 'roads-department',
      ELECTRICITY: 'electricity-department',
      EMERGENCY: 'emergency-services',
    };
    return categoryMap[category] || 'general';
  }

  private getPriorityFromUrgency(urgency: string): string {
    const priorityMap: Record<string, string> = {
      CRITICAL: 'CRITICAL',
      HIGH: 'HIGH',
      MEDIUM: 'MEDIUM',
      LOW: 'LOW',
    };
    return priorityMap[urgency] || 'MEDIUM';
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

export const aiClassificationService = new AIClassificationService();
