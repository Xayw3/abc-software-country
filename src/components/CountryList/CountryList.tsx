import axios from 'axios';
import { useEffect, useState } from 'react';
import { Countries, Country } from '../../models/Countries';
import Loader from '../Loader/Loader';
import './country-list.scss';

const CountryList = () => {
  const baseUrl = 'https://countries.trevorblades.com/';
  const [countries, setCountries] = useState<Countries[]>([]);
  const [country, setCountry] = useState<Country>();
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getCountries = async () => {
    setLoading(true);
    try {
      await axios({
        url: baseUrl,
        method: 'post',
        data: {
          query: 'query { countries { name, code } }',
        },
      }).then((results) => {
        if (countries.length === 0) {
          setCountries(results.data.data.countries);
        }
      });
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCountry = async (code: string) => {
    setLoader(true);
    try {
      await axios({
        url: baseUrl,
        method: 'post',
        data: {
          query: `query { country(code: "${code}") { name, capital, native, phone, currency, emoji } }`,
        },
      }).then((results) => {
        setCountry(results.data.data.country);
      });
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  return (
    <div className="container">
      {
        errorMessage.length > 0 ? <h1 className="error">{errorMessage}</h1> : (
          <>
            {
              loading ? <Loader /> : (
                <ul className="countries">
                  { countries.length > 0
                    ? countries.map(({ name, code }) => (
                      <li key={Math.random()}>
                        <button
                          onClick={() => getCountry(country?.name === undefined || country?.name !== name ? code : '')}
                          className="countries__btn"
                        >
                          <h2>{name}</h2>
                        </button>
                        {
                          loader
                            ? <Loader />
                            : (
                              <div>
                                {
                          name === country?.name
                            ? (
                              <div className="countries__info">
                                <p>{`Capital city: ${country.capital}`}</p>
                                <p>{`Phone code: ${country.phone}`}</p>
                                <p>{`Native name: ${country.native}`}</p>
                                <p>{`Country currency: ${country.currency}`}</p>
                                <p>{`Emoji: ${country.emoji}`}</p>
                              </div>
                            ) : null
                          }
                              </div>
                            )
                        }
                      </li>
                    )) : null}
                </ul>
              )
            }
          </>
        )
      }
    </div>
  );
};

export default CountryList;
