import { useState } from 'react'
import { lessons } from "../data/data";
import DetailItem from "../component/DetailItem";

function App() {

  return (
    <div className="lesson-wrap">
        <ul className="lesson-list">
          {lessons.map((value) => (
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
