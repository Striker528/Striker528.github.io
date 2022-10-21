import React from 'react'; 
import MovieListItem from './MovieListItem';

export default function LatestUploads() {
    //need to wrap the avatar in 2 curly braces
  return (
      <div className="bg-white shadow dark:shadow dark:bg-secondary p-5 rounded col-span-2">
          <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">
              Recent Uploads
          </h1>

          <MovieListItem
              movie={{
                  poster: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Mops_oct09_cropped2.jpg",
                  title: "Holder title",
                  status: "public",
                  genres: ["Action", "Comedy"]
              }}
          />

      </div>
  )
}
