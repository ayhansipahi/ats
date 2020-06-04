module.exports = function(s) {
  let companies = {};
  function run() {
    let pre = [
      "Firma",
      [
        ["LogoFilePath", "Logo", "image", "text-center mb-3", "7"],
        ["CompanyName", "Firma Adı", "text", "col-sm-6 col-md-3", "1"],
        [
          "CompanyTradeName",
          "Firma Ticari Adı",
          "text",
          "col-sm-6 col-md-3",
          "2"
        ],
        ["Phone", "Telefon", "text", "col-sm-6 col-md-3", "3"],
        ["Email", "E-mail", "text", "col-sm-6 col-md-3", "0"],
        ["AuthorizedPerson", "Yetkili Kişi", "text", "col-sm-6 col-md-3", "4"],
        [
          "AuthorizedPhone",
          "Yetkili Telefon",
          "text",
          "col-sm-6 col-md-3",
          "5"
        ],
        ["AuthorizedEmail", "Yetkili E-mail", "text", "col-sm-6 col-md-3", "6"],
        [
          "TopCompany",
          "Bağlı Olduğu Firma",
          "select",
          "col-sm-6 col-md-3",
          "0",
          companies
        ]
      ]
    ];

    s.$axios
      .get("/api/Company/get-all")
      .then(response => {
        let data = response.data.Data;

        for (let item in data)
          companies[data[item].Id] = data[item].CompanyName;

        s.pagefunc(pre, s.idLow(data), "Company");
        s.load = true;
      })
      .catch(error => {
        console.log(error);
      });
  }

  run();
};
