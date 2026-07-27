const API_KEY = 'fa89b00b6c654823eff697985a42bfb5';
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchFromTMDB(endpoint, params = {}) {
  try {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', API_KEY);
    url.searchParams.append('language', 'es-ES');

    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Error al consultar ${endpoint}:`, error);
    return null;
  }
}

export async function getPopularMovies(page = 1) {
  const data = await fetchFromTMDB('/movie/popular', { page });
  return data?.results || [];
}

export async function getPopularTVShows(page = 1) {
  const data = await fetchFromTMDB('/tv/popular', { page });
  return data?.results || [];
}

export async function getPopularTV(page = 1) {
  return await getPopularTVShows(page);
}

export async function getTrending(mediaType = 'all', timeWindow = 'week') {
  const data = await fetchFromTMDB(`/trending/${mediaType}/${timeWindow}`);
  return data || { results: [] };
}

export async function getMediaDetails(type, id) {
  const appendResponse = type === 'tv' ? 'credits,recommendations' : 'credits';
  const data = await fetchFromTMDB(`/${type}/${id}`, { append_to_response: appendResponse });

  if (data) {
    if (type === 'tv' && data.seasons) {
      try {
        const seasonsWithEpisodes = await Promise.all(
          data.seasons
            .filter(s => s.season_number > 0)
            .map(async (season) => {
              const seasonData = await fetchFromTMDB(`/tv/${id}/season/${season.season_number}`);
              return { ...season, episodes: seasonData?.episodes || [] };
            })
        );
        data.seasons = seasonsWithEpisodes;
      } catch (e) {
        console.warn('Error cargando episodios:', e);
      }
    }
    return data;
  }

  return { id, title: 'Sin título', overview: '', poster_path: null, seasons: [] };
}

export async function searchMedia(query) {
  if (!query) return [];
  const data = await fetchFromTMDB('/search/multi', { query });
  return data?.results || [];
}

export async function searchMulti(query) {
  return await searchMedia(query);
}

export async function getPersonDetails(personId) {
  const data = await fetchFromTMDB(`/person/${personId}`);
  if (data) return data;
  throw new Error('No se pudo obtener la información de la persona');
}

export async function getPersonCredits(personId) {
  const data = await fetchFromTMDB(`/person/${personId}/combined_credits`);
  if (data) return data;
  return { cast: [], crew: [] };
}

const tmdbService = {
  getPopularMovies,
  getPopularTVShows,
  getPopularTV,
  getTrending,
  getMediaDetails,
  searchMedia,
  searchMulti,
  getPersonDetails,
  getPersonCredits
};

export default tmdbService;