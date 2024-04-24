import './App.css';
import './Profile'
import Profile from "./Profile";
import {useState} from "react";
function App() {
    const [page, setPage] = useState(1)
    function updatePage(updatePage){
        setPage(updatePage)
    }
    function getButtonIds(){
        let minPage = Math.max(page - 5, 1)
        let ids = [];
        for(let i = minPage; i < minPage + 10; i++){
            ids.push(i);
        }
        return ids;
    }
    function ButtonList() {
        return <div className="buttonList">
            <button onClick={() => {
                updatePage(page - 1)
            }}>Предыдущая страница
            </button>
            {getButtonIds().map((element) => {
                return <button onClick={() => {
                    updatePage(element)
                }}>{element}</button>
            })}
            <button onClick={() => {
                updatePage(page + 1)
            }}>Следующая страница
            </button>
        </div>
    }

    return (
        <div>
            <span className={'Популярные фильмы'}>Кино справочник</span>
            <ButtonList />
            <Profile currentPage={page}/>
            <ButtonList />
      </div>
    );
}

export default App;
