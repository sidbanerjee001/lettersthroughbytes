'use client'

import { useState } from 'react';
import supabase from './utils/supabase/client';

interface Response {
  id: number;
  content: string;
}

const Home = () => {
  const [responses, setResponses] = useState<Response[]>([]);

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('Responses')
        .select('*');

      if (error) throw error;
      console.log('Fetched data:', data);
      setResponses(data as Response[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };

  return (
    <div>
      <button onClick={fetchResponses}>Show/Hide Responses</button>
      <h1>Responses</h1>
      <ul>
        {responses.map((response) => (
          <li key={response.id}>{response.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
