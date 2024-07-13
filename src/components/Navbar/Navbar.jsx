import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import ProfileInfo from '../Cards/ProfileInfo';

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery)
            onSearchNote(searchQuery);
    }

    const onLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const onClearSearch = () => {
        handleClearSearch();
        setSearchQuery("");
    }

    return (
        <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
            <h2 className='text-xl font-bold text-black py-2'>ShortNotes</h2>
            {userInfo && 
                <>
                    <SearchBar 
                        value={searchQuery} 
                        onLogout={onLogout} 
                        onChange={({ target }) => setSearchQuery(target.value)} 
                        handleSearch={handleSearch} 
                        onClearSearch={onClearSearch} 
                    />
                    <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
                </>
            }
        </div>
    );
}

export default Navbar;
