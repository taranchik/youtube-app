import "./App.css";

import { SearchIcon } from "./assets/SearchIcon";
import { Spinner } from "./assets/Spinner";
import axios from "axios";
import { useState } from "react";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    // fetching videos data from the youtube API
    await axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${e.target.search.value}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
      )
      .then(({ data }) => {
        setVideos(data.items);
        console.log(data.items);

        if (data.items.length) {
          setSelectedVideo(data.items[0]);
        }
      })
      .catch(({ response }) => console.log(response.data));

    setIsLoading(false);
  };

  const handleChangeSelectedVideo = (video) => {
    setSelectedVideo(video);
  };

  return (
    <div className="App">
      <form className="App-Topbar flex-centered" onSubmit={handleSearch}>
        <input
          name="search"
          placeholder="Search"
          type="text"
          defaultValue="Starboy"
        />
        <button>{SearchIcon}</button>
      </form>
      <div className="App-Main">
        <div className="App-Main-content">
          <figure className="video-container">
            {isLoading ? (
              Spinner
            ) : selectedVideo ? (
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div></div>
            )}
            <div className="title">
              {selectedVideo && selectedVideo.snippet.title}
            </div>
          </figure>
          <div className="App-Main-sidebar">
            {videos.map((video, index) => (
              <div key={index} className="sidebar-video-container">
                <div
                  onClick={handleChangeSelectedVideo.bind(this, video)}
                  className="thumbnail-wrapper"
                >
                  <img
                    object-position="100% 0"
                    className="thumbnail"
                    src={video.snippet.thumbnails.high.url}
                    alt={`${video.titile}_img`}
                  />
                </div>
                <div>{video.snippet.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
