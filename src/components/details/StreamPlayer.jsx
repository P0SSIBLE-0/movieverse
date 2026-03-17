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
    <section className="w-full relative z-20 flex flex-col" id="stream-player-section">
      {/* TV Season / Episode Dropdowns (Top) */}
      {type === 'tv' && seasonOptions.length > 0 && (
        <div className="bg-[#0f0f0f] border-b border-white/[0.02] px-3 sm:px-4 md:px-6 py-4 rounded-t-lg">
          <div className="container mx-auto flex flex-wrap items-center justify-between sm:justify-start gap-4">
            <Dropdown
              options={seasonOptions}
              value={selectedSeason}
              onChange={(val) => {
                onSeasonChange(val);
                onEpisodeChange(1);
              }}
              icon={<FilmIcon className="size-4 text-amber-400" />}
              heading="Seasons"
              placeholder="Season"
              minWidth="min-w-[140px] sm:min-w-[150px]"
            />

            {episodeOptions.length > 0 && (
              <Dropdown
                options={episodeOptions}
                value={selectedEpisode}
                onChange={onEpisodeChange}
                icon={<ListBulletIcon className="size-4 text-amber-400" />}
                heading="Episodes"
                placeholder="Episode"
                minWidth="min-w-[140px] sm:min-w-[145px]"
                panelAlign="left"
              />
            )}
          </div>
        </div>
      )}

      {/* Video Player */}
      <div className={`relative aspect-video w-full bg-[#0a0a0a] overflow-hidden group ${type === 'tv' && seasonOptions.length > 0 ? '' : 'rounded-t-lg'}`}>
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

      {/* Server Dropdown + Download */}
      <div className="bg-[#0f0f0f] border-t border-white/[0.02] px-3 sm:px-4 md:px-6 py-4 rounded-b-lg">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <Dropdown
            options={serverOptions}
            value={selectedProvider}
            onChange={onProviderChange}
            icon={<ServerStackIcon className="w-4 h-4 text-amber-400" />}
            heading="Streaming Servers"
            placeholder="Select Server"
            minWidth="min-w-[140px] sm:min-w-[160px]"
            showIndex
            panelAlign="left"
          />

          {/* Download Button */}
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/20 hover:border-amber-500/40 text-amber-400 hover:text-amber-300 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-md whitespace-nowrap"
          >
            <ArrowDownTrayIcon className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default StreamPlayer;