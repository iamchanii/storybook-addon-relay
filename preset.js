function previewAnnotations(entry = []) {
  return [...entry, require.resolve('./dist/decorators/index.cjs')];
}

module.exports = {
  previewAnnotations,
};
