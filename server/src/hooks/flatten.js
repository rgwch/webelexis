module.exports=fieldlist=>{
  return ctx=>{
    for(const field of fieldlist){
      if(typeof(ctx.data[field])=='object'){
        ctx.data[field]=ctx.data[field].id || null
      }
    }
  }
}
