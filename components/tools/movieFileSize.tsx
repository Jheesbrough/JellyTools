import React from 'react';
import SimpleLeaderboard from '@/components/common/SimpleLeaderboard';
import { Item, ItemResponse } from '@/utils/types';
import { JellyfinContext } from '@/utils/contexts/contexts';

const fetchMovieFileSizes = async (jellyfin: any): Promise<Item[]> => {
  const response = (await jellyfin.instance.getMovies()).data;
  return response.Items
    .map((item: ItemResponse) => ({
      id: item.Id,
      name: item.Name,
      size: item.MediaSources?.[0]?.Size || 0,
    }))
    .sort((a: Item, b: Item) => (b.size || 0) - (a.size || 0));
};

const MovieFileSize: React.FC = () => {
  const jellyfin = React.useContext(JellyfinContext);

  return (
    <SimpleLeaderboard
      title="Movie File Sizes"
      buttonText="Get Movie File Sizes"
      tooltipText="This will get the file sizes of all movies in your jellyfin library."
      columns={['Name', 'File Size']}
      fetchData={() => fetchMovieFileSizes(jellyfin)}
    />
  );
};

export default MovieFileSize;