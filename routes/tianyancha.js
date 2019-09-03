const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

module.exports = {

    getOrgInfo: async (companyName) => {
        let emulateType = devices['iPhone 6'];

        //天眼查
        let tycUrl = "https://m.tianyancha.com/";
        //  调测
        //const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'],devtools:true});
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

        try {
            const page = await browser.newPage();
            await page.emulate(emulateType);
            await page.goto(tycUrl);
            //await page.screenshot({path:'1.png'});

            //输入公司名称搜索
            await page.type('#live-search', companyName, {delay: 0});
            //确定
            await page.keyboard.press('Enter');
            try {
                await page.waitFor('.data-content', {timeout: 2000});
                console.log("查找公司名称：" + companyName + " is ok");
            } catch (e) {

                console.log("查找公司名称：" + companyName + " is error");
                return null;
            }

            page.onConsoleMessage = function (msg) {
                console.log('remote> ' + msg);
            };
            let companyLink = await page.evaluate(
                (companyName) => {
                    let companyListElements = document.querySelectorAll('.search-list .data-content .search-company-item');
                    for (const element of companyListElements) {

                        let item = element.querySelector(".clearfix .search-name").children;
                        const _companyUrl = item[0].href;
                        const _companyName = item[0].innerText;
                        console.log("_companyName==", _companyName);
                        if (_companyName === companyName) {
                            return _companyUrl;
                        }
                        return _companyUrl;
                    }
                    return null;
                });

            console.log("companyLink:" + companyLink);

            if (companyLink) {
                await page.goto(companyLink);

                try {
                    //等待2秒加载完毕
                    await page.waitFor('.content-container.pb10', {timeout: 2000});
                } catch (e) {
                    return null;
                }
                const companyInfo = await page.evaluate(() => {
                    const _companyInfo = {};
                    let companyInfoItemElements = document.querySelectorAll('.content-container.pb10')[0].children;
                    for (const element of companyInfoItemElements) {
                        const _itemLabel = element.children[0].innerText;
                        const _itemValue = element.children[1].innerText;
                        if (_itemLabel === '工商注册号：') {
                            _companyInfo.account = _itemValue;
                        }
                        if (_itemLabel === '法定代表人：') {
                            _companyInfo.legalPersonName = _itemValue;
                        }
                        if (_itemLabel === '统一信用代码：') {
                            _companyInfo.creditCode = _itemValue;
                        }
                        if (_itemLabel === '纳税人识别号：') {
                            _companyInfo.orgCode = _itemValue;
                        }
                        if (_itemLabel === '注册资本：') {
                            _companyInfo.regCapital = _itemValue;
                        }
                        if (_itemLabel === '注册时间：') {
                            _companyInfo.estiblishTime = _itemValue;
                        }
                        if (_itemLabel === '企业类型：') {
                            _companyInfo.companyType = _itemValue;
                        }
                        if (_itemLabel === '注册地址：') {
                            _companyInfo.address = _itemValue;
                        }
                        //税费号码
                        _companyInfo.taxpayerNo = _companyInfo.creditCode;

                    }
                    return _companyInfo;
                });

                companyInfo.name = companyName;
                console.log("companyInfo:" + JSON.stringify(companyInfo));
                await browser.close();

                return companyInfo;
            } else {
                await browser.close();
                console.log("未查到对应公司信息");
                return null;
            }

        } catch (e) {
            await browser.close();
            console.log("查询天眼查接口异常:", e);
            return null;

        }
    }

};
