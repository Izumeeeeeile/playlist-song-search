import { FC, useEffect, useState, useRef } from "react";
import {useSearchParams} from 'react-router-dom';
import { SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
import { useSpotifySdkContext } from "../provider/SpotifySdkProviders";

function GetPlaylistItems() {
    const sdk = useSpotifySdkContext().sdk;
    const [searchParams] = useSearchParams();
    return sdk
      ? (<SpotifyPlaylistItems sdk={sdk} trackIds={searchParams.getAll("trackIds")} />) 
      : (<></>);
}

function SpotifyPlaylistItems({ sdk, trackIds }: { sdk: SpotifyApi, trackIds: string[]}) {

    const sliceByNumber = (array: string[], limit: number) => {
      return array.flatMap((_, i, a) => i % limit ? [] : [a.slice(i, i + limit)]);
    }

    const [tracks, setTracks] = useState<Track[]>({} as Track[]);
    const [trackIdsState, setTrackIds] = useState<string[]>({} as string[]);
      useEffect(() => {
        if (trackIdsState === trackIds) {
          return;
        }
        const sliceTrackIds: string[][] = sliceByNumber(trackIds, 50);
        (async () => {
            let tracks: Track[] = []
            for (const property of sliceTrackIds) {
              try {
                let apiresult = await sdk.tracks.get(property, "JP");
                tracks = tracks.concat(apiresult);
              } catch (e: Error | unknown) {
                console.error(e)
              }
            }
            
            setTracks(tracks);
            setTrackIds(trackIds);
        })();

      }, [sdk]);
    
      return (
        <>
          <div className="content">
              <PlaylistItems tracks={tracks}/>
          </div>
        </>
     );
  };

interface Props {
    tracks: Track[]
};

const PlaylistItems: FC<Props> = (props) => {

    const [searchResults, setSearchResults] = useState<Track[]>({} as Track[]);
    const textRef = useRef<HTMLInputElement>(null);

    const handleSearch = () => {
      
      const newSearchTerm = textRef.current ? textRef.current.value : "";
      setSearchResults(props.tracks);
       // 配列から一致する要素をフィルタリングして検索結果を設定
      if (newSearchTerm.trim() !== '' || newSearchTerm !== undefined) {
        const filteredResults = props.tracks.filter((track) =>
          track.name.includes(newSearchTerm)
        );
        setSearchResults(filteredResults);
      } else {
        setSearchResults(props.tracks);
      }
    };
    return <div className="main-area">
      <div className="search-item-area">
        <input
          type="text"
          placeholder="検索ワードを入力"
          ref={textRef}
        />
        <input type="button" value="送信" onClick={() => handleSearch} />
      </div>
      {playListTracks(props.tracks)}
     </div>;
};

const handleButtonClick = (link: string) => window.open(link);

const sImageStyles = {
  width: 100,
  height: 100
};

const playListTracks = (tracks: Track[]) => Object.values(tracks).map((trackItem : Track) => {
  return (
    <div className='list-items' onClick={() => handleButtonClick(trackItem.external_urls.spotify)}>
        <div role='button' className="trackDetail">
            <div className='item-list-image-area'>
                <div style={sImageStyles}>
                    <img className="s-image" src={trackItem.album.images[0].url}></img>
                </div>
            </div>
            <div className='trackInfo'>
                <div>
                    <p className="trackName">
                        {trackItem.name}
                    </p>
                    <div>
                        <span>{trackItem.artists[0].name}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
});

export default GetPlaylistItems;