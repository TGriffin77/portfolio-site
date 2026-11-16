import type { Project, PocketBaseResponse } from '../types/project';
import type { Technology } from '../types/technology';
import type { Experience } from '../types/experience';

/**
 * API client for communicating with PocketBase backend
 */
class ProjectAPI {
  private baseUrl: string;

  constructor() {
    // Read API URL from environment variable, fallback to localhost
    this.baseUrl = import.meta.env.VITE_API_URL || '';
    console.debug(`ProjectAPI initialized with baseUrl: ${this.baseUrl}`);
  }

  async fetchTechnologies(): Promise<Technology[]> {
    const technologies: Technology[] = [];
    let page = 1;
    while (true) {
      const response = await fetch(`${this.baseUrl}/api/collections/technologies/records?sort=category,name&perPage=100&page=${page}`);
      if (!response.ok) throw new Error(`Failed to fetch technologies: HTTP ${response.status}`);
      const data: PocketBaseResponse<Technology> = await response.json();
      technologies.push(...data.items);
      if (page * data.perPage >= data.totalItems) return technologies;
      page++;
    }
  }

  async fetchExperiences(): Promise<Experience[]> {
    const experiences: Experience[] = [];
    let page = 1;
    while (true) {
      const response = await fetch(`${this.baseUrl}/api/collections/experiences/records?sort=display_order,id&perPage=100&page=${page}`);
      if (!response.ok) throw new Error(`Failed to fetch experience: HTTP ${response.status}`);
      const data: PocketBaseResponse<Experience> = await response.json();
      experiences.push(...data.items);
      if (page * data.perPage >= data.totalItems) return experiences;
      page++;
    }
  }

  /**
   * Fetch all projects from PocketBase
   * @returns Array of Project objects
   * @throws Error if fetch fails or response is invalid
   */
  async fetchProjects(): Promise<Project[]> {
    try {
      const url = `${this.baseUrl}/api/collections/projects/records?sort=-created`;
      console.debug(`Fetching projects from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: PocketBaseResponse<Project> = await response.json();
      console.debug(`Fetched ${data.items.length} projects`);
      return data.items;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to fetch projects:', message);
      throw new Error(`Failed to fetch projects: ${message}`);
    }
  }

  /**
   * Fetch a single project by ID
   * @param id - Project ID from PocketBase
   * @returns Single Project object
   * @throws Error if fetch fails or project not found
   */
  async fetchProject(id: string): Promise<Project> {
    try {
      const url = `${this.baseUrl}/api/collections/projects/records/${id}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Failed to fetch project ${id}:`, message);
      throw new Error(`Failed to fetch project: ${message}`);
    }
  }
}

// Export singleton instance
export const projectAPI = new ProjectAPI();
export default projectAPI;
