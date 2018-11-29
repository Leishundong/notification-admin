import Mock from 'mockjs'
/*Mock.mock('http://115.159.154.194/message/graphql', {//这里的url地址其实可以换成一个字段，比如msg,下边请求时候对应就可以

});*/
Mock.mock('http://115.159.154.194/message/graphql', function(options) {
  console.log(options);
  return Mock.mock({
    "user|1-3": [{
      'name': '@cname',
      'id|+1': 88
    }
    ]
  });
});

Mock.mock('http://123.com',{
  'name|3':'fei',//这个定义数据的模板形式下面会介绍
  'age|20-30':25,
});
