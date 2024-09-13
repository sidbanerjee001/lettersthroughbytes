'use client'

import { useEffect, useState } from 'react';
import supabase from './utils/supabase/client';

interface Response {
  id: number;
  content: string;
  // Add other fields from your table as needed
}

const Home = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('Responses')
        .select('*');

      if (error) throw error;
      console.log('Fetched data:', data);
      setResponses(data as Response[]);
    } catch (error) {
      setError('Error fetching data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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
