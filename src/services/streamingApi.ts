export const STREAMING_PROVIDERS = [
  {
    id: "vidcore",
    name: "VidCore",
    getMovieUrl: (id) => `https://vidcore.net/movie/${id}?theme=ffd321&poster=true`,
    getTvUrl: (id, season, episode) =>
      `https://vidcore.net/tv/${id}/${season}/${episode}?theme=ffd321&poster=true`,
  },
  {
    id: "vidfast",
    name: "VidFast",
    getMovieUrl: (id) => `https://vidfast.pro/movie/${id}?theme=ffd321&poster=true`,
    getTvUrl: (id, season, episode) =>
      `https://vidfast.pro/tv/${id}/${season}/${episode}?theme=ffd321&poster=true&nextButton=true&autoNext=true`,
  },
  {
    id: "vidnest",
    name: "VidNest",
    getMovieUrl: (id) => `https://vidnest.fun/movie/${id}`,
    getTvUrl: (id, season, episode) =>
      `https://vidnest.fun/tv/${id}/${season}/${episode}`,
  },
  {
    id: "vidzee",
    name: "VidZee",
    getMovieUrl: (id) => `https://player.vidzee.wtf/embed/movie/${id}`,
    getTvUrl: (id, season, episode) =>
      `https://player.vidzee.wtf/embed/tv/${id}/${season}/${episode}`,
  },
  {
    id: "rivestream",
    name: "RiveStream",
    getMovieUrl: (id) => `https://rivestream.org/embed?type=movie&id=${id}`,
    getTvUrl: (id, season, episode) =>
      `https://rivestream.org/embed?type=tv&id=${id}&season=${season}&episode=${episode}`,
  },
  {
    id: "vidsrc",
    name: "VidSrc",
    getMovieUrl: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`,
    getTvUrl: (id, season, episode) =>
      `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`,
  },
  {
    id: "vidlink",
    name: "VidLink",
    getMovieUrl: (id) => `https://vidlink.pro/movie/${id}`,
    getTvUrl: (id, season, episode) =>
      `https://vidlink.pro/tv/${id}/${season}/${episode}`,
  },
];
