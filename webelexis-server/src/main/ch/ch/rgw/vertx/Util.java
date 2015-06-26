/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

package ch.ch.rgw.vertx;

import io.vertx.core.json.JsonArray;

import java.util.ArrayList;
import java.util.Arrays;

/**
 * Created by gerry on 26.06.15.
 */
public class Util {
    public static JsonArray asJsonArray(String[] source) {
        ArrayList<String> ret = (ArrayList<String>) Arrays.asList(source);
        return new JsonArray(ret);
    }

    public static JsonArray asJsonArray(String source) {
        JsonArray ret = new JsonArray().add(source);
        return ret;
    }
}
