# FIUBER-Trips
Here we gonna save the server which manage FIUBER trips

## Local installation & usage

1. Copy the Firebase credentials JSON (`service-account-file.json`) into the root directory of the repository.
2. Start the MongoDB instance: `docker run -it --rm --name test -p 27017:27017 mongo:6.0.2`
3. Set the credentials environment variable: `export GOOGLE_APPLICATION_CREDENTIALS=service-account-file.json`.
4. Start the server: `yarn build && yarn start`.

The API will be available on `http://localhost:8000/api`.
