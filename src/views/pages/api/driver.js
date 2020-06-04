module.exports = function(s) {
  function run() {
    let pre = [
      "Şoför",
      [
        ["DriverName", "Ad Soyad", "text", "col-sm-8", "1"],
        ["Tckn", "Şoför TC", "text", "col-sm-4", "2"],
        ["Email", "E-mail", "text", "col-sm-8", "3"],
        ["Phone", "Telefon", "text", "col-sm-4", "4"],
        ["Address", "Adres", "text", "col-sm-8", "5"],
        ["CreatedDate", "Oluşturulma Tarihi", "disabled", "col-sm-4", "6"]
      ]
    ];

    s.$axios.get("/api/Driver/get-all").then(response => {
      s.pagefunc(pre, s.idLow(response.data.Data), "Driver");
      s.load = true;
    });
  }
  run();
};
