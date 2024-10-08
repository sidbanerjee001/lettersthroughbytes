'use client';

import dynamic from 'next/dynamic';
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import supabase from '@/app/utils/supabase/client';

const DynamicTextEditorNoSSR = dynamic(
  () => import('@/app/components/TextEditor'),
  { ssr: false }
)

interface Fragment {
    content: string;
    order: number;
    author: string;
    created_at: string;
  }

export default function Letter ( { params }: {params: {id: string, title: string}}) {
  const [content, setContent] = useState<Fragment[]>([]);
  const [responses, setResponses] = useState<Fragment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const router = useRouter();

  const fetchPage = async () => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('sid_content')
        .select('content, order, author, created_at')
        .eq('url', params.id)
        .order('order', { ascending: true });
  
      if (error) {
        console.error('Error fetching content:', error.message);
      } else {
        console.log(params);
        if (data.length == 0) {
          router.push('/pages/404');
          return;
        }
        setContent(data || []);
      }
      setLoading(false);
    };
  
    const fetchResponses = async () => {
      const { data, error } = await supabase
        .from('adri_content')
        .select('content, order, author, created_at')
        .eq('id', params.id)
        .order('order', { ascending: true });
  
      if (error) {
        console.error('Error fetching content:', error.message);
      } else {
        setResponses(data || []);
      }
    }

    fetchContent();
    fetchResponses();
  }

  useEffect(() => {
    if (params.id) {
      fetchPage();
    }
  }, [params.id]);

  if (loading) return <div className={"p-10 w-1/2 m-auto"}>Loading content...</div>;
  if (!content) return <p>No content found for this ID</p>;

  // const renderAlternatingContent = () => {
  //   const maxLength = Math.max(content.length, responses.length);
  //   const alternatingContent: JSX.Element[] = [];

  //   for (let i = 0; i < maxLength; i++) {
  //     if (i < content.length) {
  //       alternatingContent.push(
  //         <div key={content[i].content} className={"flex flex-row"}>
  //           <div className={"mr-10 w-5 text-blue-800"}>[{content[i].author}]</div>
  //           <div className={`ml-8 mb-5 text-blue-800`} key={`sid-${i}`}>
  //               <div dangerouslySetInnerHTML={{__html: content[i]?.content}}></div>
  //           </div>
  //         </div>
  //       );
  //     }
  //     if (i < responses.length) {
  //       alternatingContent.push(
  //         <div key={responses[i].content} className={"flex flex-row"}>
  //           <div className={"mr-10 w-5 text-green-700"}>[{responses[i].author}]</div>
  //           <div className={`ml-8 mb-5 text-green-700`} key={`adr-${i}`}>
  //               <div dangerouslySetInnerHTML={{__html: responses[i]?.content}}></div>
  //           </div>
  //         </div>
  //       );
  //     }
  //   }

  //   return alternatingContent;
  // };

  const renderContentInOrder= () => {
    let p1 = 0;
    let p2 = 0;
    const orderedContent: JSX.Element[] = [];
    while (p1 < content.length || p2 < responses.length) {
      if (p2 >= responses.length) {
        const d = new Date(content[p1].created_at);
        orderedContent.push(
          <div key={content[p1].content} className={"flex flex-row"}>
            <div className={"mr-10 w-3 text-blue-800"}>
              <div>[{content[p1].author}]</div>
            </div>
            <div className={`mb-5 w-full text-blue-800`} key={`sid-${p1}`}>
                <div dangerouslySetInnerHTML={{__html: content[p1]?.content}}></div>
                <div className={"text-right text-sm"}>
                  {(d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getFullYear()} at
                  {" " + (d.getHours() % 12 || 12) + ":" + d.getMinutes().toString().padStart(2, '0') + (d.getHours() >= 12 ? 'pm' : 'am')}
                </div>
            </div>
          </div>
        );
        p1 += 1;
      } else if (p1 >= content.length) {
        const d = new Date(responses[p2].created_at);
        orderedContent.push(
          <div key={responses[p2].content} className={"flex flex-row"}>
            <div className={"mr-10 w-3 text-green-700"}>[{responses[p2].author}]</div>
            <div className={`mb-5 w-full text-green-700`} key={`adr-${p2}`}>
                <div dangerouslySetInnerHTML={{__html: responses[p2]?.content}}></div>
                <div className={"text-right text-sm"}>
                  {(d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getFullYear()} at
                  {" " + (d.getHours() % 12 || 12) + ":" + d.getMinutes().toString().padStart(2, '0') + (d.getHours() >= 12 ? 'pm' : 'am')}
                </div>
            </div>
          </div>
        );
        p2 += 1;
      } else {
        const c_date = new Date(content[p1].created_at);
        const r_date = new Date(responses[p2].created_at);
        if (c_date < r_date){
          orderedContent.push(
            <div key={content[p1].content} className={"flex flex-row"}>
              <div className={"mr-10 w-3 text-blue-800"}>[{content[p1].author}]</div>
              <div className={`mb-5 w-full text-blue-800`} key={`sid-${p1}`}>
                  <div dangerouslySetInnerHTML={{__html: content[p1]?.content}}></div>
                  <div className={"text-right text-sm"}>
                  {(c_date.getMonth() + 1) + "-" + c_date.getDate() + "-" + c_date.getFullYear()} at
                  {" " + (c_date.getHours() % 12 || 12) + ":" + c_date.getMinutes().toString().padStart(2, '0') + (c_date.getHours() >= 12 ? 'pm' : 'am')}
                </div>
              </div>
            </div>
          );
          p1 += 1;
        } else {
          orderedContent.push(
            <div key={responses[p2].content} className={"flex flex-row"}>
              <div className={"mr-10 w-3 text-green-700"}>[{responses[p2].author}]</div>
              <div className={`mb-5 w-full text-green-700`} key={`adr-${p2}`}>
                  <div dangerouslySetInnerHTML={{__html: responses[p2]?.content}}></div>
                  <div className={"text-right text-sm"}>
                  {(r_date.getMonth() + 1) + "-" + r_date.getDate() + "-" + r_date.getFullYear()} at
                  {" " + (r_date.getHours() % 12 || 12) + ":" + r_date.getMinutes().toString().padStart(2, '0') + (r_date.getHours() >= 12 ? 'pm' : 'am')}
                </div>
              </div>
            </div>
          );
          p2 += 1;
        }
      }
    }

    return orderedContent;
  }

  function getNextOrder() : number {
    let ret = 0;
    if (sessionStorage.getItem('author') === 'sid') {
        if (content.length == 0) {
          return 0;
        }
        ret = content[content.length-1].order + 1;
    } else {
        if (responses.length == 0) {
          return 0;
        }
        ret = responses[responses.length-1]?.order + 1;
    }
    return ret;
  }

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <div className={"p-10 sm:w-7/12 sm:text-base text-xs w-11/12 m-auto"}>
          {renderContentInOrder()}
          <hr className={"mt-4 mb-4"}/>
          <DynamicTextEditorNoSSR title={params.title} order={getNextOrder()} url={params.id} author={sessionStorage.getItem('author')!}/>
      </div>
    </>
  );
};