var cheerio = require('cheerio');
var fs = require('fs');
var glob = require('glob');

const writePath = "/accessibilityAnchors.html";

try {
    var getDirectories = function (src, callback) {
        glob(src + '/**/*', callback);
    };

    getDirectories(__dirname + '/../src/modules', function (err, res) {
        if (err) {
            console.log('Error', err);
        } else {
            res = res.filter((fname) => fname.indexOf('template.html') != -1)
            res.forEach((fName) => {
                checkForMissingTranslations(fName);
            })
        }
    });

    function checkForMissingTranslations(fPath) {
        let filecontents = fs.readFileSync(fPath, "utf8");
        const $ = cheerio.load(filecontents, { lowerCaseTags: false, lowerCaseAttributeNames: false });

        let currentContent = "";
        $("a, button").
            map(function (i, el) {
                if ($(this).find('i, img').length > 0) {
                    let qid = $(this).attr('qid');
                    if(!qid) qid = $(this).attr('[qid]');
                    if(!qid) qid = $(this).attr('[attr.qid]');
                    if(qid) currentContent += qid + '\n';

                    currentContent += $.html(el) + '\n';
                }
            })
        $("input").parent().
        map(function(i,el){
            if($(this).find('i').length > 0)
            currentContent += $.html(el) + ' \n';
        })
        if(currentContent.length > 0)
            currentContent = "******************************  " + fPath.substring(fPath.lastIndexOf('/')) + "  **************************************\n" + currentContent;
        writetoFile(currentContent + "\n\n");

    }


    function writetoFile(filecontent) {
        fs.appendFileSync(__dirname + writePath, filecontent);
    }


} catch (err) {
    console.log(err);
}

