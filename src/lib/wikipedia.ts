export type WikipediaPhoto = {
  title: string;
  photoUrl: string;
  pageUrl: string;
};

async function searchWikipediaPhoto(lang: "pt" | "en", query: string): Promise<WikipediaPhoto | null> {
  try {
    const url = `https://${lang}.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(query)}&limit=1`;
    const response = await fetch(url, {
      headers: { "User-Agent": "MeuJardimApp/1.0 (catalogo pessoal de plantas)" },
    });
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const page = data?.pages?.[0];
    const thumbnail = page?.thumbnail?.url;
    if (!page || !thumbnail) {
      return null;
    }

    return {
      title: page.title,
      photoUrl: thumbnail.startsWith("http") ? thumbnail : `https:${thumbnail}`,
      pageUrl: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(page.key ?? page.title)}`,
    };
  } catch {
    return null;
  }
}

/**
 * Busca uma foto real da planta na Wikipedia (Wikimedia Commons), gratuita
 * e sem precisar de API key. Tenta primeiro pelo nome popular em português,
 * depois pelo nome científico na Wikipedia em inglês (geralmente tem mais
 * cobertura e fotos de espécies de plantas).
 */
export async function findPlantPhoto(
  commonName: string,
  scientificName: string | null,
): Promise<WikipediaPhoto | null> {
  const byCommonName = await searchWikipediaPhoto("pt", commonName);
  if (byCommonName) {
    return byCommonName;
  }

  if (scientificName) {
    const byScientificName = await searchWikipediaPhoto("en", scientificName);
    if (byScientificName) {
      return byScientificName;
    }
  }

  return null;
}
