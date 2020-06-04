module.exports = function(s) {
  function run() {
    let pre = [
      "Sensör",
      [
        ["SensorCode", "Sensör Kodu", "number", "col-sm-4", "1"],
        ["SensorName", "Sensör Adı", "text", "col-sm-8", "2"],
        ["CreatedDate", "Oluşturulma Tarihi", "disabled", "col-sm-4", "4"],
        ["Explanation", "Açıklama", "text", "col-sm-8", "3"]
      ]
    ];

    s.$axios.get("/api/Sensor/get-all").then(response => {
      s.pagefunc(pre, s.idLow(response.data.Data), "Sensor");
      s.load = true;
    });
  }
  run();
};
