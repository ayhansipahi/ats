module.exports = function(s) {
  function run() {
    let pre = [
      "İstasyon",
      [
        ["StationName", "İstasyon Adı", "text", "col-sm-8", "1"],
        ["StationType", "İstasyon Tipi", "text", "col-sm-4", "2"],
        ["Latitude", "Enlem", "number", "col-sm-4", "3"],
        ["Longitude", "Boylam", "number", "col-sm-4", "4"],
        ["CreatedDate", "Oluşturulma Tarihi", "disabled", "col-sm-4", "5"]
      ]
    ];

    s.$axios.get("/api/Station/get-all").then(response => {
      s.pagefunc(pre, s.idLow(response.data.Data), "Station");
      s.load = true;
    });
  }
  run();
};
