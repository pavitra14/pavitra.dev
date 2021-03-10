if (
  location.protocol !== "https:" &&
  window.location.hostname.match(
    /localhost|[0-9]{2,3}\.[0-9]{2,3}\.[0-9]{2,3}\.[0-9]{2,3}|::1|\.local|^$/gi
  ) != "localhost"
) {
  location.replace(
    `https:${location.href.substring(location.protocol.length)}`
  );
}
