import React from 'react';
import SimpleLeaderboard from '@/components/common/SimpleLeaderboard';
import { Item, ItemResponse } from '@/utils/types';
import { JellyfinContext } from '@/utils/contexts/contexts';

const fetchSeriesFileSizes = async (jellyfin: any): Promise<Item[]> => {
  const response = (await jellyfin.instance.getSeriesAndEpisodes()).data;
  const seriesMap: { [key: string]: Item } = {};

  response.Items.forEach((item: ItemResponse) => {
    if (item.Type === "Episode") {
      const seriesId = item.SeriesId;
      const size = item.MediaSources?.[0]?.Size || 0;
      if (seriesMap[seriesId]) {
        if (seriesMap[seriesId].size) {
          seriesMap[seriesId].size += size;
        }
      } else {
        seriesMap[seriesId] = {
          id: seriesId,
          name: item.SeriesName,
          size,
          type: "Series",
          views: 0,
          lastPlayedDate: null,
          dateCreated: null
        };
      }
    }
  });

  return Object.values(seriesMap).sort((a, b) => (b.size || 0) - (a.size || 0));
};

const SeriesFileSize: React.FC = () => {
  const jellyfin = React.useContext(JellyfinContext);

  return (
    <SimpleLeaderboard
      title="Series File Sizes"
      buttonText="Get Series File Sizes"
      tooltipText="This will get the file sizes of all series in your jellyfin library. Series file sizes are the sum of all episodes in the series."
      columns={['Name', 'File Size']}
      fetchData={() => fetchSeriesFileSizes(jellyfin)}
    />
  );
};

export default SeriesFileSize;