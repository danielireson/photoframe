import fetch from "node-fetch";

const { API_ENDPOINT, ALBUM_NAME } = process.env;

const fetchAlbumId = async (authToken) => {
  const response = await fetch(`${API_ENDPOINT}/v1/albums?pageSize=50`, {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });

  if (!response.ok) {
    throw new Error("Network request error when fetching album");
  }

  // TODO: handle pagination from token
  const { albums } = await response.json();

  const album = albums.find(
    (album) => album.title.toLowerCase() === ALBUM_NAME
  );

  if (!album) {
    return;
  }

  return album.id;
};

const fetchImagesForAlbumId = async (authToken, albumId) => {
  const response = await fetch(`${API_ENDPOINT}/v1/mediaItems:search`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken,
    },
    body: JSON.stringify({
      pageSize: 100,
      albumId,
    }),
  });

  if (!response.ok) {
    throw new Error("Network request error when fetching images");
  }

  // TODO: handle pagination from token
  const { mediaItems } = await response.json();

  const images = mediaItems.filter((mediaItem) =>
    mediaItem?.mimeType?.startsWith("image/")
  );

  // TODO: build image urls using width and height
  const imageUrls = images
    .map((image) => image.baseUrl)
    .sort(() => Math.random() - 0.5);

  return imageUrls;
};

export const fetchImages = async (authToken) => {
  const albumId = await fetchAlbumId(authToken);

  if (!albumId) {
    return [];
  }

  const images = await fetchImagesForAlbumId(authToken, albumId);

  return images;
};
