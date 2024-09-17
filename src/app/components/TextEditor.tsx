import React, { useRef } from 'react';

import { Toaster, toast } from 'sonner';
import { Button } from '@mui/material';
import ReactQuill, { Quill } from 'react-quill';
import { Delta } from 'quill/core';
import 'react-quill/dist/quill.snow.css';

import supabase from '@/app/utils/supabase/client';

interface TextEditorProps {
  id: string;
  order: number;
  author: string;
}

const QuillEditor: React.FC<TextEditorProps> = ( {id, order, author} ) => {

  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      ['bold', 'italic'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const handleGetContents = () => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const contents = editor.getContents(); 
      // parseContentsToMarkdown(contents.ops);
      parseContentsToSemanticHTML(contents.ops);
    }
  };

  function parseContentsToSemanticHTML (ops: Delta["ops"]) {
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
      deployResponse(ret);
    } else {
      toast('type a response first!', {
        action: {
          label: 'close',
          onClick: () => toast.dismiss()
        },
      })
    }
  }

  // Unused function to convert editor text to markdown compatible formatting.
  // Unused because it doesn't maintain newlines properly. Semantic HTML preferred.
  
  function parseContentsToMarkdown(ops: Delta["ops"]) {
    let ret = "";
    for (let i = 0; i < ops.length; i++) {
      let curr = "";
      let isBold = false;
      let isItalic = false;
      if ("attributes" in ops[i]) {
        isBold = "bold" in ops[i].attributes!;
        isItalic = "italic" in ops[i].attributes!;
      }
      if (isBold) {
        curr = curr.concat("**");
      }
      if (isItalic) {
        curr = curr.concat("__");
      }

      curr = curr.concat(ops[i].insert!.toString());

      if (isItalic) {
        curr = curr.concat("__");
      }
      if (isBold) {
        curr = curr.concat("**");
      }
      ret = ret.concat(curr);
    }
    if (ret != '\n') {
      deployResponse(ret);
    }
  }

  // Insert new row into relevant table.

  async function deployResponse(ret: string) {
    const { error } = await supabase
      .from(author + '_content')
      .insert([{ id: id, order: order, author: author, content: ret }])
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

  return (
    <div>
      <Toaster position="bottom-center"/>
      <div className={"mt-8 mb-8 text-right"}><h2>Write back, or again, in the box below.</h2></div>
      <ReactQuill className={"font-serif"} ref={quillRef} theme="snow" modules={modules}/>
      <div className={"transition ml-auto mr-0 ease-in-out w-fit mt-8 mb-8 text-black hover:text-green-700"}><button onClick={handleGetContents}>[Submit Response →]</button></div>
    </div>
  );
};

export default QuillEditor;
