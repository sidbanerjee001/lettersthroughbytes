'use client'

import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  speed: number;  // Speed in milliseconds
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed }) => {
  const [displayedText, setDisplayedText] = useState<string>("...");

  useEffect(() => {
    let index = 0;
    let t = "";
    const intervalId = setInterval(() => {
      t += text[index];
      setDisplayedText(t);
      index++;
      if (index === text.length) {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    <>
      <p>{displayedText}</p>
    </>
  );
};


const Home = () => {
  return (
    <div className={"h-screen w-screen flex justify-center items-center flex-col"}>
      <TypingText text="Letters Through Bytes" speed={32} />
      <div className={"flex flex-row"}>
        <a href="/pages/home" className={"transition ease-in-out m-2 hover:text-green-700"}>[Read]</a>
        <a href="/pages/desk" className={"transition ease-in-out m-2 hover:text-green-700"}>[Write]</a>
        <a href="https://github.com/sidbanerjee001/lettersthroughbytes" target="_blank" className={"transition ease-in-out m-2 hover:text-green-700"}>[Documentation]</a>
      </div>
    </div>
  );
};

export default Home;
