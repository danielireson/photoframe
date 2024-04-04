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

const fetchMediaItems = async (authToken, albumId) => {
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

  const imageMediaItems = mediaItems.filter((mediaItem) =>
    mediaItem?.mimeType?.startsWith("image/")
  );

  return imageMediaItems;
};

export const fetchImages = async (authToken) => {
  const albumId = await fetchAlbumId(authToken);

  if (!albumId) {
    return [];
  }

  const mediaItems = await fetchMediaItems(authToken, albumId);
  const images = mediaItems
    .map(
      (mediaItem) =>
        `${mediaItem.baseUrl}=w${mediaItem.mediaMetadata.width}-h${mediaItem.mediaMetadata.height}`
    )
    .sort(() => Math.random() - 0.5);

  return images;
};
