import React, {useState, useEffect, useCallback} from 'react';
import './Profile.css';
const countries = require('i18n-iso-countries');
countries.registerLocale(require('i18n-iso-countries/langs/ru.json'));

function Profile(args){
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZWE3M2Y5YTdmZjY0MzExNTk3Zjk5OWJlZmRhMmNhYSIsInN1YiI6IjY2MjdhNDdkNjJmMzM1MDE3ZGRjNTE1YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dZ508YPKqdWCJcU9igCaQKktVqM9I-4m8LOwHAsyDmM'
        }
    };
    const [movies, setMovies] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [error, setError] = useState(null);
    const [activeMovie, setActiveMovie] = useState(null);
    const [activeMovieInformation, setActiveMovieInformation] = useState({})
    const [similarMoviesInformation, setSimilarMoviesInformation] = useState([])
    const numberFormat = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
    function posterMovieInformation(movie) {
        return  <div className="file">
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                 alt="Постер недоступен"/>
            <div className="fileElementShortDiscription">
                <h1>{movie.title}</h1>
                <h3>{movie.original_title}</h3>
            </div>
        </div>
    }
    function formatDate(dateString) {
        const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
        const dateParts = dateString.split("-");

        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10);
        const day = parseInt(dateParts[2], 10);

        return `${day}-ое ${months[month - 1]} ${year}-го года`;
    }

    function Modal({isOpen, onClose, children}) {
        useEffect(() => {
            const handleKeyDown = (event) => {
                if (event.key === 'Escape') {
                    onClose();
                }
            };

            if (isOpen) {
                window.addEventListener('keydown', handleKeyDown);
            }

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }, [isOpen, onClose]);
        if (!isOpen) return null;
        return (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={onClose}>&times;</span>
                    {children}
                    <div className="movieInformation">
                        <div>
                            <h1>{numberFormat.format(activeMovieInformation.vote_average)} {activeMovieInformation.title}</h1>
                            <h3>{activeMovieInformation.original_title}</h3>
                            {activeMovieInformation.overview}
                            <br/>
                            <b>Дата выхода</b>: {formatDate(activeMovieInformation.release_date)}
                            <br/>
                            <b>Жанры:</b>
                            {activeMovieInformation.genres && activeMovieInformation.genres.map((elem, index) => {
                                    if (index !== activeMovieInformation.genres.length - 1) {
                                        return `${elem.name}, `
                                    } else {
                                        return `${elem.name}`
                                    }
                                }
                            )}
                            <br/>
                            <b>Длительность:</b> {activeMovieInformation.runtime ? `${activeMovieInformation.runtime} мин.` : 'Неизвестно'}
                            <br />
                            <b>Популярность: </b> {numberFormat.format(activeMovieInformation.popularity)}
                        </div>
                        <img src={`https://image.tmdb.org/t/p/w300${activeMovieInformation.poster_path}`}
                             alt="Постер недоступен"/>
                    </div>
                    <h2>Похожие фильмы</h2>
                    <div className="similarMovies">
                        {similarMoviesInformation.slice(0, Math.min(5, similarMoviesInformation.length - 1)).map((element, index) =>
                            <div className="similarElement" key={element.id}> {}
                                {posterMovieInformation(element)}
                            </div>
                        )}
                    </div>

                </div>
                <div className="modal-overlay" onClick={onClose}/>
            </div>
        );
    }

    const handleOpenModal = (movie) => {
        if (movie && activeMovie !== movie.id) {
            getMovieInformation(movie.id)
        }
    };
    const getMovieList = useCallback(() => {
        setLoadingList(true);
        setError(null);
        const url = `https://api.themoviedb.org/3/movie/top_rated?language=ru&page=${args.currentPage}`;
        fetch(url, options)
            .then(res => res.json())
            .then(json => {
                setMovies(json.results);
                args.setMaxPages(json.total_pages);
                setLoadingList(false);
            })
            .catch(err => {
                console.error('Ошибка загрузки списка фильмов:', err);
                setError('Не удалось загрузить список фильмов. Проверьте подключение к интернету.');
                setLoadingList(false);
            });
    }, [args]);

    const getMovieInformation = useCallback((movieId) => {
        setLoadingDetails(true);
        setError(null);
        const movieInformationUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=ru`;
        const similarInformationUrl = `https://api.themoviedb.org/3/movie/${movieId}/similar?language=ru`;
        Promise.all([
            fetch(movieInformationUrl, options).then(res => res.json()),
            fetch(similarInformationUrl, options).then(res => res.json())
        ]).then(([movieInfo, similarMovies]) => {
            setActiveMovieInformation(movieInfo);
            setActiveMovie(movieId);
            setSimilarMoviesInformation(similarMovies.results);
            setLoadingDetails(false);
        }).catch(err => {
            console.error('Ошибка получения информации о фильме:', err);
            setError('Не удалось получить информацию о фильме. Проверьте подключение к интернету.');
            setLoadingDetails(false);
        });
    }, [args]);

    useEffect(() => {
        getMovieList();
    }, [getMovieList]);


    return (
        <div>
            <h1>Лучшие фильмы</h1>
            {error && <div className="error">{error}</div>}
            {loadingList ? (
                <div>Загрузка...</div>
            ) : (
                <div className="listOfFilms">
                    {movies.map((movie, index) => (
                        <button className="filmElement" onClick={() => handleOpenModal(movie)} key={movie.id}>
                            <h1>{index + (args.currentPage - 1) * 20 + 1}) </h1>
                            {posterMovieInformation(movie)}
                        </button>
                    ))}
                </div>
            )}
            <Modal isOpen={activeMovie !== null} onClose={() => setActiveMovie(null)} movie={activeMovie} />
            {loadingDetails && <div className="loadingOverlay">Загрузка деталей фильма...</div>}
        </div>
    );
}

export default Profile