/**
 * RID — Repository Independent Data
 * 
 * RID format: rid:<scheme>:<type>:<identifier>[@version]
 * 
 * Examples:
 * - rid:koinet:person:luiz
 * - rid:orgos:org:refi-bcn@v2
 * - rid:custom:pattern:quadratic-funding
 */

export interface RID {
  scheme: string;
  type: string;
  identifier: string;
  version?: string;
}

export class RIDManager {
  /**
   * Parse a RID string into components
   */
  static parse(ridString: string): RID {
    const match = ridString.match(/^rid:([^:]+):([^:]+):([^@]+)(?:@(.+))?$/);
    
    if (!match) {
      throw new Error(`Invalid RID format: ${ridString}`);
    }
    
    return {
      scheme: match[1],
      type: match[2],
      identifier: match[3],
      version: match[4]
    };
  }

  /**
   * Serialize RID to string
   */
  static stringify(rid: RID): string {
    let str = `rid:${rid.scheme}:${rid.type}:${rid.identifier}`;
    if (rid.version) {
      str += `@${rid.version}`;
    }
    return str;
  }

  /**
   * Generate a RID for org-os entities
   */
  static generateOrgOSRID(
    type: string,
    identifier: string,
    version?: string
  ): RID {
    return {
      scheme: 'orgos',
      type,
      identifier: this.sanitizeIdentifier(identifier),
      version
    };
  }

  /**
   * Generate a RID for KOI network
   */
  static generateKoiRID(
    type: string,
    identifier: string,
    version?: string
  ): RID {
    return {
      scheme: 'koinet',
      type,
      identifier: this.sanitizeIdentifier(identifier),
      version
    };
  }

  /**
   * Validate a RID string
   */
  static isValid(ridString: string): boolean {
    try {
      this.parse(ridString);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Compare two RIDs for equality
   */
  static equals(a: RID, b: RID): boolean {
    return (
      a.scheme === b.scheme &&
      a.type === b.type &&
      a.identifier === b.identifier &&
      a.version === b.version
    );
  }

  private static sanitizeIdentifier(id: string): string {
    return id
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 64);
  }
}
