'use client';
import dynamic from 'next/dynamic'
 
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