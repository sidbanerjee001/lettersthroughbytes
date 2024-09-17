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
      <TypingText text="the requested page wasn't found. maybe you followed a bad link, or hard-routed a malformed one. in either case there's nothing here." speed={25} />
      <a href="/" className={"transition ease-in-out m-2 hover:text-green-700"}>[Home]</a>
    </div>
  );
};

export default Home;
