import React, {useState, useEffect, useCallback} from 'react';
import './Profile.css';
const countries = require('i18n-iso-countries');
countries.registerLocale(require('i18n-iso-countries/langs/ru.json'));
function Profile(args){
    const [movies, setMovies] = useState([]);
    const getData = useCallback(() => {
        const url = `https://api.themoviedb.org/3/movie/top_rated?language=ru&page=${args.currentPage}`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZWE3M2Y5YTdmZjY0MzExNTk3Zjk5OWJlZmRhMmNhYSIsInN1YiI6IjY2MjdhNDdkNjJmMzM1MDE3ZGRjNTE1YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dZ508YPKqdWCJcU9igCaQKktVqM9I-4m8LOwHAsyDmM'
            }
        };

        fetch(url, options)
            .then(res => res.json())
            .then(json => {console.log(json); setMovies(json.results)})
            .catch(err => console.error('error:' + err));
    }, [args])
    useEffect(() => {
        getData();
    }, [getData]);
    return (
        <div>
            <h1>Popular Movies</h1>
            <div className="listOfFilms">
                {movies.map((movie,index) => (
                    <div className="filmElement">
                        <h1>{index + (args.currentPage - 1) * 20 + 1}) </h1>
                        <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                             alt="Постер недоступен"/>
                        <div className="fileElementShortDiscription">
                             <h1>{movie.title}</h1>
                             <h2>{movie.original_title}</h2>
                        </div>
                    </div> // Пример отображения данных
                ))}
            </div>
        </div>
    )
}

export default Profile