package ch.webelexis;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

// doesn't work.
public class BusJob {
	Verticle verticle;
	Message<JsonObject> result=null;
	
	public BusJob(Verticle verticle, String address, JsonObject message){
		this.verticle=verticle;
		verticle.getVertx().eventBus().send(address, message,new Handler<Message<JsonObject>>() {
			@Override
			public void handle(Message<JsonObject> answer) {
				result=answer;
			}
		});
	}
	
	/**
	 * Asks if the result is here. Does not block.
	 * @return
	 */
	public boolean isReady(){
		return result!=null;
	}
	
	/**
	 * calls getNow  
	 * @return if getNot returns before timeout: returns result.body(), if result.body().getString("status").equals("ok").
	 * otherwise, returns null.
	 */
	public JsonObject getIfOk(long timeout){
		if(getNow(timeout)==null){
			return null;
		}else{
			JsonObject body=result.body();
			if(body!=null && body.getString("status").equals("ok")){
				return body;
			}else{
				return null;
			}
		}
	}
	
	/**
	 * Returns the Result. Blocks until it's available, or until Timeout is reached.
	 * @return
	 */
	public Message<JsonObject> getNow(final long timeout){
		final Waiter waiter=new Waiter();
		long startTime=System.currentTimeMillis();
		while(!waiter.bFinished){
			if((System.currentTimeMillis()-startTime)>timeout){
				return null;
			}
			verticle.getVertx().setTimer(50, waiter);
		}
		return result;
	}
	
	class Waiter implements Handler<Long>{
		boolean bFinished=false;
		@Override
		public void handle(Long arg0) {
			if(result!=null){
				bFinished=true;
			}
			
		}
		
	}
	
}
