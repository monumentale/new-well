import React from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = ({ videoId }) => {
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="video-player">
      <YouTube videoId={videoId} opts={opts} />
    </div>
  );
};

export default VideoPlayer;