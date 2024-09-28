import React, { useRef } from 'react';

import { Toaster, toast } from 'sonner';
import ReactQuill from 'react-quill';
import { Quill } from 'react-quill';
import { Delta } from 'quill/core';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

import { uploadToS3, base64ToBlob, saveImageUrlToSupabase, getMostRecentImageID } from '../utils/utilFunctions';

import supabase from '@/app/utils/supabase/client';

interface TextEditorProps {
  title: string;
  order: number;
  author: string;
  url: string;
}

const QuillEditor: React.FC<TextEditorProps> = ( {title, order, author, url} ) => {

  const quillRef = useRef<ReactQuill>(null);

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

  const handleGetContents = () => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const contents = editor.getContents();
      parseContentsToSemanticHTML(contents.ops);
    }
  };

  async function parseContentsToSemanticHTML (ops: Delta["ops"]) {
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

  // Insert new row into relevant table.

  async function deployResponse(ret: string) {
    const { error } = await supabase
      .from(author + '_content')
      .insert([{ id: title, order: order, author: author, content: ret, url: url }])
    if (error) {
      console.log(error.message);
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
