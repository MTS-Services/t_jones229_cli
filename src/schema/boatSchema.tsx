import { z } from "zod";

export const boatSchema = z.object({
  boatType: z.string().min(1, "Boat type is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  listingType: z.string().min(1, "Listing type is required"),
  // 👈 guests removed from schema
});
