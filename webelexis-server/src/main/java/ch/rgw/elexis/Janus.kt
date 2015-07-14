/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich.
 */

package ch.rgw.elexis

/**
 * Created by gerry on 14.07.15.
 */

interface Janus {
  fun push()
}

data class tabledef(table: String, mapping: Map<String, String>)