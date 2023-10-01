import { FC, useEffect, useState } from "react";
import { SpotifyApi, Scopes,Playlist } from '@spotify/web-api-ts-sdk';
import { useSpotify } from '../hooks/useSpotify'
import { useSpotifySdkContext } from "../provider/SpotifySdkProviders";
function SearchPlaylists() {
  
    // const clientId :string = process.env.REACT_APP_SPOTIFY_CLIENT_ID == undefined ? "" : process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    // const redirectUri = `${window.location.origin}`+"/playLists"; 
    // const sdk = useSpotify(
    //   clientId, 
    //   redirectUri, 
    //   Scopes.userDetails
    // );
    const sdk = useSpotifySdkContext().sdk;
    
    return sdk
      ? (<SpotifyPlaylists sdk={sdk} />) 
      : (<></>);
  }
  
function SpotifyPlaylists({ sdk }: { sdk: SpotifyApi}) {
  const [playlistDetails, setPlaylistDetail] = useState<Playlist[]>({} as Playlist[]);
    useEffect(() => {
      (async () => {
        const profile = await sdk.currentUser.profile();
  
        const playlists = await sdk.playlists.getUsersPlaylists(profile.id);
  
        const playlistTrackIds : string[] = playlists.items.map((item) => item.id);
  
        const playlistDetails : Playlist[] = await Promise.all(
          playlistTrackIds.map(async (trackId) => {
            const playlist =  await sdk.playlists.getPlaylist(trackId);
            return playlist;
          })
        );
        setPlaylistDetail(() => playlistDetails)
      })();
    }, [sdk]);
  
    return (
      <>
        <div className="content">
            <PlaylistsItem playlistDetails={playlistDetails}/>
        </div>
      </>
   );
};
  
const handleButtonClick = (link: string) => window.open(link);

const sImageStyles = {
    width: 100,
    height: 100
};

interface Props {
    playlistDetails: Playlist[]
}

const playlistItemDom = (playlistDetails: Playlist[]) => Object.values(playlistDetails).map((playlistDetail) => {
    return (
        <div className='list-items' onClick={() => handleButtonClick(playlistDetail.external_urls.spotify)}>
            <div role='button' className="playlistDetail">
                <div className='item-list-image-area'>
                    <div style={sImageStyles}>
                        <img className="s-image" src={playlistDetail.images[0].url}></img>
                    </div>
                </div>
                <div className='playlistInfo'>
                    <div className='header-info-area'>
                        <p className="playlistName">
                            {playlistDetail.name}
                        </p>
                        <div>
                            <span>{playlistDetail.owner.display_name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
});

const PlaylistsItem: FC<Props> = (props) => {
    return <div className="main-area">{playlistItemDom(props.playlistDetails)}</div>;
};

export default SearchPlaylists;