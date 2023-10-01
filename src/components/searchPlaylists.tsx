import React from "react";
import { Playlist } from '@spotify/web-api-ts-sdk';
interface Props {
    playlistDetails: Playlist[]
};

const handleButtonClick = (link: string) => window.open(link);

const sImageStyles = {
    width: 100,
    height: 100
};

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

const PlaylistsItem: React.FC<Props> = (props) => {
    return <div className="main-area">{playlistItemDom(props.playlistDetails)}</div>;
};

export default PlaylistsItem;