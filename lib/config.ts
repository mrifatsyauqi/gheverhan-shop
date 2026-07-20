function getDatabaseUrl(): string {
  const value = process.env.DATABASE_URL;
  if (!value) {
    throw new Error("DATABASE_URL is not set");
  }
  return value;
}

export const config = {
  databaseUrl: getDatabaseUrl(),
  isProduction: process.env.NODE_ENV === "production",
};
