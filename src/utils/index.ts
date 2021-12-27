export function keyFromEnum<Enum> (entryEnum: Enum, payload: any) {
  return Object.keys(entryEnum)[Object.values(entryEnum).indexOf(payload)]
}