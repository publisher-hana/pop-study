//import { lessons } from "../data/data";
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import DetailItem from "../component/DetailItem";

function App() {
 // const sortedLessons = [...lessons].sort((a, b) => b.id - a.id);
 const [songs, setSongs] = useState([]);
 
 useEffect(() => {
    const fetchLessons = async () => {
      // 2. Supabase에서 song과 그에 연결된 segment를 모두 가져옴
      const { data, error } = await supabase
        .from('song')
        .select(`*, segments:segment(*)`); 

      if (error) {
        console.error('데이터 불러오기 에러:', error);
      } else {
        setSongs(data); // 3. 가져온 데이터를 상태에 저장
      }
    };

    fetchLessons();
  }, []);
  const sortedLessons = [...songs].sort((a, b) => b.id - a.id);
 return (
    <div className="lesson-wrap">
        <ul className="lesson-list">
          {sortedLessons.map((value) => (
            <DetailItem
              key={value.id}
              value={value}                       // 곡/레슨 데이터 전체 넘김
              link={`/detail/${value.id}`}        // 이동 경로
            />
          ))}
        </ul>
    </div>
  )
}

export default App
