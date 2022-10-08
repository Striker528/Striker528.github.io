export const validateMovie = (movieInfo) => {
    //to check go to:
    //backend/middlewars/validator.js => validateMovie
    //storyLine is storyLine not storyline , check spelling and capitalization
    const { title, storyLine, language, releseDate, status, type, genres, tags, cast } = movieInfo
    
    //if no title
    const title_holder = title || '';
    if (!title_holder.trim()) return { error: "Title is missing!" }
    //if no storyline
    //console.log("storyline")
    //console.log(storyline)
    const storyline_holder = storyLine || '';
    //console.log("storyline_holder")
    //console.log(storyline_holder)
    if (!storyline_holder.trim()) return { error: "Storyline is missing!" }
    //if no language
    const language_holder = language || '';
    if (!language_holder.trim()) return { error: "Language is missing!" }
    //if no releaseDate
    const releaseDate_holder = releseDate || '';
    if (!releaseDate_holder.trim()) return { error: "Release Date is missing!" }
    //if no status
    const status_holder = status || '';
    if (!status_holder.trim()) return { error: "Status is missing!" }
    //if no type
    const type_holder = type || '';
    if (!type_holder.trim()) return { error: "Type is missing!" }
    
    //if no genres
    //we are checking if genres is an array or not
    if (!genres.length) return { error: "Genres is missing!" }
    //or
    //if no genres
    //we are checking if genres is an array or not
    //if (!Array.isArray(genres)) return { error: "Genres is missing!" }
    //we are checking genres needs to field with string values
    for (let gen of genres) {
      const gen_holder = gen || '';
      if (!gen_holder.trim()) {
        return {error: "Invalid genres!"}
      }
    }
  
    //if no tags
    //if (!Array.isArray(tags)) return { error: "Tags is missing!" }
    //console.log("tags")
    //console.log(tags)
    if (!tags.length) return { error: "Tags is missing!" }
    for (let tag of tags) {
      const tag_holder = tag || '';
      if (!tag_holder.trim()) {
        return {error: "Invalid tags!"}
      }
      }
      
  
    //if no cast
    if (!cast.length) return { error: "Cast is missing!" }
    //if (!Array.isArray(cast)) return { error: "Cast is missing!" }
    for (let people of cast) {
      if (typeof people !== "object") {
        return {error: "Invalid Cast!"}
      }
    }
  
    //if everything works, need to add a return statement that everything is good
    return {error: null}
  }