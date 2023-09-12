const isLogin = async(rec, res, next) => {
    try{
        if(rec.session.user){
        }
        else{
            res.redirect('/');
        }
        next();
    }
    catch(error){
        console.log(error.message);
    }
}

const isLogout = async(rec, res, next) => {
    try{
        if(rec.session.user){
            res.redirect('/dashboard');
        }
        next();
    }
    catch(error){
        console.log(error.message);
    }
}

module.exports = { isLogin, isLogout };