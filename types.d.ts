declare namespace Express {
  export interface Request {
    userId: string;
    geo?: {
      country?: string;
      city?: string;
      ll?: [number, number]; // lat, lon
    };
  }
}
