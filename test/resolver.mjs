const SUFFIXES = [".ts", ".mts", "/index.ts"];

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith(".") || /\.(tsx?|mts|jsx?|mjs|json|css)$/.test(specifier)) {
    return nextResolve(specifier, context);
  }
  for (const suffix of SUFFIXES) {
    try {
      return await nextResolve(`${specifier}${suffix}`, context);
    } catch {
      // The next candidate may be a file or a folder index.
    }
  }
  return nextResolve(specifier, context);
}
