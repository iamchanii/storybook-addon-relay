export function previewAnnotations(entry = []) {
  return [...entry, require.resolve('./dist/decorators/index.js')];
}
