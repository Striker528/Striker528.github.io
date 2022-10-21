import React from 'react'
import { BsTrash, BsPencilSquare, BsBoxArrowUpRight } from "react-icons/bs";

const MovieListItem = ({ movie, onDeleteClick, onEditClick, onOpenCLick }) => {
    //take in a profile, then destructure the avatar
    //genres will be an array, make it default to [] to avoid errors
    const { poster, title, genres = [], status } = movie;
    
    //for the genres map
    //if we set the key to just be {g} == get issues
    //need to add the index, and so must also destructure the index
    return (
        <table className="w-full border-b">
            <tbody>
                <tr>
                    <td>
                        <div className="w-24">
                            <img
                                className="w-full aspect-video"
                                src={poster}
                                alt={title}
                            />
                        </div>
                    </td>

                    <td className="w-full pl-5">
                        <div>
                            <h1 className=" text-lg font-semibold text-primary dark:text-white">
                                {title}
                            </h1>
                            <div className="space-x-1">
                                {genres.map((g,index) => {
                                    return (
                                        <span
                                            key={g + index}
                                            className="text-primary dark:text-white text-xs">
                                            {g}
                                        </span>
                                    )
                                })}
                                
                            </div>
                        </div>
                    </td>

                    <td className="px-5">
                        <p className="text-primary dark:text-white">
                            {status}
                        </p>
                    </td>

                    <td>
                        <div className="flex items-center space-x-3 text-primary dark:text-white text-lg">
                            <button onClick={onDeleteClick} type="button">
                                <BsTrash/>
                            </button>
                            <button onClick={onEditClick} type="button">
                                <BsPencilSquare/>
                            </button>
                            <button onClick={onOpenCLick} type="button">
                                <BsBoxArrowUpRight/>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    )
};


export default MovieListItem;