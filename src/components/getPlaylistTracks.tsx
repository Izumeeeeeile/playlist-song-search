import { FC, useEffect, useState, useRef } from "react";
import {useSearchParams, useLocation } from 'react-router-dom';
import { SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
import { useSpotifySdkContext } from "../provider/SpotifySdkProviders";
import '../assets/css/PlaylistTrack.css'

interface locationState {
  trackIdMapData: string[][],
  playlistName: string
}

function GetPlaylistItems() {
    const sdk = useSpotifySdkContext().sdk;
    const [search] = useSearchParams();
    const { trackIdMapData, playlistName } = useLocation().state as locationState;
    const playListId = search.get("playListId");
    return sdk && playListId
      ? (<SpotifyPlaylistItems sdk={sdk} trackIds={trackIdMapData} playlistName={playlistName} />) 
      : (<></>);
}

function SpotifyPlaylistItems({ sdk, trackIds, playlistName }: { sdk: SpotifyApi, trackIds: string[][], playlistName: string}) {

  const [tracks, setTracks] = useState<Track[]>([]);
  const [trackIdsState, setTrackIds] = useState<string[][]>([]);
  useEffect(() => {
      if (trackIdsState === trackIds) {
          return;
      }
      (async () => {
            let tracks: Track[] = []
            for (const property of trackIds) {
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
              <PlaylistItems tracks={tracks} playlistName={playlistName}/>
          </div>
        </>
    );
  };

interface Props {
    tracks: Track[]
    playlistName: string
};

const PlaylistItems: FC<Props> = (props) => {

    const [searchResults, setSearchResults] = useState<Track[]>([] as Track[]);
    const [inputStr, setStr] = useState('');

    useEffect(() => {
      if (inputStr != '') {
        // 曲一覧から一致する要素をフィルタリングして検索結果を設定
        const filteredResults = props?.tracks?.filter((track) =>
        track.name.toLowerCase().includes(inputStr.toLowerCase()));
        if (filteredResults.length == 0) {
          setSearchResults([])
        } else {
          setSearchResults(filteredResults);
        }
      } else {
        setSearchResults(props.tracks)
      }
    }, [inputStr, props.tracks])
    return <>
        <div>
          <h1>{props.playlistName}</h1>
        </div>
        <div className="search-item-area">
            <input
              type="text"
              placeholder="曲タイトル検索"
              value={inputStr}
              onChange={event => setStr(event.target.value)}
            />
        </div>
        <label>{searchResults.length}曲/{props.tracks.length}曲</label>
        <div className="main-area">
          {playListTracks(searchResults)}
        </div>
     </>;

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
                    <img className="s-image" src={trackItem?.album?.images[0].url}></img>
                </div>
            </div>
            <div className='trackInfo'>
                <div>
                    <p className="trackName">
                        {trackItem?.name}
                    </p>
                    <div>
                        <span>{trackItem?.artists[0]?.name}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
});

export default GetPlaylistItems;