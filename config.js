exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://amcavinue:Bassword53@ds157667.mlab.com:57667/mongo-shopping-list' :
                            'mongodb://amcavinue:Bassword53@ds157667.mlab.com:57667/mongo-shopping-list');
exports.PORT = process.env.PORT || 8080;