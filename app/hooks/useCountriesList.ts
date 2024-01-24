import {useEffect, useState} from 'react';

const getCountries = async ({firstCountries = []}) => {
  try {
    // eslint-disable-next-line import/extensions
    const data = await import('country-region-data/data.json');
    const initialDataList = data.default;
    const firstCountriesMap = firstCountries.reduce((acc, value) => {
      acc[value] = {};
      return acc;
    }, {});
    const initialNameList = initialDataList.map((item) => {
      if (firstCountriesMap[item.countryName]) {
        firstCountriesMap[item.countryName] = item;
      }
      return item.countryName;
    });
    const finalDataList = [
      ...Object.values(firstCountriesMap),
      ...initialDataList,
    ];
    const finalNameList = [
      ...Object.keys(firstCountriesMap),
      ...initialNameList,
    ];
    return {
      finalDataList,
      finalNameList,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const useCountriesList = ({
  firstCountries,
}: {
  firstCountries?: string[];
}) => {
  const [countriesData, setCountriesData] = useState({
    countryNames: [],
    countryNamesData: [],
  });
  const firstCountriesList = Array.isArray(firstCountries)
    ? firstCountries
    : [];

  const awaitCountries = async () => {
    const data = await getCountries({firstCountries: firstCountriesList});
    setCountriesData({
      countryNames: data.finalNameList,
      countryNamesData: data.finalDataList,
    });
  };

  useEffect(() => {
    if (
      countriesData.countryNames.length &&
      countriesData.countryNamesData.length
    )
      return;
    awaitCountries();
  }, []);

  return countriesData;
};
