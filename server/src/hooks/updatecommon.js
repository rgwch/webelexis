module.exports=function(options={}){
  return context=>{
    if(context.data){
      context.data.lastupdate=new Date().getTime();
      context.data.deleted="0";
    }
  }
}
