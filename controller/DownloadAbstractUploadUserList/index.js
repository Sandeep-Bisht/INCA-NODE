const excel = require("exceljs");
const merge = require('deepmerge')
let abstractPaper = require('../../models/abstractPaper')
let registredUserInfo = require('../../models/registredUserInfo')
exports.downloadAbstractUserList = async (req, res) => {   
    const usersList = await abstractPaper.find()    
     

    try {
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("usersList");
        worksheet.columns = [
            { header: "Registration Number", key:"registrationNumber"},
            { header: "Abstract Number", key:"abstractNumber"},
            { header: "Name", key: "userName", },
            { header: "Email", key: "authorEmail", },
            { header: "Abstract Title", key: "abstractPaperName",},
            { header: "Abstract", key: "abstract",},
            { header:"Theme", key:"themeType",},
            { header: "Paper Status", key: "paperApproveStatus"}
        ];
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