'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [password, setPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password === process.env.NEXT_PUBLIC_ADMIN_AUTH_PASSWORD) {
      sessionStorage.setItem('authenticated', 'true');
      sessionStorage.setItem('author', 'sid');
      router.push('/');
    } else if (password === process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD) {
      sessionStorage.setItem('authenticated', 'true');
      sessionStorage.setItem('author', 'adri');
      router.push('/');
    } else {
      setWrongPassword(true);
    }
  };

  return (
    <div className={"h-screen w-screen flex justify-center items-center flex-col"}>
        <div className={"text-center"}>
            <h1>Enter the password (hint: birthstone, or favorite color)</h1>
            <form className={"m-auto"} onSubmit={handleSubmit}>
            <label>
                <input type="password" className={"border-2 p-1"} placeholder={"Type here..."} value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button className={"transition ease-in-out m-10 hover:text-green-700"} type="submit">→ Enter</button>
            </form>
            {wrongPassword && <p>Wrong password...</p>}
        </div>
    </div>
  );
};

export default Login;