import React from 'react';
import './App.css';
import Sidebar from './Components/Sidebar/Sidebar';
import Editor from './Components/Editor/Editor';
// import { data } from "./data";
import Split from "react-split";
import {nanoid} from "nanoid";

function App() {

 
    // const changedNotes = localStorage.getItem(JSON.parse("notes"));
    const changedNotes = JSON.parse(localStorage.getItem("notes"));

    const [notes, setNotes] = React.useState( () => changedNotes || []);
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )

    React.useEffect(() => {
        // console.log("Effect Ran")
        localStorage.setItem("notes", JSON.stringify(notes))
        //console.log((notes[0].body.Split("\n")))
    }, [notes]);


    function deleteNote(event, noteId) {
        event.stopPropagation()
        setNotes(prevNotes =>  prevNotes.filter(note =>  note.id !== noteId )
        
        //console.log("delete btn works", noteId)
    )}

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: `# Type your markdown note's title here`
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    };
    
    function updateNote(text) {
         // puts the most recently-modified note at the top
        setNotes(oldNotes => {
            const emptyArr = [];

            for(let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i];
                if(oldNote.id === currentNoteId) {
                    emptyArr.unshift({ ...oldNote, body: text })
                } else {
                    emptyArr.push(oldNote)
                }

            }
            return emptyArr
        })

    };
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
        
    };

    //console.log(findCurrentNote())
    //console.log(window.innerHeight)


    return (
      <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
      </main>
    );
}

export default App;
