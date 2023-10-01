import React from "react";
import {Playlist, PlaylistedTrack, Track } from '@spotify/web-api-ts-sdk';
interface Props {
    playlistDetail: Playlist
};

const trackDetailRow= (track: Track[]) => track?.map((item)=>{
    return (
    <tr key={item.id}>
      <td>"track.name:"{item.name}</td>
      <td>"track.album.name:"{item.album.name}</td>
    </tr>
    )
  });

const playListTracks = (playlistDetails: Playlist) => playlistDetails?.tracks?.items?.map((playlistedTrack : PlaylistedTrack) => {
    const track = playlistedTrack.track;
    return (
      <div>
        <td>{track.name}</td>
      </div>
    );
  });

const playlistItems: React.FC<Props> = (props) => {
    return <div className="main-area">{playListTracks(props.playlistDetail)}</div>;
};

export default playlistItems;