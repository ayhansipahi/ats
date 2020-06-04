module.exports = function(s) {
  function run() {
    let pre = [
      "Araç Tipi",
      [
        ["TypeName", "Araç Tipi Adı", "text", "col-sm-6", "1"],
        [
          "CreatedDate",
          "Oluşturulma Tarihi",
          "disabled",
          "col-sm-6 col-md-3",
          "2"
        ]
      ]
    ];

    s.$axios.get("/api/VehicleType/get-all").then(response => {
      s.pagefunc(pre, s.idLow(response.data.Data), "VehicleType");
      s.load = true;
    });
  }
  run();
};
