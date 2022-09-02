const excel = require("exceljs");
let abstractPaper = require('../../models/abstractPaper')

exports.downloadAbstractUserList = async (req, res) => {
    try {
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("abstractPaper");
        worksheet.columns = [
            {header: "Registration Number", key:"registrationNumber"},
            { header: "Name", key: "userName", },
            { header: "Email", key: "userEmail", },
            { header: "Document", key: "abstractPaperName",},
            {header:"Theme", key:"themeType",},
            {header:"Description", key:"abstractPaperDescription",}          

        ];

        // Add Array Rows
        const usersList = await abstractPaper.find()

        worksheet.addRows(usersList);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "AbstractUserList.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });

    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }

}