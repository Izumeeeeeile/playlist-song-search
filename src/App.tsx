import { useEffect, useState } from 'react';
import { SpotifyApi, Scopes,Playlist } from '@spotify/web-api-ts-sdk';
import { useSpotify } from './hooks/useSpotify'
import PlaylistsItem from './components/searchPlaylists';
import './App.css'

function App() {
  
  const clientId :string = process.env.REACT_APP_SPOTIFY_CLIENT_ID == undefined ? "" : process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const redirectUri = `${window.location.origin}`; 
  const sdk = useSpotify(
    clientId, 
    redirectUri, 
    Scopes.userDetails
  );

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

export default App;