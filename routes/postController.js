var express = require('express');
var router = express.Router();
var lisP = require('../models/post');
const multer = require('multer');

var ObjectId = require('mongoose').Types.ObjectId;

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, `FunOfHeuristic_${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})


/* ------------------------------------------ traja3lik list ta3 les post l kol -------------------------*/
router.get('/list/post', function(req, res) {
    lisP.find({})
        .exec(function(err, listRes) {
            if (err) {
                console.log("err");
            } else {
                res.json(listRes);
            }
        });
});
router.route('/list/post/:name').get(function(req, res) {
    let name = req.params.name;

    lisP.find({ name }, function(err, listRes) {
        if (err) {
            console.log("err");
        } else {
            res.json(listRes);
        }
    });
});
/*----------------------------------------------------------bch tzid post--------------------------------------*/

router.post('/addPost', upload.single('image'), (req, res) => {
    console.log(req.file);
    var list = new lisP();
    list.username = req.body.username;
    list.text = req.body.text;
    list.jaime = req.body.jaime;
    list.subtext = req.body.subtext;
    list.image = req.body.image;

    list.save((err, registeredUser) => {
        if (err) {
            console.log(err)
        } else {

            res.send(list)
        }
    })
})

/*-------------------------------------------------bch tfasa5 post-------------------------------------------*/
router.delete('/list/post/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    lisP.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); } else { console.log('Error in park Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});


/*----------------------------------------------- bch tmodifi post khw mrigle ----------------------------------------*/
router.put('/list/mpid/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var park = {
        username : req.body.username,
        text : req.body.text,
        jaime : req.body.jaime,
        subtext : req.body.subtext,
        image: req.body.image
    };
    lisP.findByIdAndUpdate(req.params.id, { $set: park }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); } else { console.log('Error in Message Update :' + JSON.stringify(err, undefined, 2)); }
    });
});
router.put('/list/mpn/:name', (req, res) => {


    var park = {
        username : req.body.username,
        text : req.body.text,
        jaime : req.body.jaime,
        subtext : req.body.subtext,
        image: req.body.image

    };
    lisP.findOneAndUpdate({ "name": req.params.name }, { $set: park }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); } else { console.log('Error in Message Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router