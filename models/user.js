const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, unique: true, sparse:true} ,
    password: String,
    username: String,
    dateOfB: String,
    city: String,
    job: String,
    studyField: String,
    phone: Number,
    sex: String,
    petOwner: Boolean,
    car: Boolean,
    userType: String,
    snoring: Boolean,
    drink: Boolean,
    smok: Boolean,
    religion: String,
    cleaningRate: String,
    cookingRate: String,
});


userSchema.pre('save',  function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            user.verify = hash
            next();
        });
    });
});



userSchema.methods.comparePassword = function(candidatePassword) {
    const user = this;
    return new Promise((resolve,reject)=>{
        bcrypt.compare(candidatePassword,user.password,(err,isMatch)=>{
            if(err){
                return reject(err)
            }
            if (!isMatch){
                return reject(err)
            }
            resolve(true)
        })
    })

}

module.exports = mongoose.model('user', userSchema, 'users');