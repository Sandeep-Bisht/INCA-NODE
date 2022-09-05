const excel = require("exceljs");
let fullPaper = require('../../models/fullPaper')

exports.downloadFullPaperList = async (req, res) => {
    try {
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("fullPaper");
        worksheet.columns = [
            {header: "Registration Number", key:"registrationNumber"},
            { header: "Name", key: "userName", },
            { header: "Email", key: "userEmail", },
            { header: "Document", key: "fullPaperName",},
            {header:"Theme", key:"themeType",}
        ];

        // Add Array Rows
        const usersList = await fullPaper.find()

        worksheet.addRows(usersList);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "FullPaperList.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });

    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }

}