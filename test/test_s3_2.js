var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

AWS.config.loadFromPath('./conf/aws.json');
var s3 = new AWS.S3();

 var file = './public/images/IMG_8254.JPG';
 
var params = {
  Bucket: "elasticbeanstalk-us-west-2-618947447952", 
  Key: "aaaaaa", 
  Body: file, 
  ACL: "public-read", 
  ContentType: "application/json"
};


s3.putObject(params, function(err, data) {
  if (err) {
    console.log(err);     
  } else {
    console.log("上傳 JSON 檔案成功!"); 
  }         
});