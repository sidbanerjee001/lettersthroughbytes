'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

import { LetterList } from '@/app/components/LetterList'

export default function LetterOne() {
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
    <div className={"h-screen w-screen flex justify-center items-center flex-col text-center"}>
      Synced Mailbox <br/> 
      <p className={"text-sm"}>(<i>select a letter to continue...</i>)</p>
      <div className={"mt-4"}>
        <LetterList></LetterList>
      </div>
    </div>
      
  )
}