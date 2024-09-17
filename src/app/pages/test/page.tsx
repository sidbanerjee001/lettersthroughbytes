'use client';

import { useState, useRef } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const TextEditor = () => {

    // State to handle changes in the text editor content
    const [content, setContent] = useState('')
    const quillRef = useRef<ReactQuill>(null);

    // Quill modules configuration
    const modules = {
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' },
          { 'indent': '-1' }, { 'indent': '+1' }],
          ['link', 'image', 'video'],
          ['clean']
        ],
        clipboard: {
          // toggle to add extra line breaks when pasting HTML:
          matchVisual: false,
        }
      };

      function runSubmit () {
        const editor = quillRef.current?.getEditor();
        if (editor) {
          const contents = editor.getContents(); 
          console.log(contents.ops);
        }
      }

    return (
        <div>
            <div className="flex justify-center items-center h-[10rem]">
               <h1 className="text-6xl font-extrabold">Qull.Js Text Editor</h1>
            </div>

            <ReactQuill 
            ref={quillRef}
            className="h-[10rem]" 
            theme='snow'
            formats={['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video']}
            placeholder="Write something amazing..."
            modules={modules}
            onChange={setContent} // Handle text editor content changes
            value={content} // Set the value of the text editor in content
            />
            <button className={"mt-24"} onClick={runSubmit}>Submit</button>
        </div>
    );
};

export default TextEditor;