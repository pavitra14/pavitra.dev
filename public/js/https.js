if (
  location.protocol !== "https:" &&
  window.location.hostname.match(
    /localhost|[0-9]{2,3}\.[0-9]{2,3}\.[0-9]{2,3}\.[0-9]{2,3}|::1|\.local|^$/gi
<<<<<<< HEAD
  ) == null
=======
  ) != "localhost"
>>>>>>> beea1e28235ab89b0c8543a8a4dd4ea081554e4e
) {
  location.replace(
    `https:${location.href.substring(location.protocol.length)}`
  );
}
