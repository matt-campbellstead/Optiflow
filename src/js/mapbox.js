export const displayMap = (locations) => {
  mapboxgl.accessToken = process.env.MAPBOX_TOKEN;

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/matthieumusicien/cmuiastt1005l01si4cr3h0ah',
    projection: 'globe',
    scrollZoom: false,
    zoom: 2.72,
    center: [18.4232, -33.9258], // longitude/lng, latitude/ltd
  });

  //  new mapboxgl.Marker({
  //   color: 'rgb(240, 152, 60)',
  //   anchor: 'bottom',
  // })
  //   .setLngLat([18.4232, -33.9258])
  //   .addTo(map);

  locations.forEach((location) =>
    new mapboxgl.Marker({
      color: 'rgb(240, 152, 60)',
      anchor: 'bottom',
    })
      .setLngLat(location.coordinates)
      .addTo(map),
  );
  map.addControl(new mapboxgl.NavigationControl());

  map.scrollZoom.disable();
};
