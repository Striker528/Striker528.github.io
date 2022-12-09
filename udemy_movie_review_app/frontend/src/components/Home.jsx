import React from "react";
import Container from "./Container";
import HeroSlideShow from "./user/HeroSlideShow";
import NotVerified from "./user/NotVerified";
import TopRatedMovies from "./user/TopRatedMovies";
import TopRatedTVSeries from "./user/TopRatedTVSeries";
import TopRatedWebSeries from "./user/TopRatedWebSeries";

export default function Home() {
  // when changing the screen size like in opening the dev panel and enlarging it, want to keep some padding
  // https://tailwindcss.com/docs/responsive-design
  // that is where the px-2 (padding x of 2) xl:p-0 (set the breakpoint, for the xl, don't want to give any padding )
  return (
    <div className="dark:bg-primary bg-white min-h-screen">
      <Container className="px-2 xl:p-0">
        <NotVerified />
        {/* Slider */}
        <HeroSlideShow />
        {/* Most rated movies */}
        <TopRatedMovies />
        <TopRatedWebSeries />
        <TopRatedTVSeries />
      </Container>
    </div>
  );
}
