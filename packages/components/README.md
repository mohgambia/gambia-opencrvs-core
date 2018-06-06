## Set up Environment Variables

Create a .env file with the following settings

```
REACT_APP_LOCALE = gb
REACT_APP_LANGUAGE = en
REACT_APP_CDN = https://s3.eu-west-2.amazonaws.com/opencrvs-dev/
```

For REACT_APP_LOCALE, use lowercase two-letter [ISO "Alpha-2" country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)

E.G. test by setting to "bd" for bangladesh

For REACT_APP_LANGUAGE, use lowercase two-letter [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

E.G. test by setting to "bn" for bangladesh

## Running the styleguide 

```
yarn start
```

to launch project with nodemon running.