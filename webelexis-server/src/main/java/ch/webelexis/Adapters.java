package ch.webelexis;

import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import java.util.Hashtable;
import java.util.Map;
import java.util.zip.ZipInputStream;

public class Adapters {

  /**
   * Convert an Elexis - ExtInfo entry (byte[]) to a Map<Object,Object>
   *
   * @param extinfo the field contents to decode
   * @return Tha map
   * @throws Exception if something went wrong with decoding
   */
  public static Map<Object, Object> getExtInfoMap(byte[] extinfo) throws Exception {
    ByteArrayInputStream bais = new ByteArrayInputStream(extinfo);
    ZipInputStream zis = new ZipInputStream(bais);
    zis.getNextEntry();
    ObjectInputStream ois = new ObjectInputStream(zis);
    Hashtable<Object, Object> res = (Hashtable<Object, Object>) ois.readObject();
    ois.close();
    bais.close();
    return res;
  }

}
