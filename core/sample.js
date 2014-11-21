exports.doProcess = function (json,res,db,mylib){
    res.json(mylib.json_success({"Note":"This is sample core service.","request":json}));
}