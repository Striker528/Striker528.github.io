import React, { useState } from 'react'
import { searchActor } from '../api/actor';
import { useSearch } from '../hooks';
import { renderItem } from '../utils/helper';
//import Label from './Label';
import LiveSearch from './LiveSearch'

export default function WriterSelector({ onSelect }) {

    const [value, setValue] = useState("");
    const [profiles, setProfiles] = useState([]);

    const { handleSearch, resetSearch } = useSearch();

    const handleOnChange = ({ target }) => {
        const { value } = target;
        setValue(value);
        //(method, query, updaterFun)
        handleSearch(searchActor, value, setProfiles)
    };

    const handleOnSelect = (profile) => {
        setValue("");
        onSelect(profile)
        setProfiles([])
        resetSearch()
    };

    return (
    <LiveSearch
        name="writers"
        placeholder="Search profile"
        results={profiles}
        renderItem={renderItem}
        onSelect={handleOnSelect}
        onChange={handleOnChange}
        value={value}
    />
  )
}
