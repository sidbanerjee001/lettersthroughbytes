'use client';

/* eslint-disable  @typescript-eslint/no-explicit-any */

import React, { useRef } from 'react';

import { Toaster, toast } from 'sonner';
import ReactQuill from 'react-quill';
import { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import { Delta } from 'quill/core';
import 'react-quill/dist/quill.snow.css';
Quill.register('modules/imageResize', ImageResize);

import supabase from '@/app/utils/supabase/client';

import { uploadToS3, base64ToBlob, saveImageUrlToSupabase, getMostRecentImageID } from '../utils/utilFunctions';

interface TextEditorProps {
  author: string;
}

const LetterEditor: React.FC<TextEditorProps> = ( {author} ) => {

  const quillRef = useRef<ReactQuill>(null);
  const titleQuillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      ['bold', 'italic'],
      ['clean'],
      ['image'],
    ],
    clipboard: {
      matchVisual: false,
    },
    imageResize: {
      modules: ['Resize', 'DisplaySize']
    },
  };

    function sendToast(message: string) {
      toast(message, {
        action: {
          label: 'close',
          onClick: () => toast.dismiss()
        },
      })
    }

    async function handleGetContents() {
        const titleTextEditor = titleQuillRef.current?.getEditor();
        let cont = true;
        let stripped_url = "";
        if (titleTextEditor) {
            const newID = await fetchLatestID() + 1;
            const title = titleTextEditor.getText().trimStart().trimEnd();
            if (title === "") {
              cont = false;
              sendToast('enter a title first!');
            } else {
              stripped_url = title.replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
              deployResponse('letter_list', {id: newID, name: title, url: stripped_url});
            }
        } 

        if (cont){ 
          const editor = quillRef.current?.getEditor();
          if (editor) {
              const contents = editor.getContents(); 
              parseContentsToSemanticHTML(titleTextEditor!.getText(), contents.ops, stripped_url);
          }
        }
    };

  async function parseContentsToSemanticHTML (title: string, ops: Delta["ops"], stripped_url: string) {
    let ret = "<p>";
    for (let i = 0; i < ops.length; i++) {
      let curr = "";
      let isBold = false;
      let isItalic = false;
      if (typeof ops[i].insert === 'object') {
        let imgWidth = -1;
        const imgOrder = Number(getMostRecentImageID(title));
        if ("attributes" in ops[i]) {
          imgWidth = Number(ops[i]["attributes"]!["width"]);
        }
        const base64Data = ops[i].insert!["image"].match(/data:image\/[a-zA-Z]+;base64,(.*)$/)?.[1];
        const imageBlob = base64ToBlob(base64Data, 'image/png');

        try {
          const imageUrl = await uploadToS3(imageBlob, title, imgOrder);
          await saveImageUrlToSupabase(title, imageUrl, imgOrder);
          console.log('Image successfully uploaded and URL saved!');

          if (imgWidth === -1) {
            curr = `</p> <br/> <img src="${imageUrl}" class="m-auto"></img> <br/> <p>`;
          } else {
            curr = `</p> <br/> <img src="${imageUrl}" width="${imgWidth}" class="m-auto"></img> <br/> <p>`;
          }
        } catch (error) {
            console.log(error);
            toast('error uploading image :( text sid!', {
              action: {
                label: 'close',
                onClick: () => toast.dismiss()
              },
            })
            return;
        }
      } else {
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
        }
        ret = ret.concat(curr);
      }

    ret += "</p>";
    if (ret != '<p><br /></p>') {
      deployResponse(author+'_content', {id: title, order: 1, author: author, content: ret, url: stripped_url});
      sendToast('response registered :)');
    } else {
      sendToast('response failed :(');
    }
  }

  // Insert new row into relevant table.

  async function deployResponse(table: string, values: Record<string, any>) {

    const { error } = await supabase
      .from(table)
      .insert(values);
    if (error) {
      sendToast('response failed :(');
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
    <div className={"m-auto sm:w-7/12 sm:text-base text-xs w-11/12"}>
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
