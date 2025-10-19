import React from 'react';
import './VideoBanner.scss';
const ASSETS = {
  heroPoster: "/assets/images/hero-poster.jpg",
  heroVideo: "https://file.hstatic.net/200000978078/file/frame_ngang__final___2_.mp4",
};

export default function VideoBanner() {
  return (
    <section className="container my-4">
      <div className="hero">
        <video
          className="hero-video"
          src={ASSETS.heroVideo}
          poster={ASSETS.heroPoster}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </section>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 2
};
