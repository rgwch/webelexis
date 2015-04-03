package ch.webelexis.tests;

import org.junit.Test;
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.AsyncResultHandler;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.testtools.TestVerticle;
import org.vertx.testtools.VertxAssert;

public class SessionManagerTest extends TestVerticle {
	private static long DELAY = 50;
	private static final String VERTICLE_NAME = "ch.rgw.vertx.SessionManager";
	private static final String ADDRESS = "ch.rgw.sessionmgr.test";
	private static final String TESTUSERS = "testusers";
	private static String PERSISTOR_ADDRESS = "ch.rgw.sessionmgr.test.persistor";
	JsonObject cfg;
	EventBus eb;

	@Override
	public void start() {
		JsonObject mongocfg = new JsonObject().putString("address", PERSISTOR_ADDRESS).putString("db_name",
				"test_rgw_persistor");

		container.deployModule("io.vertx~mod-mongo-persistor~2.1.0", mongocfg, new AsyncResultHandler<String>() {

			@Override
			public void handle(AsyncResult<String> result) {
				if (result.succeeded()) {
					eb = vertx.eventBus();
					eb.send(PERSISTOR_ADDRESS,
							new JsonObject().putString("action", "drop_collection").putString("collection", TESTUSERS),
							new Handler<Message<JsonObject>>() {

								@Override
								public void handle(Message<JsonObject> repl) {
									JsonObject admin = new JsonObject().putString("username", "Administrator")
											.putString("password", "topSecret")
											.putArray("roles", new JsonArray(new String[] { "admin", "user" }));
									JsonObject op = new JsonObject().putString("action", "save").putString("collection", TESTUSERS)
											.putObject("document", admin);
									eb.send(PERSISTOR_ADDRESS, op);
									cfg = new JsonObject().putString("address", ADDRESS)
											.putString("persistor_address", PERSISTOR_ADDRESS).putString("users_collection", TESTUSERS);

									container.deployVerticle(VERTICLE_NAME, cfg, new AsyncResultHandler<String>() {

										@Override
										public void handle(AsyncResult<String> res2) {
											if (res2.succeeded()) {
												SessionManagerTest.super.start();
											} else {
												result.cause().printStackTrace();
											}
										}

									});
								}
							});

				} else {
					result.cause().printStackTrace();
				}

			}

		});
	}

	@Test
	public void createSession() {
		vertx.setTimer(DELAY, new Handler<Long>() {

			@Override
			public void handle(Long arg0) {
				eb.sendWithTimeout(ADDRESS + ".create", "Hello", 30000000L, new Handler<AsyncResult<Message<JsonObject>>>() {

					@Override
					public void handle(AsyncResult<Message<JsonObject>> result) {
						if (result.succeeded()) {
							Message<JsonObject> ans = result.result();

							VertxAssert.assertEquals(ans.body().getString("status"), "ok");
							VertxAssert.assertNotNull(ans.body().getString("sessionID"));
							VertxAssert.testComplete();
						} else {
							result.cause().printStackTrace();
							System.out.print(result.toString());
							VertxAssert.assertTrue(false);
						}

					}
				});

			}

		});

	}

	@Test
	public void authorizeSuccess() {
		vertx.setTimer(DELAY, new Handler<Long>() {

			@Override
			public void handle(Long arg0) {
				eb.send(ADDRESS + ".create", 0, new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> sid) {
						VertxAssert.assertEquals(sid.body().getString("status"), "ok");
						String sessionID = sid.body().getString("sessionID");
						JsonObject op = new JsonObject().putString("sessionID", sessionID).putString("role", "guest");
						eb.send(ADDRESS + ".authorize", op, new Handler<Message<JsonObject>>() {

							@Override
							public void handle(Message<JsonObject> result) {
								VertxAssert.assertEquals(result.body().getString("status"), "ok");
								VertxAssert.testComplete();
							}
						});

					}
				});
			}
		});

	}

	@Test
	public void authorizeFail() {
		vertx.setTimer(DELAY, new Handler<Long>() {

			@Override
			public void handle(Long arg0) {
				eb.send(ADDRESS + ".create", 0, new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> sid) {
						VertxAssert.assertEquals(sid.body().getString("status"), "ok");
						String sessionID = sid.body().getString("sessionID");
						JsonObject op = new JsonObject().putString("sessionID", sessionID).putString("role", "user");
						eb.send(ADDRESS + ".authorize", op, new Handler<Message<JsonObject>>() {

							@Override
							public void handle(Message<JsonObject> result) {
								VertxAssert.assertEquals(result.body().getString("status"), "denied");
								VertxAssert.testComplete();
							}
						});

					}
				});

			}
		});

	}

	@Test
	public void loginOk() {
		vertx.setTimer(DELAY, new Handler<Long>() {

			@Override
			public void handle(Long arg0) {
				eb.send(ADDRESS + ".create", 0, new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> sid) {
						VertxAssert.assertEquals(sid.body().getString("status"), "ok");
						String sessionID = sid.body().getString("sessionID");
						JsonObject op = new JsonObject().putString("sessionID", sessionID).putString("username", "Administrator")
								.putString("password", "topSecret");
						eb.send(ADDRESS + ".login", op, new Handler<Message<JsonObject>>() {

							@Override
							public void handle(Message<JsonObject> result) {
								VertxAssert.assertEquals("ok", result.body().getString("status"));
								VertxAssert.testComplete();
							}
						});

					}
				});

			}
		});

	}

	@Test
	public void loginBadPassword() {
		vertx.setTimer(DELAY, new Handler<Long>() {

			@Override
			public void handle(Long arg0) {
				eb.send(ADDRESS + ".create", 0, new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> sid) {
						VertxAssert.assertEquals(sid.body().getString("status"), "ok");
						String sessionID = sid.body().getString("sessionID");
						JsonObject op = new JsonObject().putString("sessionID", sessionID).putString("username", "Administrator")
								.putString("password", "topSecrez");
						eb.send(ADDRESS + ".login", op, new Handler<Message<JsonObject>>() {

							@Override
							public void handle(Message<JsonObject> result) {
								VertxAssert.assertEquals("denied", result.body().getString("status"));
								VertxAssert.testComplete();
							}
						});

					}
				});

			}

		});

	}

	@Test
	public void unknownUserLoginAttempt() {
		vertx.setTimer(DELAY, new Handler<Long>() {

			@Override
			public void handle(Long arg0) {
				eb.send(ADDRESS + ".create", 0, new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> sid) {
						VertxAssert.assertEquals(sid.body().getString("status"), "ok");
						String sessionID = sid.body().getString("sessionID");
						JsonObject op = new JsonObject().putString("sessionID", sessionID).putString("username", "Admunistrator")
								.putString("password", "topSecret");
						eb.send(ADDRESS + ".login", op, new Handler<Message<JsonObject>>() {

							@Override
							public void handle(Message<JsonObject> result) {
								VertxAssert.assertEquals("user not found", result.body().getString("status"));
								VertxAssert.testComplete();
							}
						});

					}
				});
			}
		});

	}

	@Test
	public void loginAttemptBadSession() {
		vertx.setTimer(DELAY, new Handler<Long>() {

			@Override
			public void handle(Long arg0) {
				eb.send(ADDRESS + ".create", 0, new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> sid) {
						VertxAssert.assertEquals(sid.body().getString("status"), "ok");
						String sessionID = sid.body().getString("sessionID");
						JsonObject op = new JsonObject().putString("sessionID", sessionID + "x")
								.putString("username", "Administrator").putString("password", "topSecret");
						eb.send(ADDRESS + ".login", op, new Handler<Message<JsonObject>>() {

							@Override
							public void handle(Message<JsonObject> result) {
								VertxAssert.assertEquals("error", result.body().getString("status"));
								VertxAssert.testComplete();
							}
						});

					}
				});

			}
		});
	}

	@Test
	public void loginDestroyedSession() {
		vertx.setTimer(DELAY, new Handler<Long>() {

			@Override
			public void handle(Long arg0) {
				eb.send(ADDRESS + ".create", 0, new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> sid) {
						VertxAssert.assertEquals(sid.body().getString("status"), "ok");
						String sessionID = sid.body().getString("sessionID");
						JsonObject op = new JsonObject().putString("sessionID", sessionID);
						eb.send(ADDRESS + ".destroy", op, new Handler<Message<JsonObject>>() {

							@Override
							public void handle(Message<JsonObject> sd) {
								VertxAssert.assertEquals(sd.body().getString("status"), "ok");
								JsonObject op = new JsonObject().putString("sessionID", sessionID)
										.putString("username", "Administrator").putString("password", "topSecret");
								eb.send(ADDRESS + ".login", op, new Handler<Message<JsonObject>>() {

									@Override
									public void handle(Message<JsonObject> result) {
										VertxAssert.assertEquals("error", result.body().getString("status"));
										VertxAssert.testComplete();
									}
								});

							}
						});

					}
				});

			}
		});

	}

	@Test
	public void failAfterLogout() {
		vertx.setTimer(DELAY, new Handler<Long>() {

			@Override
			public void handle(Long arg0) {
				eb.send(ADDRESS + ".create", 0, new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> sid) {
						VertxAssert.assertEquals(sid.body().getString("status"), "ok");
						String sessionID = sid.body().getString("sessionID");
						JsonObject op = new JsonObject().putString("sessionID", sessionID).putString("username", "Administrator")
								.putString("password", "topSecret");
						eb.send(ADDRESS + ".login", op, new Handler<Message<JsonObject>>() {

							@Override
							public void handle(Message<JsonObject> result) {
								VertxAssert.assertEquals("ok", result.body().getString("status"));
								JsonObject op = new JsonObject().putString("sessionID", sessionID);
								eb.send(ADDRESS + ".logout", op, new Handler<Message<JsonObject>>() {

									@Override
									public void handle(Message<JsonObject> arg0) {
										VertxAssert.assertEquals("ok", result.body().getString("status"));
										JsonObject op = new JsonObject().putString("sessionID", sessionID).putString("role", "user");
										eb.send(ADDRESS + ".authorize", op, new Handler<Message<JsonObject>>() {

											@Override
											public void handle(Message<JsonObject> result) {
												VertxAssert.assertEquals(result.body().getString("status"), "denied");
												VertxAssert.testComplete();
											}
										});

									}
								});
							}
						});

					}
				});

			}
		});

	}

	@Test
	public void authorizeLoggedInUser() {
		vertx.setTimer(DELAY, new Handler<Long>() {

			@Override
			public void handle(Long arg0) {
				eb.send(ADDRESS + ".create", 0, new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> sid) {
						VertxAssert.assertEquals(sid.body().getString("status"), "ok");
						String sessionID = sid.body().getString("sessionID");
						JsonObject op = new JsonObject().putString("sessionID", sessionID).putString("username", "Administrator")
								.putString("password", "topSecret");
						eb.send(ADDRESS + ".login", op, new Handler<Message<JsonObject>>() {

							@Override
							public void handle(Message<JsonObject> result) {
								VertxAssert.assertEquals("ok", result.body().getString("status"));
								JsonObject op = new JsonObject().putString("sessionID", sessionID).putString("role", "user");
								eb.send(ADDRESS + ".authorize", op, new Handler<Message<JsonObject>>() {

									@Override
									public void handle(Message<JsonObject> result) {
										VertxAssert.assertEquals(result.body().getString("status"), "ok");
										VertxAssert.testComplete();
									}
								});
							}
						});

					}
				});

			}
		});

	}

}
