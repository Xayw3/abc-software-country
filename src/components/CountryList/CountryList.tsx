import axios from 'axios';
import { useEffect, useState } from 'react';
import { Countries } from '../../models/Countries';
import CountryInfo from '../CountryInfo/CountryInfo';
import Loader from '../Loader/Loader';
import './country-list.scss';

const baseUrl = 'https://countries.trevorblades.com/';

const CountryList = () => {
  const [countries, setCountries] = useState<Countries[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getCountries = async () => {
    setLoading(true);
    try {
      const allCountries = await axios({
        url: baseUrl,
        method: 'post',
        data: {
          query: 'query { countries { name, code } }',
        },
      });
      if (countries.length === 0) {
        setCountries(allCountries.data.data.countries);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
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
                  {
                  countries.length > 0
                    ? countries.map(({ name, code }, id) => (
                      <li key={Math.random()}>
                        <CountryInfo countryCode={code} title={name} id={id} onClick={(el) => setErrorMessage(el)} />
                      </li>
                    )) : null
                    }
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
