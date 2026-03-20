/**
 * Project type representing a portfolio project from PocketBase
 */
export interface Project {
  /** Unique identifier from PocketBase */
  id: string;
  /** Project title */
  title: string;
  /** Project description */
  description: string;
  /** Project URL or GitHub link */
  link: string;
  /** Array of technologies/skills used */
  skills: string[];
  /** Timestamp when record was created */
  created?: string;
  /** Timestamp when record was last updated */
  updated?: string;
}

/**
 * PocketBase API response wrapper for records
 */
export interface PocketBaseResponse<T> {
  page: number;
  perPage: number;
  totalItems: number;
  items: T[];
}
