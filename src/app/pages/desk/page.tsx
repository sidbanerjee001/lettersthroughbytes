'use client';
import dynamic from 'next/dynamic'

import LetterEditor from "@/app/components/LetterEditor";
 
const DynamicComponentWithNoSSR = dynamic(
  () => import('@/app/components/LetterEditor'),
  { ssr: false }
)

const Desk = () => {

    return (
        <>
            <DynamicComponentWithNoSSR author={'sid'}/>
        </>
    );

};

export default Desk;