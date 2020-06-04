module.exports = function(s) {
  function run() {
    let pre = [
      "Cihaz",
      [
        ["DeviceCode", "Cihaz Kodu", "number", "col-sm-4", "1"],
        ["DeviceName", "Cihaz Adı", "text", "col-sm-8", "2"],
        ["CreatedDate", "Oluşturulma Tarihi", "disabled", "col-sm-4", "4"],
        ["Explanation", "Açıklama", "text", "col-sm-8", "3"]
      ]
    ];

    s.$axios.get("/api/Device/get-all").then(response => {
      s.pagefunc(pre, s.idLow(response.data.Data), "Device");
      s.load = true;
    });
  }
  run();
};
