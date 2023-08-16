const excel = require("exceljs");
const merge = require('deepmerge')
let abstractPaper = require('../../models/abstractPaper')
let registredUserInfo = require('../../models/registredUserInfo')
exports.downloadAbstractUserList = async (req, res) => {   
    const usersList = await abstractPaper.find() 
    const updatedList = [];

   if(usersList){
    let usersListCopy = [...usersList];
    // let updatedList = [];
    
    usersListCopy.map((item, index) => {

        let itemCopy = {"registrationNumber":item.registrationNumber,
                        "abstractNumber":item.abstractNumber,
                        "userName":item.userName,
                        "authorEmail":item.authorEmail,
                        "abstractPaperName":item.abstractPaperName,
                        "abstract":item.abstract,
                        "subThemes":[],
                        "paperApproveStatus":item.paperApproveStatus
                    }

        if(item.themeType.length>0){

            item.themeType.map((el,ind)=>{
                let arr =[];

                el.map((items)=>{
                   return items.name ? arr.push(items.name) : null; 
                })
                itemCopy['subThemes'] = arr;

                
            })
            
        }

        return updatedList.push(itemCopy);
    })
   } 

//    console.log("usersListCopy",updatedList)

    
     

    try {
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("updatedList");
        worksheet.columns = [
            { header: "Registration Number", key:"registrationNumber"},
            { header: "Abstract Number", key:"abstractNumber"},
            { header: "Name", key: "userName", },
            { header: "Email", key: "authorEmail", },
            { header: "Abstract Title", key: "abstractPaperName",},
            { header: "Abstract", key: "abstract",},
            { header:"Sub-Themes", key:"subThemes",},
            { header: "Paper Status", key: "paperApproveStatus"}
        ];
        worksheet.addRows(updatedList);
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