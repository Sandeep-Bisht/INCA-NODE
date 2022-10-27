let registredUserInfo = require('../../models/registredUserInfo')
const excel = require("exceljs");
const merge = require('deepmerge')
let transactionDetails = require('../../models/transactionDetails')
exports.downloadUserExcelList = async (req, res) => {
    let response = await registredUserInfo.find({}, {name:1, designation: 1, conferenceMode: 1, registrationCategory: 1, participationType: 1, email: 1, mannualPaymentStatus:1 , registrationFee: 1})
    let arr = []
    const usersList = await transactionDetails.find()
    for (let el of response) {
        for (item of usersList) {
            if (el.email === item.email) {
                if(el.hasOwnProperty('mannualPaymentStatus')){
                    el.mannualPaymentStatus ? el.mannualPaymentStatus : "unpaid"
                }
                else {
                    el.mannualPaymentStatus =  el.mannualPaymentStatus ?  el.mannualPaymentStatus : "unpaid"
                }
                const merged = merge(el, item)
                arr.push(merged._doc)
            }
        }
    }

    try {
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("arr");
        worksheet.columns = [
            { header: "Registration Number", key: "registrationNumber" },
            { header: "Name", key: "name", },
            { header: "Designation", key: "designation" },
            { header: "Email", key: "email", },
            { header: "Fee Paid", key:"mannualPaymentStatus"},
            { header: "Conference Mode", key: "conferenceMode", },
            { header: "Registration Category", key: "registrationCategory" },
            { header: "Participation Type", key: "participationType" },
            { header:"Account HolderName", key:"accountHolderName"},
            { header:"Registration Fee", key:"registrationFee"},
            { header: "Account Number", key: "accountNumber" },
            { header:"Bank Name", key:"bankName"},
            { header:"Transaction Number", key:"transactionNumber"},
            { header:"Reference Number", key:"referenceNumber" },
        ];
        worksheet.addRows(arr);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "VerifiedUserList.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}