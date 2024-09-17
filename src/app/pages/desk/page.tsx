'use client';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
 
const DynamicComponentWithNoSSR = dynamic(
  () => import('@/app/components/LetterEditor'),
  { ssr: false }
)

const Desk = () => {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const authStatus = sessionStorage.getItem('authenticated');
        
        if (authStatus !== 'true') {
          router.push('/pages/blocked');
        } else {
          setAuthenticated(true);
        }
      }, [router]);
    
      if (!isAuthenticated) {
        return <div>Verifying...</div>
      }

    return (
        <>
            <div className={"m-auto sm:w-7/12 sm:text-base text-xs w-11/12 mt-8"}><h1><i>Currently writing as: {sessionStorage.getItem('author')}</i></h1></div>
            <DynamicComponentWithNoSSR author={sessionStorage.getItem('author') || 'sid'}/>
        </>
    );

};

export default Desk;