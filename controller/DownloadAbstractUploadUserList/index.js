const excel = require("exceljs");
const merge = require('deepmerge')
let abstractPaper = require('../../models/abstractPaper')
let registredUserInfo = require('../../models/registredUserInfo')
exports.downloadAbstractUserList = async (req, res) => {
    let response = await registredUserInfo.find({}, {designation:1, conferenceMode:1, registrationCategory:1, participationType:1, email:1})
    let arr = []
    const usersList = await abstractPaper.find()
    for(let el of response){
        for(item of usersList){
            if(el.email === item.userEmail){
                const merged = merge(el, item)
                arr.push(merged._doc)
            }
        }
    }

    try {
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("arr");
        worksheet.columns = [
            { header: "Registration Number", key:"registrationNumber"},
            { header: "Name", key: "userName", },
            { header: "Email", key: "userEmail", },
            { header: "Document", key: "abstractPaperName",},
            { header:"Theme", key:"themeType",},
            { header: "Designation", key:"designation"},
            { header: "Conference Mode", key: "conferenceMode", },
            { header: "Registration Category", key: "registrationCategory" },
            { header: "Participation Type", key: "participationType"}
        ];
        worksheet.addRows(arr);
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