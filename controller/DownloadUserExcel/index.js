let registredUserInfo = require('../../models/registredUserInfo')
const excel = require("exceljs");
const merge = require('deepmerge')
let transactionDetails = require('../../models/transactionDetails')
exports.downloadUserExcelList = async (req, res) => {
    let response = await registredUserInfo.find()
    let arr = []
    const usersList = await transactionDetails.find()
    for (let item of response) {
        for (let el of usersList) {
            if (item.email === el.email) {
                item["bankName"] = el.bankName
                item["accountNumber"] = el.accountNumber
                item["transactionNumber"] = el.transactionNumber
                item["referenceNumber"] = el.referenceNumber
                item["mannualPaymentStatus"] = el.mannualPaymentStatus
                arr.push(item)
                break;
            }
            else {
                item["mannualPaymentStatus"] = item.mannualPaymentStatus? item.mannualPaymentStatus : "unpaid"
                arr.push(item)
                break;
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
            { header: "Conference Mode", key: "conferenceMode", },
            { header: "Registration Category", key: "registrationCategory" },
            { header: "Participation Type", key: "participationType" },
            { header: "Account HolderName", key: "accountHolderName" },
            { header: "Registration Fee", key: "registrationFee" },
            { header: "Account Number", key: "accountNumber" },
            { header: "Bank Name", key: "bankName" },
            { header: "Transaction Number", key: "transactionNumber" },
            { header: "Reference Number", key: "referenceNumber" },
            { header: "Payment Status", key: "mannualPaymentStatus" }
        ];
        worksheet.addRows(arr);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "userfeeverifiedlist.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}








