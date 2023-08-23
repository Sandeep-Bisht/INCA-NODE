let users = require('../../models/user')
const excel = require("exceljs");
exports.getUsers = async (req, res) => {
    try {
        // let response = await users.find({})
        let response = await users.find(); //{ status: { $ne: false } }
        res.send(response)

    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}

exports.deactivateUser = async (req, res) => {
   
    let id = req.params.userId;
    try {
        let user = await users.findOne({ _id: id });
        
        user.status = false;
        let result = await user.save()
        if(result){
            res.send({ message: "User deleted successfully" });
        }

    } catch (error) {
        res.send({ message: "Error occured while deleting records" })
    }
}

exports.activateUser = async (req, res) => {
   
    let id = req.params.userId;
    try {
        let user = await users.findOne({ _id: id });        
         if(user){
            user.status = true;
            let result = await user.save()
        if(result){
            res.send({ message: "User activated successfully" });
        }
         }
        
        

    } catch (error) {
        res.send({ message: "Error occured while activating user" })
    }
}

exports.getUserExcel = async (req, res) => {
    try {
        
        const usersData = await users.find();

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("usersData");
        worksheet.columns = [
            { header: "Name", key: "userName", },
            { header: "Phone Number", key: "mobileNumber", },
            { header: "Email", key: "userEmail", },
        ];

        // Add Array Rows
        
        
        worksheet.addRows(usersData);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "user.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });

    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }

}
