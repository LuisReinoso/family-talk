export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function generateAvatarPaths(): string[] {
  const paths: string[] = [];
  for (let mainSeed = 1; mainSeed <= 16; mainSeed++) {
    for (let rowSeed = 0; rowSeed < 3; rowSeed++) {
      paths.push(`/assets/faces/${mainSeed}_${rowSeed}_${rowSeed}.png`);
    }
  }
  return paths;
}