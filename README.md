# Photoframe

Photo frame app for Google Photos

## Usage

Create an album in Google Photos called `Photoframe` and add any images that you want to display. Up to 50 of the most recent images from the album will be shown in a random order.

## Motivation

I wanted to repurpose an unused Android tablet that I had lying in a drawer into a digital photo frame for a bookshelf and I couldn't find any existing free apps in the app store that looked suitable.

## Technology

JavaScript, Node.js, Express.

## Development

```shell
# install dependencies
npm install

# create env file
cp .env.sample .env

# start server
npm start

# watch for changes
npm run dev
```

A Dockerfile has been included for building the app in container environments.

## Future

- Pagination to fetch more than 50 images
- Animated transitions between slides

## License

This project is licensed under the MIT License.
