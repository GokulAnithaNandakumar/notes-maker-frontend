import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import Toast from '../../components/ToastMessge/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';

Modal.setAppElement('#root');


const Home = () => {

    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown:false,
        type:'add',
        data:null
    });

    const [showToastMsg, setShowToastMsg] = useState({
        isShown:false,
        message:'',
        type:'add',
    });

    const [allNotes, setAllNotes] = useState([]);
    

    const [userInfo, setUserInfo] = useState(null);
    const [isSearch, setIsSearch] = useState(false);
    const navigate=useNavigate();

    const handleEdit=(noteDetails) => {
        setOpenAddEditModal({
            isShown:true,
            type:'edit',
            data:noteDetails
        });
    }

    const showToastMessage = (message,type) => {
        setShowToastMsg({
            isShown:true,
            message,
            type
        });
    }
    const handleCloseToast = () => {
        setShowToastMsg({
            isShown:false,
            message:'',
        });
    }


    //Get user info
    const getUserInfo = async() => {
        try{
            const response = await axiosInstance.get('/get-user');
            if(response.data && response.data.user){
                setUserInfo(response.data.user);
            }
        }catch(error){
            if(error.response.status===401){
                localStorage.clear;
                navigate('/login');
            }
        }
    }

    //Get all notes
    const getAllNotes = async() => {
        try{
            const response = await axiosInstance.get('/get-all-notes');
            if(response.data && response.data.notes){
                setAllNotes(response.data.notes);
            }
        }catch(error){
            console.log("An unexpected error occured Please try again later");
        }
    }

    useEffect(() => {
        getAllNotes();
        getUserInfo();
        return () => {}
    }, [])

    //delete note
    const deleteNote = async (data) => {
        const noteId = data._id;
        try {
          const response = await axiosInstance.delete("/delete-note/" + noteId);
          if (response.data && response.data.message) {
            showToastMessage("Note deleted successfully", "delete");
            getAllNotes();
          }
        } catch(error) { 
          if (error.response && error.response.data && error.response.data.message)
            console.log(error)
            // console.log("An unexpected error has occured");
        }
      }


//Search fior note
      const onSearchNote = async (query) => {
        if (query === "") {
            setIsSearch(false);
            getAllNotes();
            return;
        }
        try {
            const response = await axiosInstance.get("/search-notes", {
                params: { query: query }
            });
            if (response.data && response.data.notes) {
                setAllNotes(response.data.notes);
                setIsSearch(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClearSearch = () => {
        setIsSearch(false);
        getAllNotes();
    }

    //Handle Pin Note
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
          isPinned: !noteData.isPinned
      });

      if (response.data && response.data.note) {
          showToastMessage("Note pinned successfully");
          getAllNotes();
      }
  } catch(error) {
      if (error.response && error.response.data && error.response.data.message)
          console.log(error.response.data.message);
      else
          console.log(error)
          // console.log("An unexpected error has occured");
  }
}


    

  return (
    <>
    <div>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} /> 
      <div className='container mx-auto'>
        {allNotes.length > 0 ? (<div className='grid grid-cols-3 gap-4 mt-8'>
        {allNotes.map((item, index) => (
            <NoteCard 
            key={item._id}
            title={item.title}
            date={moment(item.createdOn).format('DD MMM, YYYY')}
            content={item.content}
            tags={item.tags}
            isPinned={item.isPinned}
            onEdit={() =>  handleEdit(item)}
            onDelete={() => deleteNote(item)}
            onPinNote={() => updateIsPinned(item)} 
            />
        ))}
        
        </div>): (<EmptyCard />)}
    </div>
    
    <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10' 
    onClick={()=> {
        setOpenAddEditModal({
            isShown:true,
            type:'add',
            data:null
        });
    }}>
        <MdAdd className='text-[32px] text-white' />
        </button> 

        <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={()=>{}}
        styles={{
            overlay:{
                backgroundColor:'rgba(0,0,0,0.2)'
            },
        }}

        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto p-5 overflow-scroll"
        >

        <AddEditNotes 
        type={openAddEditModal.type}
        noteData={openAddEditModal.data}
        onClose={()=> {
            setOpenAddEditModal({ isShown:false, type:'add', data:null });
        }}
        getAllNotes={getAllNotes}
        showToastMessage={showToastMessage}
        />
        </Modal>


        <Toast 
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
        />

    </div>
    </>
  )
}

export default Home
