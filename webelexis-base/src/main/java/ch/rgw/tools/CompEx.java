/*******************************************************************************
 * Copyright (c) 2005-2011, G. Weirich and Elexis
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    G. Weirich - initial implementation
 *    
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 *******************************************************************************/

package ch.rgw.tools;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

/**
 * Compressor/Expander
 */
public class CompEx {
	public static final int NONE = 0;
	public static final int GLZ = 1 << 29;
	public static final int RLL = 2 << 29;
	public static final int HUFF = 3 << 29;
	public static final int BZIP2 = 4 << 29;
	public static final int ZIP = 5 << 29;

	public static final byte[] Compress(String in, int mode) throws Exception {
		if (in == null || in.length() == 0) {
			return null;
		}
		return Compress(in.getBytes("utf-8"), mode);
	}

	public static final byte[] Compress(byte[] in, int mode) throws Exception {
		if (in == null) {
			return null;
		}
		ByteArrayInputStream bais = new ByteArrayInputStream(in);
		return Compress(bais, mode);
	}

	public static final byte[] Compress(InputStream in, int mode) throws Exception {
		if (mode == ZIP) {
			return CompressZIP(in);
		} else {
			throw new Exception("unsupported CompEx mode ");
		}
	}

	public static byte[] CompressZIP(InputStream in) throws Exception {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		byte[] buf = new byte[8192];
		baos.write(buf, 0, 4); // Länge des Originalstroms
		ZipOutputStream zo = new ZipOutputStream(baos);
		zo.putNextEntry(new ZipEntry("Data"));
		int l;
		long total = 0;
		;
		while ((l = in.read(buf, 0, buf.length)) != -1) {
			zo.write(buf, 0, l);
			total += l;
		}
		zo.close();
		byte[] ret = baos.toByteArray();
		// Die höchstwertigen 3 Bit als Typmarker setzen
		total &= 0x1fffffff;
		total |= ZIP;
		BinConverter.intToByteArray((int) total, ret, 0);
		return ret;
	}

	public static byte[] expand(byte[] in) throws Exception {
		if (in == null) {
			return null;
		}
		ByteArrayInputStream bais = new ByteArrayInputStream(in);
		return expand(bais);
	}

	public static byte[] expand(InputStream in) throws Exception {
		ByteArrayOutputStream baos;
		byte[] siz = new byte[4];
		in.read(siz);
		long size = BinConverter.byteArrayToInt(siz, 0);
		long typ = size & ~0x1fffffff;
		size &= 0x1fffffff;
		byte[] ret = new byte[(int) size];

		switch ((int) typ) {
		case ZIP:
			int off = 0;
			int l = 0;
			ZipInputStream zi = new ZipInputStream(in);
			zi.getNextEntry();
			off = 0;
			l = 0;
			while ((l = zi.read(ret, off, ret.length - off)) > 0) {
				off += l;
			}

			zi.close();
			return ret;
		default:
			throw new Exception("Invalid compress format");
		}

	}

}
