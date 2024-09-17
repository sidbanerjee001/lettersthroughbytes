'use client';

import { useState, useRef } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

import LetterEditor from "@/app/components/LetterEditor";

const Desk = () => {

    return (
        <>
            <LetterEditor author={"sid"}/>
        </>
    );

};

export default Desk;