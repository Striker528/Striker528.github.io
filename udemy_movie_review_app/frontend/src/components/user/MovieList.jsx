import React from "react";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import GridContainer from "../GridContainer";
import RatingStar from "../RatingStar";

const trimTitle = (text = "") => {
  if (text.length <= 20) return text;
  return text.substring(0, 20) + "...";
};

export default function MovieList({ title, movies = [] }) {
  if (!movies.length) return null;

  //for the <h1 title={movie.title}>{trimTitle(movie.title)}</h1>
  // the title={movie.title}, if you hover over the name, it will give the full name

  //some movies won't have any ratings, but will still have the star (AiFillStar), need to account for that

  //at the top, want to add titles for the movies

  //in the ListItem, whenever we click on a movie, want to see the full details

  return (
    <div>
      <h1 className="text-2xl dark:text-white text-secondary font-semibold mb-5">
        {title}
      </h1>
      <GridContainer>
        {movies.map((movie) => {
          return <ListItem key={movie.id} movie={movie} />;
        })}
      </GridContainer>
    </div>
  );
}

const ListItem = ({ movie }) => {
  const { id, title, poster, reviews } = movie;
  //when user clicks on a piece of media, go to the media's dedicated page
  return (
    <Link to={"/movie/" + id}>
      <img className="aspect-video object-cover" src={poster} alt={title} />

      <h1
        className="text-lg dark:text-white text-secondary font-semibold"
        title={title}
      >
        {trimTitle(title)}
      </h1>

      <RatingStar rating={reviews.ratingAvg} />
    </Link>
  );
};
