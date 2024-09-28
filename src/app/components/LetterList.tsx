import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import supabase from '../utils/supabase/client';

export const LetterList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState<{ id: number, name: string, url: string }[]>([]);

  useEffect(() => {
    const fetchTitles = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase.from('letter_list').select('id, name, url');
          if (error) {
            throw error;
          }
          setTitles(data || []);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
    };
    fetchTitles();
  }, []);

  if (loading) return <p>Loading...</p>

  return (
    <ul>
      {titles.map((row) => (
        <li key={row.id} className={"mb-3"}>
          <Link className={"transition ease-in-out text-black hover:text-green-700"} href={`/pages/letter/${row.url}/${row.name}`}>
            [{row.name}]
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default LetterList;