import React from 'react';
import '../assets/css/mainPage.css'

const MainPage: React.FC = () => {
  return (
    <div className='content'>
      <div className='mainPage'>
        <h1>Playlist曲検索</h1>
      </div>
      <div className='pageLink'>
        <a href="./playLists">プレイリスト表示</a>
      </div>
    </div>
  );
};

export default MainPage;