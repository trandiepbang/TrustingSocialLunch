const mongoose = require('mongoose');
const moment = require('moment');
const later = require('later');
const natural = require('natural');

function getGirls() {
    let img_ = `http://i.imgur.com/ey4npOf.jpg
http://i.imgur.com/hGjQJNp.jpg
http://i.imgur.com/wv31Tdu.jpg
http://i.imgur.com/fkkONsg.jpg
http://i.imgur.com/nVaH36A.jpg
http://i.imgur.com/DErxVGt.jpg
http://i.imgur.com/1J8YYXe.jpg
http://i.imgur.com/BmGEyp2.jpg
http://i.imgur.com/KczH6Rc.jpg
http://i.imgur.com/8ZKM3JR.jpg
http://i.imgur.com/Q0jUZfv.jpg
http://i.imgur.com/nLiCpFM.jpg
http://i.imgur.com/3wNep8a.jpg
http://i.imgur.com/WbM9ucP.jpg
http://i.imgur.com/qQKc54y.jpg
http://i.imgur.com/5yJ2BC7.jpg
http://i.imgur.com/GKNJYvA.jpg
http://i.imgur.com/89mMFSX.jpg
http://i.imgur.com/whp17ve.jpg
http://i.imgur.com/YCsBfZn.jpg
http://i.imgur.com/CZx2mUB.jpg
http://i.imgur.com/FbeKwiH.jpg
http://i.imgur.com/LuAYINu.jpg
http://i.imgur.com/cZd1EN1.jpg
http://i.imgur.com/Bbayl7B.jpg
http://i.imgur.com/14H8W35.jpg
http://i.imgur.com/meTn8sr.jpg
http://i.imgur.com/aNBEDHi.jpg
http://i.imgur.com/CjasWpG.jpg
http://i.imgur.com/ndCtnaA.jpg
http://i.imgur.com/Jc72Ods.jpg
http://i.imgur.com/GuTwfEo.jpg
http://i.imgur.com/s2Uqj36.jpg
http://i.imgur.com/eEehfPW.jpg
http://i.imgur.com/sdywu5v.jpg
http://i.imgur.com/wg8UcX4.jpg
http://i.imgur.com/hLQbTrO.jpg
http://i.imgur.com/JhKEpNy.jpg
http://i.imgur.com/wD2kxrT.jpg
http://i.imgur.com/iFUnAog.jpg
http://i.imgur.com/E04TQ6H.jpg
http://i.imgur.com/j5Hntxj.jpg
http://i.imgur.com/JW5jNc6.jpg
http://i.imgur.com/nEu2CwY.jpg
http://i.imgur.com/I4NnZnP.jpg
http://i.imgur.com/2hDiFTB.jpg
http://i.imgur.com/NVsy3k3.jpg
http://i.imgur.com/LddLAqk.jpg
http://i.imgur.com/32NjjYd.jpg
http://i.imgur.com/ptSC7Ht.jpg
http://i.imgur.com/3WBax4i.jpg
http://i.imgur.com/PrggXGx.jpg
http://i.imgur.com/yVLXihQ.jpg
http://i.imgur.com/dFhsril.jpg
http://i.imgur.com/k1ON2GB.jpg
http://i.imgur.com/z5jyCMi.jpg
http://i.imgur.com/DCDq6a4.jpg
http://i.imgur.com/Wa6NbrE.jpg
http://i.imgur.com/3rSc22w.jpg
http://i.imgur.com/EKnV6f4.jpg`;
    img_ = img_.split("\n");
    const rand = img_[Math.floor(Math.random() * img_.length)];
    return rand;
}

function getBoy() {
    let boy_ = `http://imgur.com/TPhj4jM.jpg
http://imgur.com/Ykex2hR.jpg
http://imgur.com/Ci58CQY.jpg
http://imgur.com/YjXfYeF.jpg
http://imgur.com/EefU7Nc.jpg
http://imgur.com/3jNTnKm.jpg
http://imgur.com/GKl2Huh.jpg
http://imgur.com/xmZUlxL.jpg
http://imgur.com/aBXoRuh.jpg
http://imgur.com/RHc14YP.jpg
http://imgur.com/OsnsHUe.jpg
http://imgur.com/FMpAihb.jpg
http://imgur.com/vYlz7Ee.jpg
http://imgur.com/GPhNP9O.jpg
http://imgur.com/KYEEQyz.jpg
http://imgur.com/YlWGesD.jpg
http://imgur.com/PEgNfdI.jpg
http://imgur.com/35DsruY.jpg
http://imgur.com/1kF5AOZ.jpg
http://imgur.com/dvH94vD.jpg
http://imgur.com/iITHirj.jpg
http://imgur.com/M7gsTio.jpg
http://imgur.com/QaOsz74.jpg
http://imgur.com/fKS3OeI.jpg
http://imgur.com/K5mpKE0.jpg
http://imgur.com/h8Bzryi.jpg
http://imgur.com/opG88XJ.jpg
http://imgur.com/IizGUeO.jpg
http://imgur.com/JBahItK.jpg
http://imgur.com/c5WO7mA.jpg
http://imgur.com/lKrinsN.jpg
http://imgur.com/h5DrJ6t.jpg`;
    boy_ = boy_.split("\n");
    const rand = boy_[Math.floor(Math.random() * boy_.length)];
    return rand;
}
module.exports = {
    getGirls,
    getBoy,
};