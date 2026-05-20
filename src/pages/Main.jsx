import { lessons } from "../data/data";
import DetailItem from "../component/DetailItem";

function App() {
  const sortedLessons = [...lessons].sort((a, b) => b.id - a.id);
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
