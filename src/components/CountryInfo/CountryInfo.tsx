import './country-info.scss';
import axios from 'axios';
import { FC, useState } from 'react';
import { Country } from '../../models/Countries';

const baseUrl = 'https://countries.trevorblades.com/';

type CountryInfoProps = {
  countryCode: string,
  title: string,
  id: number,
  onClick: (el: string) => void,
};

const CountryInfo:FC<CountryInfoProps> = ({
  countryCode, title, id, onClick,
}) => {
  const [country, setCountry] = useState<Country>();
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countryId, setCountryId] = useState<number>();

  const getCountry = async (code: string) => {
    setLoader(true);
    try {
      const oneCountry = await axios({
        url: baseUrl,
        method: 'post',
        data: {
          query: `query { country(code: "${code}") { name, capital, native, phone, currency, emoji } }`,
        },
      });
      setCountry(oneCountry.data.data.country);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          onClick(errorMessage); setCountryId(id); getCountry(country?.name !== title ? countryCode : '');
        }}
        className="countries__btn"
      >
        {title}
      </button>
      { loader && countryId === id ? <p>Loading...</p> : (
        <>
          { title !== country?.name ? null : (
            <div className="countries__info">
              <p>{`Capital city: ${country?.capital}`}</p>
              <p>{`Phone code: ${country?.phone}`}</p>
              <p>{`Native name: ${country?.native}`}</p>
              <p>{`Country currency: ${country?.currency}`}</p>
              <p>{`Emoji: ${country?.emoji}`}</p>
            </div>
          ) }
        </>
      )}
    </>
  );
};

export default CountryInfo;
