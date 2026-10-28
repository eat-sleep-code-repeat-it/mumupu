export function splitJianpuSvgPages(text: string): string[] {
  return text
    .split("[fenye]")
    .map((page) => page.replace(/\r/g, "").replace(/&(?!(?:amp|lt|gt|quot|apos);)/g, "&amp;"))
    .filter((page) => page.trim().length > 0);
}

export function combineSvgPages(pages: string[]): string {
  if (pages.length === 0) {
    throw new Error("Cannot combine an empty SVG page list");
  }

  const parsedPages = pages.map((page, index) => {
    const openingTag = page.match(/<svg\b([^>]*)>/i);
    const closingTagStart = page.lastIndexOf("</svg>");
    if (!openingTag || closingTagStart < openingTag.index! + openingTag[0].length) {
      throw new Error(`Could not parse SVG page ${index + 1}`);
    }

    const attributes = openingTag[1];
    const width = attributes.match(/\bwidth="(\d+(?:\.\d+)?)"/)?.[1];
    const height = attributes.match(/\bheight="(\d+(?:\.\d+)?)"/)?.[1];
    const viewBox = attributes.match(/\bviewBox="([^"]+)"/)?.[1];
    if (!width || !height || !viewBox) {
      throw new Error(`SVG page ${index + 1} is missing numeric dimensions or a viewBox`);
    }

    const content = page.slice(openingTag.index! + openingTag[0].length, closingTagStart);
    const pagePrefix = `fenye-page-${index}-`;
    const namespacedContent = index === 0
      ? content
      : content
        .replace(/\bid="([^"]+)"/g, (_match, id: string) => `id="${pagePrefix}${id}"`)
        .replace(/\b(xlink:)?href="#([^"]+)"/g, (_match, namespace: string | undefined, id: string) => `${namespace ?? ""}href="#${pagePrefix}${id}"`)
        .replace(/url\(#([^)]+)\)/g, (_match, id: string) => `url(#${pagePrefix}${id})`);

    return { width, height, viewBox, content: namespacedContent };
  });

  const firstPage = parsedPages[0];
  if (parsedPages.some((page) => page.width !== firstPage.width || page.height !== firstPage.height || page.viewBox !== firstPage.viewBox)) {
    throw new Error("SVG pages have inconsistent dimensions");
  }

  const pageHeight = Number(firstPage.height);
  const pagesMarkup = parsedPages.map((page, index) =>
    `<svg x="0" y="${pageHeight * index}" width="${page.width}" height="${page.height}" viewBox="${page.viewBox}">${page.content}</svg>`,
  ).join("\n");
  const totalHeight = pageHeight * parsedPages.length;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${firstPage.width}" height="${totalHeight}" viewBox="0 0 ${firstPage.width} ${totalHeight}"><rect x="0" y="0" width="100%" height="100%" fill="#ffffff" />${pagesMarkup}</svg>`;
}
