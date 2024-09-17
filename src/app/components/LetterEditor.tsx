import React, { useEffect, useRef } from 'react';

import { Toaster, toast } from 'sonner';
import { Button } from '@mui/material';
import ReactQuill, { Quill } from 'react-quill';
import { Delta } from 'quill/core';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

import supabase from '@/app/utils/supabase/client';

interface TextEditorProps {
  author: string;
}

const LetterEditor: React.FC<TextEditorProps> = ( {author} ) => {

  const quillRef = useRef<ReactQuill>(null);
  const titleQuillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      ['bold', 'italic'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

    async function handleGetContents() {
        const titleTextEditor = titleQuillRef.current?.getEditor();
        if (titleTextEditor) {
            var newID = await fetchLatestID() + 1;
            var title = titleTextEditor.getText().trimStart().trimEnd();
            deployResponse('letter_list', {id: newID, name: title});
        } 

        const editor = quillRef.current?.getEditor();
        if (editor) {
            const contents = editor.getContents(); 
            parseContentsToSemanticHTML(titleTextEditor!.getText(), contents.ops);
        }
    };

  function parseContentsToSemanticHTML (title: string, ops: Delta["ops"]) {
    let ret = "<p>";
    for (let i = 0; i < ops.length; i++) {
      let curr = "";
      let isBold = false;
      let isItalic = false;
      if ("attributes" in ops[i]) {
        isBold = "bold" in ops[i].attributes!;
        isItalic = "italic" in ops[i].attributes!;
      }
      if (isBold) {
        curr = curr.concat("<b>");
      }
      if (isItalic) {
        curr = curr.concat("<i>");
      }

      curr = curr.concat(ops[i].insert!.toString());

      if (isItalic) {
        curr = curr.concat("</i>");
      }
      if (isBold) {
        curr = curr.concat("</b>");
      }
      curr = curr.replace(/[\r\n]/g, "<br />");
      ret = ret.concat(curr);
    }

    ret += "</p>";
    if (ret != '<p><br /></p>') {
      deployResponse('sid_content', {id: title, order: 1, author: "sid", content: ret});
    } else {
      toast('type a response first!', {
        action: {
          label: 'close',
          onClick: () => toast.dismiss()
        },
      })
    }
  }

  // Insert new row into relevant table.

  async function deployResponse(table: string, values: Record<string, any>) {

    const { error } = await supabase
      .from(table)
      .insert(values);
    if (error) {
      toast('response failed :( are you signed in?', {
        action: {
          label: 'close',
          onClick: () => toast.dismiss()
        },
      })
    } else {
      toast('response registered :)', {
        action: {
          label: 'close',
          onClick: () => toast.dismiss()
        },
      })
    }
  }

  const fetchLatestID = async () => {
    const { data, error } = await supabase
      .from('letter_list')
      .select('id')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching content:', error.message);
    } else {
        return data[data.length-1].id;
    }
  };

  return (
    <div className={"w-1/2 m-auto"}>
      <Toaster position="bottom-center"/>
      <div className={"mt-8 mb-8 text-center"}><h2>Write a letter below.</h2></div>
      <hr className={"mt-10 mb-10"}/>
      <h1>Title:</h1>
        <ReactQuill className={"font-serif"} ref={titleQuillRef} theme="snow" modules={modules}/>
      <hr className={"mt-10 mb-10"}/>
      <h2>Content:</h2>
        <ReactQuill className={"font-serif"} ref={quillRef} theme="snow" modules={modules}/>
      <div className={"transition ease-in-out w-fit mt-8 mb-8 text-black hover:text-green-700"}><button onClick={handleGetContents}>[Send Letter →]</button></div>
    </div>
  );
};

export default LetterEditor;
