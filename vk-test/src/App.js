import './App.css';
import './Profile'
import Profile from "./Profile";
import {useState, useEffect} from "react";
const MIN_PAGES = 1;
function App() {
    const [page, setPage] = useState(1)
    const [MAX_PAGES, setMaxPages] = useState(400);
    function updatePage(newPage) {
        if (newPage < MIN_PAGES) {
            alert('Это первая страница, вы не можете перейти на предыдущую!');
        } else if (newPage > MAX_PAGES) {
            alert('Это последняя страница, вы не можете перейти на следующую!');
        } else {
            setPage(newPage);
            localStorage.setItem('currentPage', newPage);
        }
    }
    function getButtonIds(){
        let minPage = Math.max(page - 4, MIN_PAGES)
        let ids = [];
        for(let i = minPage; i < Math.min(minPage + 8, MAX_PAGES); i++){
            ids.push(i);
        }
        return ids;
    }
    function ButtonList() {
        return (
            <div className="buttonList">
                <button onClick={() => updatePage(page - 1)} disabled={page === MIN_PAGES}>Предыдущая страница</button>
                <button onClick={() => updatePage(1)}>На первую страницу</button>
                {getButtonIds().map((element) => {
                    console.log(page, element)
                    return (
                        <button
                            key={element}
                            className={page === element ? "currentPage" : ""}
                            onClick={() => updatePage(element)}
                        >
                            {element}
                        </button>
                    );
                })}
                <button onClick={() => updatePage(page + 1)} disabled={page === MAX_PAGES}>Следующая страница</button>
            </div>
        );
    }

    useEffect(() => {
        const savedPage = localStorage.getItem('currentPage');
        if (savedPage) {
            setPage(Number(savedPage));
        }
    }, []);
    return (
        <div>
            <span className={'popularMovies'}>Кино справочник</span>
            <ButtonList />
            <Profile currentPage={page} setMaxPages={setMaxPages}/>
            <ButtonList />
      </div>
    );
}

export default App;
