# FIUBER-Trips
Here we gonna save the server which manage FIUBER trips

## Local installation & usage

1. Create a `.env` file in the root folder of the repository with the following content:
```shell
FIREBASE_PROJECT_ID="fiuber"
FIREBASE_PRIVATE_KEY="<firebase-private-key>"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-nfwoc@fiuber.iam.gserviceaccount.com"
```
2. Start the MongoDB instance: `docker run -it --rm --name test -p 27017:27017 mongo:6.0.2`
3. Start the server: `yarn build && yarn start`.

The API will be available on `http://localhost:8000/api`.
