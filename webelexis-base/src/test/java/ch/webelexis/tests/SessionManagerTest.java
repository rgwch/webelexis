package ch.webelexis.tests;

import org.junit.Before;
import org.junit.Test;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.testtools.TestVerticle;
import org.vertx.testtools.VertxAssert;

public class SessionManagerTest extends TestVerticle {
	private static final String VERTICLE_NAME = "ch.rgw.vertx.SessionManager";
	private static final String ADDRESS = "ch.rgw.sessionmgr.test";
	private static final String TESTUSERS = "testusers";
	private static String PERSISTOR_ADDRESS = "ch.rgw.sessionmgr.test.persistor";
	JsonObject cfg;
	EventBus eb;

	@Override
	public void start() {
		JsonObject mongocfg = new JsonObject().putString("address",
				PERSISTOR_ADDRESS).putString("db_name", "test_rgw_persistor");

		container.deployModule("io.vertx~mod-mongo-persistor~2.1.0", mongocfg,
				new AsyncResultHandler<String>() {

					@Override
					public void handle(AsyncResult<String> result) {
						if (result.succeeded()) {
							eb = vertx.eventBus();
							eb.send(PERSISTOR_ADDRESS, new JsonObject()
									.putString("action", "drop_collection")
									.putString("collection", TESTUSERS),
									new Handler<Message<JsonObject>>() {

										@Override
										public void handle(
												Message<JsonObject> repl) {
											JsonObject admin = new JsonObject()
													.putString("username",
															"Administrator");
											JsonObject op = new JsonObject()
													.putString("action", "save")
													.putString("collection",
															TESTUSERS)
													.putObject("document",
															admin);
											eb.send(PERSISTOR_ADDRESS, op);
										}
									});
							cfg = new JsonObject()
									.putString("address", ADDRESS)
									.putString("persistor_address",
											PERSISTOR_ADDRESS)
									.putString("users_collection", TESTUSERS);

							SessionManagerTest.super.start();
						} else {
							result.cause().printStackTrace();
						}

					}

				});
	}

	
	@Test
	public void testSession() {
		container.deployVerticle(VERTICLE_NAME, cfg,
				new AsyncResultHandler<String>() {

					@Override
					public void handle(AsyncResult<String> result) {
						if (result.succeeded()) {
							final String did=result.result();
							eb.sendWithTimeout(
									ADDRESS + ".create",
									"Hello",
									30000000L,
									new Handler<AsyncResult<Message<JsonObject>>>() {

										@Override
										public void handle(
												AsyncResult<Message<JsonObject>> result) {
											if (result.succeeded()) {
												Message<JsonObject> ans = result
														.result();

												VertxAssert
														.assertEquals(
																ans.body()
																		.getString(
																				"status"),
																"ok");
												VertxAssert.assertNotNull(ans
														.body().getString(
																"sessionID"));
												container
														.undeployVerticle(did);
												VertxAssert.testComplete();
											} else {
												result.cause()
														.printStackTrace();
												System.out.print(result
														.toString());
												VertxAssert.assertTrue(false);
											}

										}
									});

						} else {
							result.cause().printStackTrace();
							System.out.println(result.toString());
							VertxAssert.assertTrue(false);
						}

					}

				});
	}
}
