
const express = require('express');
const router = express.Router();

const util = require("../utils/util");



router.post('/tools',function (req,res, next) {
    // console.log("tools---req:{}",req);

    res.json({
        aaa: 1,
        bbb: 1222
    });

});

//爬取天眼查信息
const tyc = require("./tianyancha");
router.get('/tyc',async (req,res,next) => {

    let param = req.query || req.body;
    let companyName = param.name;
    console.log("companyName", companyName);

    if (util.isEmpty(companyName))
    {
        util.printJson(res, 1, "公司名称不能为空");
    }
    else
    {
        let orgInfo = await tyc.getOrgInfo(companyName);
        if (orgInfo)
        {
            util.printJson(res, 0, "获取公司信息成功", orgInfo);
        }
        else
        {
            util.printJson(res, 3, "获取公司信息失败");
        }
    }

});

const Base64 = require('js-base64').Base64;
router.post('/base64',async (req,res,next) => {

    let param = req.body || req.name;



    let encodeUrl = Base64.encode(param.name);


    let data = {"encodeUrl":encodeUrl};

    let decodeUrl = Base64.decode(encodeUrl);

    data.decodeUrl = decodeUrl;

    util.printJson(res, 1, data);


});


module.exports = router;
