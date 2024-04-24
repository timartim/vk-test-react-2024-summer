import './App.css';
import './Profile'
import Profile from "./Profile";
function App() {
  return (
      <div>
        <span className={'Популярные фильмы'}>Кино справочник</span>
          <Profile currentPage={1} />
      </div>
  );
}

export default App;
