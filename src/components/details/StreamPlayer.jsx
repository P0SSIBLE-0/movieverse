import { useMemo } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { ServerStackIcon, FilmIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import Dropdown from './Dropdown';
import { STREAMING_PROVIDERS } from '../../services/streamingApi';

const StreamPlayer = ({
  id,
  mediaType,
  title,
  streamEmbedUrl,
  seasons,
  selectedSeason,
  selectedEpisode,
  onSeasonChange,
  onEpisodeChange,
  episodesForSelectedSeason,
  onError,
  selectedProvider,
  onProviderChange,
}) => {
  const type = mediaType === 'anime' ? 'tv' : mediaType;

  // Build options for the server dropdown
  const serverOptions = useMemo(
    () => STREAMING_PROVIDERS.map((p) => ({ value: p.id, label: p.name })),
    []
  );

  // Build options for season dropdown
  const seasonOptions = useMemo(() => {
    if (!seasons?.length) return [];
    return seasons
      .filter((s) => s.season_number > 0 && s.episode_count > 0)
      .map((s) => ({
        value: s.season_number,
        label: s.name || `Season ${s.season_number}`,
      }));
  }, [seasons]);

  // Build options for episode dropdown
  const episodeOptions = useMemo(
    () =>
      episodesForSelectedSeason.map((epNum) => ({
        value: epNum,
        label: `Episode ${epNum}`,
      })),
    [episodesForSelectedSeason]
  );

  const downloadUrl = useMemo(() => {
    if (type === 'movie') {
      return `https://rivestream.org/download?type=movie&id=${id}`;
    } else {
      return `https://rivestream.org/download?type=tv&id=${id}&season=${selectedSeason}&episode=${selectedEpisode}`;
    }
  }, [type, id, selectedSeason, selectedEpisode]);

  return (
    <section className="w-full relative z-20" id="stream-player-section">
      {/* Video Player */}
      <div className="relative aspect-video w-full bg-[#0a0a0a] overflow-hidden rounded-t-lg group">
        {streamEmbedUrl && (
          <iframe
            key={streamEmbedUrl}
            src={streamEmbedUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            onError={onError}
          />
        )}

      </div>

      <div className="bg-[#0f0f0f] border-t border-white/[0.02] px-3 sm:px-4 md:px-6 py-4 rounded-b-lg">
        <div className="container mx-auto flex flex-wrap items-center justify-center lg:justify-between gap-4">
          {/* TV Season / Episode Dropdowns */}
          {type === 'tv' && seasonOptions.length > 0 && (
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
              <Dropdown
                options={seasonOptions}
                value={selectedSeason}
                onChange={(val) => {
                  onSeasonChange(val);
                  onEpisodeChange(1);
                }}
                icon={<FilmIcon className="w-4 h-4 text-amber-400" />}
                heading="Seasons"
                placeholder="Season"
                minWidth="min-w-[150px]"
              />

              {episodeOptions.length > 0 && (
                <Dropdown
                  options={episodeOptions}
                  value={selectedEpisode}
                  onChange={onEpisodeChange}
                  icon={<ListBulletIcon className="w-4 h-4 text-amber-400" />}
                  heading="Episodes"
                  placeholder="Episode"
                  minWidth="min-w-[145px]"
                  panelAlign="right"
                />
              )}
            </div>
          )}

          {/* Right side: Server Dropdown + Download */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
            <Dropdown
              options={serverOptions}
              value={selectedProvider}
              onChange={onProviderChange}
              icon={<ServerStackIcon className="w-4 h-4 text-amber-400" />}
              heading="Streaming Servers"
              placeholder="Select Server"
              minWidth="min-w-[160px]"
              showIndex
              panelAlign="right"
            />

            {/* Download Button */}
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/20 hover:border-amber-500/40 text-amber-400 hover:text-amber-300 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-md"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StreamPlayer;