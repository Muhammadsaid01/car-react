/** Fill only with confirmed public business details. Unverified legacy sample values were removed. */
export const siteContact: {
  address: string | null; phone: string | null; email: string | null; hours: string | null;
  socials: { label: string; url: string }[];
} = { address: null, phone: null, email: null, hours: null, socials: [] };

/** Set these only after confirming the actual LuxAvto showroom location. */
export const siteLocation: { embedUrl: string | null; mapUrl: string | null } = {
  embedUrl: null, mapUrl: null,
};
