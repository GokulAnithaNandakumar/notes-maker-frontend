import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import TagInput from '../../components/Input/TagInput';

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);

    const [error, setError] = useState(null);

    // Effect to update state when noteData changes
    useEffect(() => {
        if (noteData) {
            setTitle(noteData.title || '');
            setContent(noteData.content || '');
            setTags(noteData.tags || []);
        }
    }, [noteData]);

    // Add Note
    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post('/add-note', {
                title,
                content,
                tags
            });

            if (response.data && response.data.success) {
                showToastMessage('Note Added Successfully');
                onClose();
                getAllNotes();
                
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
    };

    // Edit note
    const editNote = async () => {
        try {
            const response = await axiosInstance.put(`/edit-note/${noteData._id}`, {
                title,
                content,
                tags
            });

            if (response.data && response.data.success) {
                showToastMessage('Note Edited Successfully');
                getAllNotes();
                onClose();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
    };

    const handleAddNote = () => {
        if (!title) {
            setError('Please Enter a Title');
            return;
        }

        if (!content) {
            setError('Please Enter a Content');
            return;
        }

        setError('');

        if (type === 'edit') {
            editNote();
        } else {
            addNewNote();
        }
    };

    return (
        <div className='relative'>
            <button
                className='w-10 h-10 rounded-full flex items-center justify-center absolute top-3 right-3 hover:bg-slate-50'
                onClick={onClose}
            >
                <MdClose className='text-xl text-slate-400' />
            </button>

            <div className='flex felx-col gap-2'>
                <label className='input-label'>Title</label>
                <input
                    type='text'
                    className='text-2xl text-slate-950 outline-none'
                    placeholder='Go To Gym At 5'
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>

            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>Content</label>
                <textarea
                    type='text'
                    className='text-sm text-slate-950 outline-none p-2 rounded'
                    placeholder='Content'
                    rows={10}
                    value={content}
                    onChange={({ target }) => setContent(target.value)}
                />
            </div>

            <div className='mt-3'>
                <label className='input-label'>Tags</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

            <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>
                {type === 'edit' ? 'Save Changes' : 'Add'}
            </button>
        </div>
    );
};

export default AddEditNotes;
